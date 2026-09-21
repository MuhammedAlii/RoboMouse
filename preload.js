const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  start: (distancePx, intervalSeconds, schedule, smart, hotkey) =>
    ipcRenderer.send("start-bot", { distancePx, intervalSeconds, schedule, smart, hotkey }),
  stop: () => ipcRenderer.send("stop-bot"),
  syncSettings: (distancePx, intervalSeconds, schedule, smart, hotkey) =>
    ipcRenderer.send("sync-settings", { distancePx, intervalSeconds, schedule, smart, hotkey }),
  getSettings: () => ipcRenderer.invoke("get-settings"),
  setMenuLanguage: lang => ipcRenderer.send("set-menu-language", lang),
  getPermissions: () => ipcRenderer.invoke("get-permissions"),
  requestAccessibility: () => ipcRenderer.send("request-accessibility"),
  onBotStarted: callback => {
    ipcRenderer.on("bot-started", (_event, data) => callback(data));
  },
  onBotStopped: callback => {
    ipcRenderer.on("bot-stopped", (_event, data) => callback(data));
  },
  onBotStartFailed: callback => {
    ipcRenderer.on("bot-start-failed", (_event, data) => callback(data));
  },
  onBotError: callback => {
    ipcRenderer.on("bot-error", (_event, data) => callback(data));
  },
  onSettingsUpdated: callback => {
    ipcRenderer.on("settings-updated", (_event, data) => callback(data));
  },
  onPermissionsChanged: callback => {
    ipcRenderer.on("permissions-changed", () => callback());
  },
  onScheduleTick: callback => {
    ipcRenderer.on("schedule-tick", (_event, data) => callback(data));
  },
  onSmartStateChanged: callback => {
    ipcRenderer.on("smart-state-changed", (_event, data) => callback(data));
  },
  onOpenSettings: callback => {
    ipcRenderer.on("open-settings", () => callback());
  },
  onHotkeyRegisterFailed: callback => {
    ipcRenderer.on("hotkey-register-failed", (_event, data) => callback(data));
  }
});
