# VoiceDesk - Quick Start Guide

Get VoiceDesk running in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:

### macOS
- [ ] macOS 10.15 or later
- [ ] Xcode Command Line Tools
- [ ] Node.js v18+
- [ ] Rust (latest stable)

### Windows
- [ ] Windows 10 or later
- [ ] Node.js v18+
- [ ] Rust (latest stable)
- [ ] Visual Studio C++ Build Tools
- [ ] WebView2 Runtime

## Quick Install

### macOS

```bash
# 1. Install Xcode Command Line Tools
xcode-select --install

# 2. Install Node.js (via Homebrew)
brew install node

# 3. Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# 4. Verify
node --version && cargo --version
```

### Windows (PowerShell as Administrator)

```powershell
# 1. Install Chocolatey (package manager)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# 2. Install Node.js and Rust
choco install nodejs rust-ms -y

# 3. Install Visual Studio Build Tools
# Download and run: https://visualstudio.microsoft.com/visual-cpp-build-tools/
# Select "Desktop development with C++"

# 4. Verify
node --version
cargo --version
```

## Run VoiceDesk

```bash
# 1. Navigate to project
cd VoiceDesk

# 2. Install dependencies (first time only)
npm install

# 3. Run in development mode
npm run tauri dev
```

**First Launch**: Enter your ElevenLabs API key
- Get key from: https://elevenlabs.io/app/settings/api-keys
- Click Settings ⚙️ in app
- Paste key and click Save

## Test the App

1. ✍️ **Enter text**: Type "Hello, this is a test" in the text area
2. 🌍 **Select language**: Choose "English"
3. 🎤 **Generate**: Click "Generate Speech" button
4. ⏸️ **Play**: Click play button when audio is ready
5. 💾 **Download**: Click download button to save MP3

## Build for Production

```bash
# Build optimized app
npm run tauri build

# macOS output:
# src-tauri/target/release/bundle/macos/VoiceDesk.app
# src-tauri/target/release/bundle/dmg/VoiceDesk_*.dmg

# Windows output:
# src-tauri/target/release/VoiceDesk.exe
# src-tauri/target/release/bundle/msi/VoiceDesk_*.msi
```

## Common Issues

### "command not found: cargo"
**Fix**: Restart terminal after installing Rust
```bash
source $HOME/.cargo/env  # macOS/Linux
```

### "Keychain access denied" (macOS)
**Fix**: Grant keychain access when prompted, or:
1. Open Keychain Access app
2. Right-click on "login" keychain
3. Select "Unlock"

### Windows SmartScreen Warning
**Fix**:
1. Click "More info"
2. Click "Run anyway"

### "Cannot find module '@tauri-apps/api'"
**Fix**: Install dependencies
```bash
npm install
```

### Build Fails
**Fix**: Clean and rebuild
```bash
cd src-tauri
cargo clean
cd ..
rm -rf node_modules dist
npm install
npm run tauri build
```

## Performance Tips

### Faster Development Builds
- Development builds are ~30-60 seconds
- Hot reload for frontend changes
- Rust changes require restart

### Faster Production Builds
First build: 5-15 minutes (downloads dependencies)
Subsequent builds: 2-5 minutes (incremental)

**Speed up**:
```bash
# Use more CPU cores (default is all)
CARGO_BUILD_JOBS=4 npm run tauri build

# Or edit ~/.cargo/config.toml:
[build]
jobs = 4
```

## Next Steps

- [ ] Read [README.md](README.md) for full documentation
- [ ] Read [BUILDING.md](BUILDING.md) for detailed build instructions
- [ ] Customize voice by editing `src-tauri/src/commands.rs`
- [ ] Replace placeholder icons in `icons/` directory
- [ ] Set up code signing for distribution

## Getting Help

- **Bug reports**: Open GitHub issue
- **ElevenLabs API**: https://help.elevenlabs.io/
- **Tauri docs**: https://tauri.app/
- **React docs**: https://react.dev/

## Project Structure

```
VoiceDesk/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── App.tsx            # Main app
│   └── main.tsx           # Entry point
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── main.rs       # Tauri setup
│   │   └── commands.rs   # API commands
│   ├── Cargo.toml        # Rust dependencies
│   └── tauri.conf.json   # App config
├── icons/                 # App icons
├── package.json          # Node dependencies
└── README.md            # Full documentation
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + ,` | Open Settings (if implemented) |
| `Cmd/Ctrl + Q` | Quit app |
| `Cmd/Ctrl + R` | Reload (dev mode) |
| `F12` | Open DevTools (dev mode) |

---

**Ready?** Start with `npm install && npm run tauri dev`

**Questions?** Check [README.md](README.md) or open an issue.

Enjoy VoiceDesk! 🎤✨
