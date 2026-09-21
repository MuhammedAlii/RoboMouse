# 🖱️ roboMouse

**Keep your computer awake with gentle, configurable mouse automation.**

roboMouse is a lightweight desktop utility built with Electron and [nut-js](https://github.com/nut-tree/nut.js). It moves the cursor on a timed loop so your system stays active — useful during long downloads, builds, or remote sessions.

| | |
|---|---|
| **Version** | 1.2.0 |
| **License** | ISC |
| **Platforms** | macOS 12+, Windows x64, Linux x64 |
| **Languages** | Türkçe · English · Deutsch · Русский |

---

## 📦 Download

Pre-built binaries are on the [**Releases**](https://github.com/MuhammedAlii/RoboMouse/releases) page.

> ⚠️ **Do not download "Source code (zip)"** — that is the GitHub repo source, not the app.  
> Scroll to **Assets** and download the platform file below.

| Platform | File | Notes |
|----------|------|-------|
| **macOS** (Apple Silicon) | `roboMouse-1.2.0-arm64.dmg` | Drag to Applications |
| **Windows** | `roboMouse-1.2.0-portable-x64.exe` | Portable — double-click to run |
| **Windows** | `roboMouse-1.2.0-win-x64.zip` | Extract folder → run `roboMouse.exe` |
| **Linux** | `roboMouse-1.2.0.AppImage` | `chmod +x` then run |
| **Linux** | `roboMouse_1.2.0_amd64.deb` | `sudo dpkg -i …` |

---

## ✨ Features

### Core (v1.1)

- **Auto-stop scheduling** — duration limit, daily stop time (e.g. 18:00), or working window (e.g. 09:00–18:00)
- **Instant stop** — panel and tray stop respond immediately
- **Automated loop** — move right → wait → left click → move back → repeat
- **Configurable settings** — movement distance (px) and loop interval (seconds)
- **Permission-aware UX** — start is disabled until mouse control is verified (macOS Accessibility)
- **In-app help** — animated walkthrough with optional voice guidance

### Smart Control (v1.2) — all opt-in, off by default

| Feature | Description |
|---------|-------------|
| **Smart Idle** | Only jiggles the mouse after you have been idle for a set threshold (1–15 min) |
| **Meeting Safe** | Pauses when Zoom, Teams, Webex, or browser Meet is in the foreground |
| **Presentation mode** | Manual toggle — always pause automation |
| **Global hotkey** | `Cmd+Shift+M` / `Ctrl+Shift+M` toggles start/stop (enable in Settings) |
| **System tray** | macOS, Windows, and Linux — start/stop, presets, presentation mode, settings |
| **Settings sheet** | Clean main panel; schedule + smart modes live in the gear menu |

> Until you enable smart modes in **Settings**, the app behaves like v1.1 (immediate movement on Start).

---

## 🔄 How it works

```
Start → wait (interval) → move right → wait → left click → move left → repeat
```

With **Smart Idle** enabled:

```
Start → session active → wait until idle threshold → then loop as above
```

| Setting | Description | Default |
|---------|-------------|---------|
| Mouse distance | Horizontal movement per step | 5 px |
| Loop interval | Pause between steps | 5 s |
| Smart Idle | Run only when user is idle | Off |
| Meeting pause | Pause in meeting apps | Off |
| Global hotkey | Toggle session | Off |

Tray presets: distance **5 / 10 / 15 / 20 px**, interval **5 / 10 / 30 s**.

---

## ⌨️ Shortcuts

| Shortcut | Action | Default |
|----------|--------|---------|
| `Cmd+Shift+M` (macOS) | Toggle start/stop | Off — enable in Settings |
| `Ctrl+Shift+M` (Win/Linux) | Toggle start/stop | Off — enable in Settings |

---

## 🚀 Quick start

### 🍎 macOS

1. Download the `.dmg` from [Releases](https://github.com/MuhammedAlii/RoboMouse/releases).
2. Move **roboMouse** to **Applications**.
3. Grant **Accessibility** permission:  
   **System Settings → Privacy & Security → Accessibility → roboMouse**
4. Launch the app and press **Start**.

If macOS blocks the app (unsigned build): **Right-click → Open**.

### 🪟 Windows

1. Open [Releases](https://github.com/MuhammedAlii/RoboMouse/releases) → **Assets**.
2. Download **`roboMouse-1.2.0-portable-x64.exe`** *(recommended)* **or** **`roboMouse-1.2.0-win-x64.zip`**.
3. **Portable:** double-click the `.exe`.
4. **Zip:** extract the archive → open the folder → run **`roboMouse.exe`**.

Windows SmartScreen may warn on unsigned builds — **More info → Run anyway**.

### 🐧 Linux

**AppImage**

```bash
chmod +x roboMouse-1.2.0.AppImage
./roboMouse-1.2.0.AppImage
```

**Debian / Ubuntu**

```bash
sudo dpkg -i roboMouse_1.2.0_amd64.deb
```

Depending on your desktop environment, additional input permissions may be required.

---

## 🔐 macOS Accessibility

roboMouse needs **Accessibility** permission to control the mouse. The start button stays disabled until access is confirmed.

After an update or reinstall, toggle the permission off and on in System Settings, then restart the app.

---

## 🛠️ Development

### Requirements

- Node.js 18+
- ImageMagick (`magick`) — only for regenerating tray icons

### Setup

```bash
git clone https://github.com/MuhammedAlii/RoboMouse.git
cd roboMouse
npm install
npm start
```

### Build commands

| Command | Output |
|---------|--------|
| `npm run build:mac:local` | `dist/roboMouse-1.2.0-arm64.dmg` |
| `npm run build:win:local` | Portable `.exe` + `.zip` |
| `npm run build:linux:local` | AppImage + `.deb` |
| `npm run build:all:local` | All platforms |
| `npm run generate:tray-icons` | macOS tray icons |
| `npm run generate:icons` | Windows `.ico` |

---

## 📁 Project structure

```
roboMouse/
├── roboMouse.js         # Main process, automation, tray & hotkey
├── smart-detection.js   # Idle/meeting detection helpers
├── index.html           # UI + settings sheet
├── preload.js           # IPC bridge
├── i18n.js              # UI translations
├── tray-i18n.js         # Tray menu translations
├── build/               # Icons & macOS entitlements
└── scripts/             # Asset generation
```

---

## ⚙️ Tech stack

- [Electron](https://www.electronjs.org/) 40
- [@nut-tree-fork/nut-js](https://www.npmjs.com/package/@nut-tree-fork/nut-js)
- [@nut-tree-fork/node-mac-permissions](https://www.npmjs.com/package/@nut-tree-fork/node-mac-permissions)
- [active-win](https://www.npmjs.com/package/active-win) — foreground window detection
- [electron-builder](https://www.electron.build/)

---

## 🤝 Contributing

Bug reports and pull requests are welcome.

1. Open an [issue](https://github.com/MuhammedAlii/RoboMouse/issues) for bugs or feature ideas.
2. Fork the repo, branch from `main`, and submit a PR.
3. Test locally with `npm start` before submitting.

---

## 📄 License

ISC — see [`package.json`](package.json) for details.

---

## 📬 Contact

| | |
|---|---|
| 👤 **Developer** | Muhammed Ali |
| 🔗 **GitHub** | [github.com/MuhammedAlii](https://github.com/MuhammedAlii) |
| 📧 **Email** | [muhammedalisahin41@gmail.com](mailto:muhammedalisahin41@gmail.com) |
| 🐛 **Bug reports** | [GitHub Issues](https://github.com/MuhammedAlii/RoboMouse/issues) |

💼 For job or project proposals, feel free to reach out via GitHub DM or email.
