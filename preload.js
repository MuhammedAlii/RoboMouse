const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  /**
   * @param {number} distancePx - Mouse'un saga/sola gidecegi piksel mesafesi
   * @param {number} intervalSeconds - Her adim arasindaki sure (saniye)
   */
  start: (distancePx, intervalSeconds) =>
    ipcRenderer.send("start-bot", { distancePx, intervalSeconds }),
  stop: () => ipcRenderer.send("stop-bot"),
  syncSettings: (distancePx, intervalSeconds) =>
    ipcRenderer.send("sync-settings", { distancePx, intervalSeconds }),
  setMenuLanguage: lang => ipcRenderer.send("set-menu-language", lang),
  getPermissions: () => ipcRenderer.invoke("get-permissions"),
  requestAccessibility: () => ipcRenderer.send("request-accessibility"),
  onBotStarted: callback => {
    ipcRenderer.on("bot-started", () => callback());
  },
  onBotStopped: callback => {
    ipcRenderer.on("bot-stopped", () => callback());
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
  }
});
