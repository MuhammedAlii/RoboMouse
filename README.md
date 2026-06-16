# 🖱️ roboMouse

**Keep your computer awake with gentle, configurable mouse automation.**

roboMouse is a lightweight desktop utility built with Electron and [nut-js](https://github.com/nut-tree/nut.js). It moves the cursor on a timed loop so your system stays active — useful during long downloads, builds, or remote sessions.

| | |
|---|---|
| **Version** | 1.0.2 |
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
| **macOS** (Apple Silicon) | `roboMouse-1.0.2-arm64.dmg` | Drag to Applications |
| **Windows** | `roboMouse-1.0.2-portable-x64.exe` | Portable — double-click to run |
| **Windows** | `roboMouse-1.0.2-win-x64.zip` | Extract folder → run `roboMouse.exe` |
| **Linux** | `roboMouse-1.0.2.AppImage` | `chmod +x` then run |
| **Linux** | `roboMouse_1.0.2_amd64.deb` | `sudo dpkg -i …` |

> **macOS only:** menu bar tray icon, context menu, and active-state badge.  
> Windows and Linux builds use the in-app control panel.

---

## ✨ Features

- **Automated loop** — move right → wait → left click → move back → repeat
- **Configurable settings** — movement distance (px) and loop interval (seconds)
- **macOS menu bar tray** — start/stop, distance & interval presets, open panel, quit
- **Active indicator** — green badge on the tray icon while running
- **Permission-aware UX** — start is disabled until mouse control is verified (macOS Accessibility)
- **In-app help** — animated walkthrough with optional voice guidance
- **Background operation** — closing the window keeps the app running in the tray *(macOS)*

---

## 🔄 How it works

```
Start → wait (interval) → move right → wait → left click → move left → repeat
```

| Setting | Description | Default |
|---------|-------------|---------|
| Mouse distance | Horizontal movement per step | 5 px |
| Loop interval | Pause between steps | 5 s |

Tray presets *(macOS)*: distance **5 / 10 / 15 / 20 px**, interval **5 / 10 / 30 s**.

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
2. Download **`roboMouse-1.0.2-portable-x64.exe`** *(recommended)* **or** **`roboMouse-1.0.2-win-x64.zip`**.
3. **Portable:** double-click the `.exe`.
4. **Zip:** extract the archive → open the folder → run **`roboMouse.exe`**.

Windows SmartScreen may warn on unsigned builds — **More info → Run anyway**.

### 🐧 Linux

**AppImage**

```bash
chmod +x roboMouse-1.0.2.AppImage
./roboMouse-1.0.2.AppImage
```

**Debian / Ubuntu**

```bash
sudo dpkg -i roboMouse_1.0.2_amd64.deb
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
| `npm run build:mac:local` | `dist/roboMouse-1.0.2-arm64.dmg` |
| `npm run build:win:local` | Portable `.exe` + `.zip` |
| `npm run build:linux:local` | AppImage + `.deb` |
| `npm run build:all:local` | All platforms |
| `npm run generate:tray-icons` | macOS tray icons |
| `npm run generate:icons` | Windows `.ico` |

---

## 📁 Project structure

```
roboMouse/
├── roboMouse.js       # Main process, automation & tray
├── index.html         # UI
├── preload.js         # IPC bridge
├── i18n.js            # UI translations
├── tray-i18n.js       # Tray menu translations
├── build/             # Icons & macOS entitlements
└── scripts/           # Asset generation
```

---

## ⚙️ Tech stack

- [Electron](https://www.electronjs.org/) 40
- [@nut-tree-fork/nut-js](https://www.npmjs.com/package/@nut-tree-fork/nut-js)
- [@nut-tree-fork/node-mac-permissions](https://www.npmjs.com/package/@nut-tree-fork/node-mac-permissions)
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
