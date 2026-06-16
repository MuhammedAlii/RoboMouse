const { app, BrowserWindow, ipcMain, shell, Tray, Menu, nativeImage } = require("electron");
const path = require("path");
const trayI18n = require("./tray-i18n");

let mainWindow;
let tray = null;
let appIsQuitting = false;
let appLang = "tr";
let running = false;
let moveDistancePx = 5;
let loopIntervalMs = 5000;
let macPermissions = null;
let nutApi = null;
let botStartedAt = null;
let trayTimerId = null;
let mouseControlAllowed = false;

const TRAY_DISTANCE_PRESETS = [5, 10, 15, 20];
const TRAY_INTERVAL_PRESETS = [5, 10, 30];

function tt(key) {
  const pack = trayI18n[appLang] || trayI18n.tr;
  return pack[key] || trayI18n.tr[key] || key;
}

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getTrayStatusLabel() {
  if (!running) {
    return `${tt("status")}: ${tt("inactive")}`;
  }

  const elapsed = botStartedAt ? Date.now() - botStartedAt : 0;
  return `${tt("status")}: ${tt("active")} (${formatDuration(elapsed)})`;
}

function getActiveTrayTooltip() {
  const elapsed = botStartedAt ? Date.now() - botStartedAt : 0;
  return `${tt("tooltipActive")} — ${formatDuration(elapsed)}`;
}

function startTrayTimer() {
  stopTrayTimer();
  botStartedAt = Date.now();

  trayTimerId = setInterval(() => {
    if (!tray || !running) {
      stopTrayTimer();
      return;
    }

    tray.setToolTip(getActiveTrayTooltip());
  }, 1000);
}

function stopTrayTimer() {
  if (trayTimerId) {
    clearInterval(trayTimerId);
    trayTimerId = null;
  }

  botStartedAt = null;
}

function removeDefaultApplicationMenu() {
  if (process.platform !== "darwin") {
    Menu.setApplicationMenu(null);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 570,
    resizable: false,
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
    if (process.platform === "darwin" && !appIsQuitting) {
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

  if (trayIconShowsRunning === running) {
    return;
  }

  trayIconShowsRunning = running;
  tray.setImage(running ? getTrayIconActive() : getTrayIconIdle());
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
        startBot({ distancePx: moveDistancePx, intervalSeconds: loopIntervalMs / 1000 });
      }
    },
    {
      label: tt("stop"),
      enabled: running,
      click: () => stopBot()
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
  if (process.platform !== "darwin") {
    return;
  }

  tray = new Tray(getTrayIconIdle());
  tray.setToolTip(tt("tooltip"));
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

function applySettings(distancePx, intervalSeconds) {
  const maybeDistance = parseInt(distancePx, 10);
  if (Number.isFinite(maybeDistance) && maybeDistance > 0) {
    moveDistancePx = maybeDistance;
  }

  const maybeIntervalSeconds = parseFloat(intervalSeconds);
  if (Number.isFinite(maybeIntervalSeconds) && maybeIntervalSeconds > 0) {
    loopIntervalMs = maybeIntervalSeconds * 1000;
  }

  notifyRenderer("settings-updated", {
    distancePx: moveDistancePx,
    intervalSeconds: loopIntervalMs / 1000
  });
  updateTrayMenu();
}

app.whenReady().then(() => {
  removeDefaultApplicationMenu();
  createWindow();
  createTray();
});

app.on("before-quit", () => {
  appIsQuitting = true;
  stopTrayTimer();
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function botLoop() {
  const { mouse, Point, Button } = getNutApi();

  while (running) {
    try {
      await sleep(loopIntervalMs);

      let pos = await mouse.getPosition();
      await mouse.move(new Point(pos.x + moveDistancePx, pos.y));

      await sleep(loopIntervalMs);

      await mouse.click(Button.LEFT);

      await sleep(loopIntervalMs);

      pos = await mouse.getPosition();
      await mouse.move(new Point(pos.x - moveDistancePx, pos.y));
    } catch (error) {
      console.error("Bot loop error:", error);
      running = false;
      stopTrayTimer();
      notifyRenderer("bot-error", { code: "errorMouseControl" });
      updateTrayMenu();
      break;
    }
  }
}

async function startBot(config) {
  const permissionStatus = await getEffectivePermissionStatus();

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
    applySettings(config.distancePx, config.intervalSeconds);
  }

  if (!running) {
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
    botLoop();
    notifyRenderer("bot-started");
    startTrayTimer();
    updateTrayMenu();
    console.log("Bot started");
  }
}

function stopBot() {
  if (!running) {
    return;
  }

  running = false;
  stopTrayTimer();
  notifyRenderer("bot-stopped");
  updateTrayMenu();
  console.log("Bot stopped");
}

ipcMain.handle("get-permissions", async () => {
  const status = await getEffectivePermissionStatus();
  updateTrayMenu();
  return status;
});

ipcMain.on("request-accessibility", () => {
  requestAccessibilityAccess();
});

ipcMain.on("sync-settings", (_event, config) => {
  applySettings(config?.distancePx, config?.intervalSeconds);
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
  stopBot();
});
