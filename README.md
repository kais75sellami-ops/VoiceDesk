# VoiceDesk

Ultra-minimal ElevenLabs Text-to-Speech desktop application for macOS and Windows.

## Features

- 🎤 **Text-to-Speech**: Convert text to natural-sounding speech using ElevenLabs API
- 🌍 **Multi-language Support**: English, Spanish, French, German, Italian, Arabic
- 🔒 **Secure API Key Storage**: Keys stored in system keyring (macOS Keychain / Windows Credential Manager)
- 🎵 **Audio Player**: Built-in player with Play/Pause/Stop controls
- 💾 **Download MP3**: Save generated audio with native save dialog
- 🌙 **Dark Theme**: Modern, clean UI with dark mode
- ⚡ **Fast & Native**: Built with Tauri for optimal performance

## Prerequisites

### macOS
- macOS 10.15 or later
- [Xcode Command Line Tools](https://developer.apple.com/xcode/)
- [Node.js](https://nodejs.org/) (v18 or later)
- [Rust](https://rustup.rs/) (latest stable)

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install Node.js (using Homebrew)
brew install node

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Windows
- Windows 10 or later
- [Node.js](https://nodejs.org/) (v18 or later)
- [Rust](https://rustup.rs/) (latest stable)
- [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (usually pre-installed on Windows 11)

```powershell
# Install Rust (run in PowerShell)
# Download and run: https://win.rustup.rs/

# Install Node.js
# Download and install from: https://nodejs.org/
```

## Installation & Setup

1. **Clone or download the project**:
   ```bash
   cd VoiceDesk
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Get an ElevenLabs API key**:
   - Sign up at [ElevenLabs](https://elevenlabs.io/)
   - Navigate to [API Settings](https://elevenlabs.io/app/settings/api-keys)
   - Generate a new API key

## Development

Run the app in development mode with hot-reload:

```bash
npm run tauri dev
```

The app will open automatically. On first launch, you'll be prompted to enter your ElevenLabs API key in the Settings modal.

## Building

### macOS

Build the app for macOS:

```bash
npm run tauri build
```

The built app will be available at:
- `src-tauri/target/release/bundle/macos/VoiceDesk.app`
- `src-tauri/target/release/bundle/dmg/VoiceDesk_0.1.0_[arch].dmg`

**Note**: The app is not code-signed by default. On first launch:
1. macOS will block the app (Gatekeeper protection)
2. Go to **System Settings** > **Privacy & Security**
3. Click **Open Anyway** next to the VoiceDesk warning
4. Or right-click the app and select **Open**, then confirm

To properly sign the app:
- Enroll in [Apple Developer Program](https://developer.apple.com/programs/)
- Configure code signing in `tauri.conf.json`
- See [Tauri macOS Code Signing Guide](https://tauri.app/v1/guides/distribution/sign-macos)

### Windows

Build the app for Windows:

```bash
npm run tauri build
```

The built app will be available at:
- `src-tauri/target/release/VoiceDesk.exe`
- `src-tauri/target/release/bundle/msi/VoiceDesk_0.1.0_[arch].msi`

**Note**: Windows SmartScreen may warn about the app on first launch:
1. Click **More info**
2. Click **Run anyway**

To avoid SmartScreen warnings:
- Sign the executable with a code signing certificate
- See [Tauri Windows Code Signing Guide](https://tauri.app/v1/guides/distribution/sign-windows)

## Usage

1. **Set API Key** (first launch):
   - Click the ⚙️ Settings button
   - Enter your ElevenLabs API key
   - Click Save

2. **Generate Speech**:
   - Enter text in the textarea (max 5000 characters)
   - Select language from dropdown
   - Click "Generate Speech"
   - Wait for generation to complete

3. **Play Audio**:
   - Use Play/Pause button to control playback
   - Use Stop button to reset playback
   - Drag the seek bar to jump to a specific position

4. **Download**:
   - Click the Download button
   - Choose save location and filename
   - MP3 file will be saved

## Project Structure

```
VoiceDesk/
├── src/                      # React frontend
│   ├── components/           # React components
│   │   ├── AudioPlayer.tsx
│   │   ├── Header.tsx
│   │   ├── LanguageSelector.tsx
│   │   ├── SettingsModal.tsx
│   │   └── TextInput.tsx
│   ├── App.css               # Styles
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── types.ts              # TypeScript types
├── src-tauri/                # Tauri backend (created on first run)
│   └── src/
│       ├── commands.rs       # Tauri commands
│       └── main.rs           # Rust entry point
├── icons/                    # App icons
│   ├── icon.icns            # macOS icon
│   └── icon.ico             # Windows icon
├── Cargo.toml                # Rust dependencies
├── tauri.conf.json           # Tauri configuration
├── package.json              # Node dependencies
├── vite.config.ts            # Vite configuration
└── README.md                 # This file
```

## Configuration

### Changing the Voice

The app currently uses a fixed ElevenLabs voice (Rachel). To change it:

1. Open `src/commands.rs`
2. Find the `VOICE_ID` constant
3. Replace with your desired voice ID from [ElevenLabs Voice Library](https://elevenlabs.io/voice-library)

Example:
```rust
const VOICE_ID: &str = "YOUR_VOICE_ID_HERE";
```

### Customizing Icons

The app includes placeholder icons with a microphone design. To use custom icons:

1. Replace PNG files in `icons/` directory:
   - `32x32.png`
   - `128x128.png`
   - `128x128@2x.png`
   - `256x256.png`
   - `512x512.png`
   - `1024x1024.png`

2. Regenerate platform-specific icons:
   ```bash
   # macOS .icns
   python3 generate_icons.py

   # Or use online converters:
   # - https://cloudconvert.com/png-to-icns
   # - https://cloudconvert.com/png-to-ico
   ```

3. Rebuild the app

## Troubleshooting

### macOS

**"VoiceDesk" cannot be opened because the developer cannot be verified**
- Solution: System Settings > Privacy & Security > Open Anyway
- Or: Right-click app > Open > Confirm

**API key not saving**
- Ensure you have Keychain access enabled
- Check Console.app for keyring errors

**Build fails with "command not found: cargo"**
- Install Rust: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- Restart terminal and try again

### Windows

**Windows protected your PC**
- Click "More info"
- Click "Run anyway"

**Build fails with linker errors**
- Install Visual Studio C++ Build Tools
- Restart and try again

**WebView2 runtime error**
- Download and install [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

### General

**"Invalid API key" error**
- Verify your key at [ElevenLabs API Settings](https://elevenlabs.io/app/settings/api-keys)
- Re-enter the key in Settings

**"Rate limit exceeded" error**
- You've exceeded your ElevenLabs plan limits
- Upgrade your plan or wait for the limit to reset

**Generation fails or produces no audio**
- Check your internet connection
- Verify ElevenLabs API status
- Check browser/app console for detailed errors

**Audio won't play**
- Ensure you have audio output devices connected
- Check system volume settings
- Try regenerating the audio

## API Key Security

Your ElevenLabs API key is stored securely:
- **macOS**: System Keychain (encrypted)
- **Windows**: Credential Manager (encrypted)

The key is:
- Never stored in plain text
- Never exposed to the frontend JavaScript
- Only accessed by the Rust backend
- Protected by OS-level security

## License

MIT License - feel free to use and modify for your needs.

## Credits

Built with:
- [Tauri](https://tauri.app/) - Desktop app framework
- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [ElevenLabs](https://elevenlabs.io/) - Text-to-Speech API
- [keyring-rs](https://github.com/hwchen/keyring-rs) - Secure credential storage

## Support

For issues with:
- **VoiceDesk app**: Open an issue on this repository
- **ElevenLabs API**: Contact [ElevenLabs Support](https://help.elevenlabs.io/)
- **Tauri framework**: See [Tauri Documentation](https://tauri.app/)

## Roadmap

Future enhancements:
- [ ] Voice selection in UI (currently uses Rachel voice)
- [ ] Audio format options (MP3, WAV, etc.)
- [ ] Voice settings (stability, similarity boost)
- [ ] History of generated audio
- [ ] Batch text-to-speech conversion
- [ ] Custom keyboard shortcuts

---

**Note**: This is a working name and basic implementation. Feel free to customize the branding, add features, and improve the UI/UX for your specific needs!
