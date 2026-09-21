const {
  app,
  BrowserWindow,
  ipcMain,
  shell,
  Tray,
  Menu,
  nativeImage,
  powerMonitor,
  globalShortcut
} = require("electron");
const fs = require("fs");
const path = require("path");
const trayI18n = require("./tray-i18n");
const {
  IDLE_THRESHOLD_PRESETS,
  normalizeSmart,
  normalizeHotkey,
  isMeetingForeground,
  evaluatePauseReason,
  getIdleRemainingSeconds
} = require("./smart-detection");

let mainWindow;
let tray = null;
let appIsQuitting = false;
let appLang = "tr";
let running = false;
let automationPaused = false;
let pauseReason = null;
let moveDistancePx = 5;
let loopIntervalMs = 5000;
let macPermissions = null;
let nutApi = null;
let botStartedAt = null;
let trayTimerId = null;
let mouseControlAllowed = false;
let startRequestId = 0;
let meetingDetected = false;
let lastMeetingTickAt = 0;
let activeWinFn = null;
let hotkeyRegistered = false;

const DEFAULT_SCHEDULE = {
  durationEnabled: false,
  durationMinutes: 120,
  stopTimeEnabled: false,
  stopTime: "18:00",
  windowEnabled: false,
  windowStart: "09:00",
  windowEnd: "18:00"
};

const DEFAULT_SMART = {
  idleEnabled: false,
  idleThresholdMinutes: 3,
  meetingEnabled: false,
  presentationMode: false
};

const DEFAULT_HOTKEY = {
  enabled: false,
  accelerator: "CommandOrControl+Shift+M"
};

let scheduleConfig = { ...DEFAULT_SCHEDULE };
let smartConfig = { ...DEFAULT_SMART };
let hotkeyConfig = { ...DEFAULT_HOTKEY };

const TRAY_DISTANCE_PRESETS = [5, 10, 15, 20];
const TRAY_INTERVAL_PRESETS = [5, 10, 30];
const MEETING_TICK_MS = 2000;

function tt(key) {
  const pack = trayI18n[appLang] || trayI18n.tr;
  return pack[key] || trayI18n.tr[key] || key;
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getSettingsPath() {
  return path.join(app.getPath("userData"), "settings.json");
}

function normalizeSchedule(input) {
  const next = { ...DEFAULT_SCHEDULE, ...(input || {}) };
  next.durationMinutes = Math.max(1, parseInt(next.durationMinutes, 10) || DEFAULT_SCHEDULE.durationMinutes);
  next.stopTime = normalizeTimeString(next.stopTime, DEFAULT_SCHEDULE.stopTime);
  next.windowStart = normalizeTimeString(next.windowStart, DEFAULT_SCHEDULE.windowStart);
  next.windowEnd = normalizeTimeString(next.windowEnd, DEFAULT_SCHEDULE.windowEnd);
  next.durationEnabled = Boolean(next.durationEnabled);
  next.stopTimeEnabled = Boolean(next.stopTimeEnabled);
  next.windowEnabled = Boolean(next.windowEnabled);
  return next;
}

function normalizeTimeString(value, fallback) {
  if (typeof value !== "string" || !/^\d{2}:\d{2}$/.test(value)) {
    return fallback;
  }

  const [hours, minutes] = value.split(":").map(part => parseInt(part, 10));
  if (!Number.isFinite(hours) || !Number.isFinite(minutes) || hours > 23 || minutes > 59) {
    return fallback;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(part => parseInt(part, 10));
  return hours * 60 + minutes;
}

function getNowMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function isWithinWorkingWindow(nowMinutes, startMinutes, endMinutes) {
  if (startMinutes === endMinutes) {
    return true;
  }

  if (startMinutes < endMinutes) {
    return nowMinutes >= startMinutes && nowMinutes < endMinutes;
  }

  return nowMinutes >= startMinutes || nowMinutes < endMinutes;
}

function getScheduleHint() {
  const hints = [];

  if (scheduleConfig.durationEnabled) {
    hints.push(`${tt("scheduleDurationShort")} ${scheduleConfig.durationMinutes}${tt("unitMin")}`);
  }

  if (scheduleConfig.stopTimeEnabled) {
    hints.push(`${tt("scheduleStopAtShort")} ${scheduleConfig.stopTime}`);
  }

  if (scheduleConfig.windowEnabled) {
    hints.push(`${scheduleConfig.windowStart}–${scheduleConfig.windowEnd}`);
  }

  return hints.join(" · ");
}

function getSmartHintTray() {
  if (!running || !automationPaused || !pauseReason) {
    return "";
  }

  const map = {
    idle: "smartHintIdle",
    meeting: "smartHintMeeting",
    presentation: "smartHintPresentation"
  };

  const key = map[pauseReason];
  return key ? tt(key) : "";
}

function getTrayStatusLabel() {
  if (!running) {
    return `${tt("status")}: ${tt("inactive")}`;
  }

  const elapsed = botStartedAt ? Date.now() - botStartedAt : 0;
  const hints = [getScheduleHint(), getSmartHintTray()].filter(Boolean);
  const statusWord = automationPaused ? tt("paused") : tt("active");
  const base = `${tt("status")}: ${statusWord} (${formatDuration(elapsed)})`;
  return hints.length ? `${base} · ${hints.join(" · ")}` : base;
}

function getActiveTrayTooltip() {
  const elapsed = botStartedAt ? Date.now() - botStartedAt : 0;
  const hints = [getScheduleHint(), getSmartHintTray()].filter(Boolean);
  const base = automationPaused
    ? `${tt("tooltipPaused")} — ${formatDuration(elapsed)}`
    : `${tt("tooltipActive")} — ${formatDuration(elapsed)}`;
  return hints.length ? `${base} · ${hints.join(" · ")}` : base;
}

function getNextScheduleStopMs() {
  const candidates = [];

  if (scheduleConfig.durationEnabled && botStartedAt) {
    candidates.push(botStartedAt + scheduleConfig.durationMinutes * 60000);
  }

  if (scheduleConfig.stopTimeEnabled) {
    const stopMinutes = timeToMinutes(scheduleConfig.stopTime);
    const now = new Date();
    const target = new Date(now);
    target.setSeconds(0, 0);
    target.setHours(Math.floor(stopMinutes / 60), stopMinutes % 60, 0, 0);

    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }

    candidates.push(target.getTime());
  }

  if (scheduleConfig.windowEnabled) {
    const endMinutes = timeToMinutes(scheduleConfig.windowEnd);
    const now = new Date();
    const target = new Date(now);
    target.setSeconds(0, 0);
    target.setHours(Math.floor(endMinutes / 60), endMinutes % 60, 0, 0);

    const startMinutes = timeToMinutes(scheduleConfig.windowStart);
    if (startMinutes < endMinutes && target.getTime() <= now.getTime()) {
      return null;
    }

    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }

    candidates.push(target.getTime());
  }

  if (!candidates.length) {
    return null;
  }

  return Math.min(...candidates);
}

function evaluateScheduleStop() {
  if (!running || !botStartedAt) {
    return null;
  }

  if (scheduleConfig.durationEnabled) {
    const elapsedMs = Date.now() - botStartedAt;
    if (elapsedMs >= scheduleConfig.durationMinutes * 60000) {
      return "schedule-duration";
    }
  }

  if (scheduleConfig.stopTimeEnabled) {
    const nowMinutes = getNowMinutes();
    const stopMinutes = timeToMinutes(scheduleConfig.stopTime);
    if (nowMinutes >= stopMinutes) {
      return "schedule-time";
    }
  }

  if (scheduleConfig.windowEnabled) {
    const nowMinutes = getNowMinutes();
    const startMinutes = timeToMinutes(scheduleConfig.windowStart);
    const endMinutes = timeToMinutes(scheduleConfig.windowEnd);

    if (!isWithinWorkingWindow(nowMinutes, startMinutes, endMinutes)) {
      return "schedule-window";
    }
  }

  return null;
}

async function getActiveWindowInfo() {
  if (!smartConfig.meetingEnabled) {
    return null;
  }

  try {
    if (!activeWinFn) {
      const mod = await import("active-win");
      activeWinFn = mod.default || mod;
    }

    return await activeWinFn();
  } catch (error) {
    console.warn("active-win failed:", error.message);
    return null;
  }
}

async function meetingTick() {
  if (!smartConfig.meetingEnabled) {
    meetingDetected = false;
    return;
  }

  const activeWindow = await getActiveWindowInfo();
  meetingDetected = isMeetingForeground(activeWindow);
}

function getSmartStatePayload() {
  const idleSeconds = powerMonitor.getSystemIdleTime();
  const payload = {
    sessionActive: running,
    automationPaused,
    pauseReason,
    idleSeconds,
    meetingDetected,
    smart: { ...smartConfig },
    hotkey: { ...hotkeyConfig }
  };

  if (running && pauseReason === "idle" && smartConfig.idleEnabled) {
    payload.idleRemainingSeconds = getIdleRemainingSeconds(
      idleSeconds,
      smartConfig.idleThresholdMinutes
    );
  }

  return payload;
}

function notifySmartState() {
  notifyRenderer("smart-state-changed", getSmartStatePayload());
}

function setAutomationPause(nextPaused, nextReason) {
  const changed =
    automationPaused !== nextPaused || (nextPaused && pauseReason !== nextReason);

  automationPaused = nextPaused;
  pauseReason = nextPaused ? nextReason : null;

  if (changed) {
    notifySmartState();
    updateTrayMenu();
  }
}

function updateAutomationPause() {
  if (!running) {
    setAutomationPause(false, null);
    return;
  }

  const idleSeconds = powerMonitor.getSystemIdleTime();
  const nextReason = evaluatePauseReason({
    smartConfig,
    idleSeconds,
    meetingDetected
  });

  setAutomationPause(Boolean(nextReason), nextReason);
}

async function smartTick() {
  const now = Date.now();

  if (smartConfig.meetingEnabled && now - lastMeetingTickAt >= MEETING_TICK_MS) {
    lastMeetingTickAt = now;
    await meetingTick();
  } else if (!smartConfig.meetingEnabled) {
    meetingDetected = false;
  }

  if (
    smartConfig.idleEnabled ||
    smartConfig.meetingEnabled ||
    smartConfig.presentationMode
  ) {
    updateAutomationPause();
  } else {
    setAutomationPause(false, null);
  }
}

function scheduleTick() {
  const reason = evaluateScheduleStop();
  if (reason) {
    stopBot({ reason });
    return;
  }

  void smartTick();

  const nextStopMs = getNextScheduleStopMs();
  notifyRenderer("schedule-tick", {
    schedule: { ...scheduleConfig },
    nextStopMs,
    nextStopInMs: nextStopMs ? Math.max(0, nextStopMs - Date.now()) : null
  });
}

function startTrayTimer() {
  stopTrayTimer();
  botStartedAt = Date.now();
  lastMeetingTickAt = 0;

  trayTimerId = setInterval(() => {
    if (!tray || !running) {
      stopTrayTimer();
      return;
    }

    scheduleTick();
    if (!running) {
      return;
    }

    tray.setToolTip(getActiveTrayTooltip());
    updateTrayMenu();
  }, 1000);
}

function stopTrayTimer() {
  if (trayTimerId) {
    clearInterval(trayTimerId);
    trayTimerId = null;
  }

  botStartedAt = null;
  meetingDetected = false;
  lastMeetingTickAt = 0;
}

function removeDefaultApplicationMenu() {
  if (process.platform !== "darwin") {
    Menu.setApplicationMenu(null);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 720,
    minWidth: 440,
    minHeight: 640,
    maxWidth: 520,
    resizable: true,
    autoHideMenuBar: true,
    backgroundColor: "#080c14",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("focus", () => {
    notifyRenderer("permissions-changed");
  });

  mainWindow.on("show", () => {
    notifyRenderer("permissions-changed");
  });

  mainWindow.on("close", event => {
    if (!appIsQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.loadFile("index.html");
}

const TRAY_POINT_SIZE = 32;
const TRAY_SCALE_FACTOR = 2;

function createRetinaTrayImage(
  sourceImage,
  pointSize = TRAY_POINT_SIZE,
  scaleFactor = TRAY_SCALE_FACTOR
) {
  if (sourceImage.isEmpty()) {
    return nativeImage.createEmpty();
  }

  if (process.platform !== "darwin") {
    return sourceImage.resize({
      width: pointSize,
      height: pointSize,
      quality: "best"
    });
  }

  const pixelSize = pointSize * scaleFactor;
  const currentSize = sourceImage.getSize();
  const resized =
    currentSize.width === pixelSize && currentSize.height === pixelSize
      ? sourceImage
      : sourceImage.resize({
          width: pixelSize,
          height: pixelSize,
          quality: "best"
        });

  return nativeImage.createFromBuffer(resized.toPNG(), {
    width: pointSize,
    height: pointSize,
    scaleFactor
  });
}

let trayIconIdle = null;
let trayIconActive = null;
let trayIconShowsRunning = null;

function getTrayIconIdle() {
  if (trayIconIdle) {
    return trayIconIdle;
  }

  const iconPath = path.join(__dirname, "tray-icon-idle.png");
  const image = nativeImage.createFromPath(iconPath);

  if (image.isEmpty()) {
    const fallback = nativeImage.createFromPath(path.join(__dirname, "icon.png"));
    trayIconIdle = createRetinaTrayImage(fallback);
    return trayIconIdle;
  }

  trayIconIdle = createRetinaTrayImage(image);
  return trayIconIdle;
}

function getTrayIconActive() {
  if (trayIconActive) {
    return trayIconActive;
  }

  const iconPath = path.join(__dirname, "tray-icon-active.png");
  const image = nativeImage.createFromPath(iconPath);

  if (image.isEmpty()) {
    trayIconActive = getTrayIconIdle();
    return trayIconActive;
  }

  trayIconActive = createRetinaTrayImage(image);
  return trayIconActive;
}

function updateTrayIcon() {
  if (!tray) {
    return;
  }

  const showActive = running && !automationPaused;

  if (trayIconShowsRunning === showActive) {
    return;
  }

  trayIconShowsRunning = showActive;
  tray.setImage(showActive ? getTrayIconActive() : getTrayIconIdle());
}

function togglePresentationMode() {
  smartConfig.presentationMode = !smartConfig.presentationMode;
  persistSettings();
  updateAutomationPause();
  updateTrayMenu();
}

function updateTrayMenu() {
  if (!tray) {
    return;
  }

  updateTrayIcon();
  tray.setToolTip(running ? getActiveTrayTooltip() : tt("tooltip"));

  const menu = Menu.buildFromTemplate([
    {
      label: getTrayStatusLabel(),
      enabled: false
    },
    { type: "separator" },
    {
      label: tt("start"),
      enabled: !running && mouseControlAllowed,
      click: () => {
        startBot({
          distancePx: moveDistancePx,
          intervalSeconds: loopIntervalMs / 1000,
          schedule: scheduleConfig,
          smart: smartConfig,
          hotkey: hotkeyConfig
        });
      }
    },
    {
      label: tt("stop"),
      enabled: running,
      click: () => stopBot({ reason: "manual" })
    },
    { type: "separator" },
    {
      label: tt("presentationMode"),
      type: "checkbox",
      checked: smartConfig.presentationMode,
      click: () => togglePresentationMode()
    },
    { type: "separator" },
    {
      label: tt("distance"),
      submenu: TRAY_DISTANCE_PRESETS.map(px => ({
        label: `${px} ${tt("unitPx")}`,
        type: "radio",
        checked: moveDistancePx === px,
        click: () => applySettings(px, loopIntervalMs / 1000)
      }))
    },
    {
      label: tt("interval"),
      submenu: TRAY_INTERVAL_PRESETS.map(sec => ({
        label: `${sec} ${tt("unitSec")}`,
        type: "radio",
        checked: loopIntervalMs === sec * 1000,
        click: () => applySettings(moveDistancePx, sec)
      }))
    },
    { type: "separator" },
    {
      label: tt("openSettings"),
      click: () => {
        showMainWindow();
        notifyRenderer("open-settings");
      }
    },
    {
      label: tt("openPanel"),
      click: () => showMainWindow()
    },
    {
      label: tt("quit"),
      click: () => {
        appIsQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(menu);
}

function createTray() {
  tray = new Tray(getTrayIconIdle());
  tray.setToolTip(tt("tooltip"));
  tray.on("double-click", () => showMainWindow());
  updateTrayMenu();
}

function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow();
    return;
  }

  if (!mainWindow.isVisible()) {
    mainWindow.show();
  }

  mainWindow.focus();
}

function getPublicSettings() {
  return {
    distancePx: moveDistancePx,
    intervalSeconds: loopIntervalMs / 1000,
    schedule: { ...scheduleConfig },
    smart: { ...smartConfig },
    hotkey: { ...hotkeyConfig }
  };
}

function persistSettings() {
  try {
    fs.mkdirSync(app.getPath("userData"), { recursive: true });
    fs.writeFileSync(getSettingsPath(), JSON.stringify(getPublicSettings(), null, 2), "utf8");
  } catch (error) {
    console.warn("Could not persist settings:", error.message);
  }
}

function loadSettings() {
  try {
    const raw = fs.readFileSync(getSettingsPath(), "utf8");
    const saved = JSON.parse(raw);
    applySettings(saved.distancePx, saved.intervalSeconds, saved.schedule, {
      persist: false,
      smart: saved.smart,
      hotkey: saved.hotkey
    });
  } catch (error) {
    scheduleConfig = normalizeSchedule(DEFAULT_SCHEDULE);
    smartConfig = normalizeSmart(DEFAULT_SMART);
    hotkeyConfig = normalizeHotkey(DEFAULT_HOTKEY);
  }
}

function applySettings(distancePx, intervalSeconds, schedule, options = {}) {
  const maybeDistance = parseInt(distancePx, 10);
  if (Number.isFinite(maybeDistance) && maybeDistance > 0) {
    moveDistancePx = maybeDistance;
  }

  const maybeIntervalSeconds = parseFloat(intervalSeconds);
  if (Number.isFinite(maybeIntervalSeconds) && maybeIntervalSeconds > 0) {
    loopIntervalMs = maybeIntervalSeconds * 1000;
  }

  if (schedule) {
    scheduleConfig = normalizeSchedule(schedule);
  }

  if (options.smart !== undefined) {
    smartConfig = normalizeSmart(options.smart);
  }

  if (options.hotkey !== undefined) {
    hotkeyConfig = normalizeHotkey(options.hotkey);
    syncHotkeyRegistration();
  }

  if (options.persist !== false) {
    persistSettings();
  }

  updateAutomationPause();
  notifyRenderer("settings-updated", getPublicSettings());
  updateTrayMenu();
}

function canStartWithinSchedule() {
  if (!scheduleConfig.windowEnabled) {
    return true;
  }

  const nowMinutes = getNowMinutes();
  const startMinutes = timeToMinutes(scheduleConfig.windowStart);
  const endMinutes = timeToMinutes(scheduleConfig.windowEnd);
  return isWithinWorkingWindow(nowMinutes, startMinutes, endMinutes);
}

function unregisterHotkey() {
  if (!hotkeyRegistered) {
    return;
  }

  try {
    globalShortcut.unregister(hotkeyConfig.accelerator);
  } catch (error) {
    console.warn("Hotkey unregister failed:", error.message);
  }

  hotkeyRegistered = false;
}

function registerHotkey() {
  unregisterHotkey();

  if (!hotkeyConfig.enabled) {
    return;
  }

  try {
    const ok = globalShortcut.register(hotkeyConfig.accelerator, () => {
      if (running) {
        stopBot({ reason: "manual" });
      } else {
        startBot({
          distancePx: moveDistancePx,
          intervalSeconds: loopIntervalMs / 1000,
          schedule: scheduleConfig,
          smart: smartConfig,
          hotkey: hotkeyConfig
        });
      }
    });

    if (!ok) {
      hotkeyConfig.enabled = false;
      persistSettings();
      notifyRenderer("hotkey-register-failed", { accelerator: hotkeyConfig.accelerator });
      notifyRenderer("settings-updated", getPublicSettings());
      return;
    }

    hotkeyRegistered = true;
  } catch (error) {
    console.warn("Hotkey register failed:", error.message);
    hotkeyConfig.enabled = false;
    persistSettings();
    notifyRenderer("hotkey-register-failed", { accelerator: hotkeyConfig.accelerator });
    notifyRenderer("settings-updated", getPublicSettings());
  }
}

function syncHotkeyRegistration() {
  if (hotkeyConfig.enabled) {
    registerHotkey();
  } else {
    unregisterHotkey();
  }
}

app.whenReady().then(() => {
  loadSettings();
  removeDefaultApplicationMenu();
  createWindow();
  createTray();
  syncHotkeyRegistration();
});

app.on("will-quit", () => {
  unregisterHotkey();
});

app.on("before-quit", () => {
  appIsQuitting = true;
  stopBot({ reason: "manual" });
});

app.on("activate", () => {
  showMainWindow();
});

function getMacPermissions() {
  if (process.platform !== "darwin") {
    return null;
  }

  if (!macPermissions) {
    try {
      macPermissions = require("@nut-tree-fork/node-mac-permissions");
    } catch (error) {
      console.warn("macOS permissions module unavailable:", error.message);
    }
  }

  return macPermissions;
}

function getPermissionStatus() {
  const permissions = getMacPermissions();

  if (!permissions) {
    return {
      platform: process.platform,
      accessibility: "unknown",
      appPath: process.execPath
    };
  }

  return {
    platform: process.platform,
    accessibility: permissions.getAuthStatus("accessibility"),
    appPath: process.execPath
  };
}

async function probeMouseAccess() {
  try {
    const { mouse, Point } = getNutApi();
    const pos = await mouse.getPosition();
    await mouse.move(new Point(pos.x + 1, pos.y));
    await mouse.move(new Point(pos.x, pos.y));
    return true;
  } catch (error) {
    console.warn("Mouse control probe failed:", error.message);
    return false;
  }
}

async function getEffectivePermissionStatus() {
  const status = getPermissionStatus();

  if (process.platform === "darwin") {
    if (status.accessibility !== "authorized") {
      mouseControlAllowed = false;
      return {
        ...status,
        working: false,
        effective: false
      };
    }

    const canControl = await probeMouseAccess();
    mouseControlAllowed = canControl;
    return {
      ...status,
      working: canControl,
      effective: canControl
    };
  }

  const canControl = await probeMouseAccess();
  mouseControlAllowed = canControl;
  return {
    ...status,
    working: canControl,
    effective: canControl
  };
}

function requestAccessibilityAccess() {
  const permissions = getMacPermissions();

  if (permissions) {
    permissions.askForAccessibilityAccess();
  }

  shell.openExternal(
    "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility"
  );
}

function getNutApi() {
  if (!nutApi) {
    nutApi = require("@nut-tree-fork/nut-js");
  }

  return nutApi;
}

function notifyRenderer(channel, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, payload);
  }
}

async function interruptibleSleep(ms, shouldContinue) {
  const step = 100;
  let remaining = ms;

  while (remaining > 0) {
    if (!shouldContinue()) {
      return false;
    }

    const chunk = Math.min(step, remaining);
    await new Promise(resolve => setTimeout(resolve, chunk));
    remaining -= chunk;
  }

  return shouldContinue();
}

function shouldAutomate() {
  return running && !automationPaused;
}

async function botLoop() {
  const { mouse, Point, Button } = getNutApi();
  const shouldContinue = () => running;

  while (running) {
    try {
      if (!shouldAutomate()) {
        if (!(await interruptibleSleep(100, shouldContinue))) {
          break;
        }
        continue;
      }

      if (!(await interruptibleSleep(loopIntervalMs, shouldContinue))) {
        break;
      }

      if (!shouldAutomate()) {
        continue;
      }

      let pos = await mouse.getPosition();
      if (!running) {
        break;
      }

      await mouse.move(new Point(pos.x + moveDistancePx, pos.y));

      if (!(await interruptibleSleep(loopIntervalMs, shouldContinue))) {
        break;
      }

      if (!shouldAutomate()) {
        continue;
      }

      await mouse.click(Button.LEFT);

      if (!(await interruptibleSleep(loopIntervalMs, shouldContinue))) {
        break;
      }

      if (!shouldAutomate()) {
        continue;
      }

      pos = await mouse.getPosition();
      await mouse.move(new Point(pos.x - moveDistancePx, pos.y));
    } catch (error) {
      console.error("Bot loop error:", error);
      running = false;
      automationPaused = false;
      pauseReason = null;
      stopTrayTimer();
      notifyRenderer("bot-error", { code: "errorMouseControl" });
      updateTrayMenu();
      break;
    }
  }
}

async function startBot(config) {
  const requestId = ++startRequestId;

  if (config?.schedule) {
    scheduleConfig = normalizeSchedule(config.schedule);
    persistSettings();
  }

  if (config?.smart) {
    smartConfig = normalizeSmart(config.smart);
    persistSettings();
  }

  if (!canStartWithinSchedule()) {
    notifyRenderer("bot-start-failed", { code: "errorOutsideWindow" });
    showMainWindow();
    updateTrayMenu();
    return;
  }

  const permissionStatus = await getEffectivePermissionStatus();

  if (requestId !== startRequestId) {
    return;
  }

  if (!permissionStatus.working) {
    notifyRenderer("bot-start-failed", {
      code:
        permissionStatus.accessibility === "denied"
          ? "errorAccessibilityDeniedReset"
          : "errorAccessibilityRequired"
    });
    showMainWindow();
    requestAccessibilityAccess();
    updateTrayMenu();
    return;
  }

  if (config) {
    applySettings(config.distancePx, config.intervalSeconds, config.schedule, {
      persist: true,
      smart: config.smart,
      hotkey: config.hotkey
    });
  }

  if (requestId !== startRequestId || running) {
    return;
  }

  try {
    getNutApi();
  } catch (error) {
    console.error("nut-js load error:", error);
    notifyRenderer("bot-start-failed", { code: "errorMouseLibLoad" });
    showMainWindow();
    updateTrayMenu();
    return;
  }

  running = true;
  automationPaused = false;
  pauseReason = null;
  botLoop();
  updateAutomationPause();
  notifyRenderer("bot-started", getPublicSettings());
  notifySmartState();
  startTrayTimer();
  scheduleTick();
  updateTrayMenu();
  console.log("Bot started");
}

function stopBot(options = {}) {
  startRequestId += 1;

  if (!running) {
    return;
  }

  const reason = options.reason || "manual";
  running = false;
  automationPaused = false;
  pauseReason = null;
  meetingDetected = false;
  trayIconShowsRunning = null;
  stopTrayTimer();
  notifyRenderer("bot-stopped", { reason });
  notifySmartState();
  updateTrayMenu();
  console.log("Bot stopped:", reason);
}

ipcMain.handle("get-permissions", async () => {
  const status = await getEffectivePermissionStatus();
  updateTrayMenu();
  return status;
});

ipcMain.handle("get-settings", () => getPublicSettings());

ipcMain.on("request-accessibility", () => {
  requestAccessibilityAccess();
});

ipcMain.on("sync-settings", (_event, config) => {
  applySettings(config?.distancePx, config?.intervalSeconds, config?.schedule, {
    smart: config?.smart,
    hotkey: config?.hotkey
  });
});

ipcMain.on("set-menu-language", (_event, lang) => {
  if (trayI18n[lang]) {
    appLang = lang;
    updateTrayMenu();
  }
});

ipcMain.on("start-bot", (_event, config) => {
  startBot(config);
});

ipcMain.on("stop-bot", () => {
  stopBot({ reason: "manual" });
});
