# VoiceDesk File Structure

Complete file tree and description of all project files.

## Root Directory

```
VoiceDesk/
├── .gitignore              # Git ignore rules
├── README.md               # Main documentation
├── QUICKSTART.md           # Quick start guide
├── BUILDING.md             # Detailed build instructions
├── FILE_STRUCTURE.md       # This file
├── package.json            # Node.js dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tsconfig.node.json      # TypeScript config for Vite
├── vite.config.ts          # Vite bundler configuration
├── index.html              # HTML entry point
├── generate_icons.py       # Icon generation script
│
├── src/                    # Frontend source code (React + TypeScript)
│   ├── main.tsx           # Application entry point
│   ├── App.tsx            # Main application component
│   ├── App.css            # Global styles and theme
│   ├── types.ts           # TypeScript type definitions
│   │
│   └── components/        # React components
│       ├── Header.tsx     # App header with logo and settings
│       ├── SettingsModal.tsx  # API key settings modal
│       ├── TextInput.tsx  # Text input with character counter
│       ├── LanguageSelector.tsx  # Language dropdown
│       └── AudioPlayer.tsx  # Audio playback controls
│
├── src-tauri/             # Backend source code (Rust + Tauri)
│   ├── Cargo.toml         # Rust dependencies
│   ├── build.rs           # Build script
│   ├── tauri.conf.json    # Tauri app configuration
│   │
│   ├── src/               # Rust source code
│   │   ├── main.rs        # Tauri application setup
│   │   └── commands.rs    # Backend command implementations
│   │
│   └── target/            # Build output (generated, gitignored)
│       ├── debug/         # Debug builds
│       └── release/       # Production builds
│           └── bundle/    # Platform-specific bundles
│               ├── macos/ # macOS .app bundle
│               ├── dmg/   # macOS disk images
│               ├── msi/   # Windows installers
│               └── nsis/  # Windows NSIS installers
│
├── icons/                 # Application icons
│   ├── 32x32.png         # Small icon
│   ├── 128x128.png       # Medium icon
│   ├── 128x128@2x.png    # Medium retina icon
│   ├── 256x256.png       # Large icon
│   ├── 512x512.png       # Extra large icon
│   ├── 1024x1024.png     # Maximum size icon
│   ├── icon.icns         # macOS icon bundle
│   └── icon.ico          # Windows icon
│
├── dist/                  # Frontend build output (generated, gitignored)
│   ├── index.html        # Built HTML
│   ├── assets/           # Bundled JS/CSS
│   └── ...
│
└── node_modules/          # Node dependencies (generated, gitignored)
```

## File Descriptions

### Configuration Files

#### `package.json`
- Node.js project configuration
- Lists frontend dependencies (React, TypeScript, Vite)
- Defines npm scripts (dev, build, tauri)
- Manages development dependencies

**Key Dependencies**:
- `react`, `react-dom`: UI framework
- `@tauri-apps/api`: Frontend-backend communication
- `@tauri-apps/plugin-dialog`: Native file dialogs
- `typescript`: Type safety
- `vite`: Build tool and dev server

**Scripts**:
- `npm run dev`: Start Vite dev server
- `npm run build`: Build frontend for production
- `npm run tauri`: Run Tauri CLI commands

#### `tsconfig.json`
- TypeScript compiler configuration
- Target: ES2020
- Module resolution: bundler mode
- Strict type checking enabled

#### `vite.config.ts`
- Vite bundler configuration
- React plugin enabled
- Dev server on port 5173
- Production optimizations

#### `src-tauri/Cargo.toml`
- Rust project configuration
- Lists backend dependencies
- Package metadata (name, version, description)

**Key Dependencies**:
- `tauri`: Core framework
- `keyring`: Secure credential storage
- `reqwest`: HTTP client for API calls
- `serde`: Serialization/deserialization
- `tokio`: Async runtime
- `base64`: Binary data encoding

#### `src-tauri/tauri.conf.json`
- Tauri application configuration
- Window properties (size, title)
- Build commands
- Bundle settings (icons, installers)
- Plugin configuration
- Security policies

### Source Files

#### Frontend (`src/`)

##### `main.tsx`
- Application entry point
- Mounts React app to DOM
- Wraps app in StrictMode

##### `App.tsx`
- Main application component
- State management:
  - Text input
  - Language selection
  - Loading states
  - Error handling
  - Audio data
  - Settings modal visibility
- API integration:
  - Check for API key on mount
  - Generate TTS audio
  - Handle responses and errors

##### `App.css`
- Global styles
- Dark theme variables
- Component styles
- Responsive layout
- Custom controls (audio player, sliders)

##### `types.ts`
- TypeScript interfaces and types
- `ApiResponse<T>`: Generic API response
- `Language`: Language definition
- `LANGUAGES`: Available languages array

##### `components/Header.tsx`
- App header component
- Logo with microphone icon
- Settings button

##### `components/SettingsModal.tsx`
- Modal for API key management
- Password input field
- Save/cancel actions
- Success/error messages
- Secure communication with backend

##### `components/TextInput.tsx`
- Text input component
- Multi-line textarea
- Character counter (0-5000)
- Visual warnings for limits
- Disabled state handling

##### `components/LanguageSelector.tsx`
- Language selection dropdown
- Populated from LANGUAGES constant
- Controlled component

##### `components/AudioPlayer.tsx`
- Audio playback controls
- Play/Pause/Stop buttons
- Seek bar for navigation
- Time display (current/total)
- Download button
- Base64 to Blob conversion
- Native file save dialog integration

#### Backend (`src-tauri/src/`)

##### `main.rs`
- Tauri application setup
- Window configuration
- Command registration
- Plugin initialization
- Entry point

##### `commands.rs`
- Backend command implementations
- **`get_api_key()`**: Retrieve key from keyring
- **`set_api_key(key)`**: Store key in keyring
- **`generate_tts(request)`**:
  - Validate input
  - Retrieve API key
  - Call ElevenLabs API
  - Return audio as base64
  - Handle errors (401, 429, network)
- **`save_audio_file(data, filename)`**:
  - Decode base64 audio
  - Show native save dialog
  - Write file to disk

**Configuration**:
- `SERVICE_NAME`: "VoiceDesk" (keyring identifier)
- `VOICE_ID`: ElevenLabs voice (Rachel)
- `ELEVENLABS_API_URL`: API endpoint

### Build Files

#### `build.rs`
- Rust build script
- Calls `tauri_build::build()`
- Runs before compilation

#### `.gitignore`
- Excludes from version control:
  - `node_modules/`: Node dependencies
  - `target/`: Rust build artifacts
  - `dist/`: Frontend build output
  - `.DS_Store`: macOS metadata
  - Editor files

### Icons

#### Source Icons
- PNG files in multiple sizes
- Used for different contexts:
  - Small: Taskbar, notifications
  - Medium: Alt+Tab, dock
  - Large: Installation, about dialog

#### Platform Icons
- **`icon.icns`**: macOS icon bundle
  - Contains multiple sizes
  - Used for .app bundle
  - Generated with `iconutil`

- **`icon.ico`**: Windows icon
  - Multi-resolution icon file
  - Used for .exe file
  - Generated with Pillow

#### `generate_icons.py`
- Python script to generate icons
- Creates PNG files with microphone design
- Generates platform-specific formats
- Fallback for systems without Pillow

## Build Outputs

### Development Build
```
src-tauri/target/debug/
├── voicedesk              # Executable (macOS/Linux)
├── voicedesk.exe          # Executable (Windows)
└── deps/                  # Compiled dependencies
```

### Production Build
```
src-tauri/target/release/
├── voicedesk / voicedesk.exe  # Optimized executable
└── bundle/
    ├── macos/
    │   └── VoiceDesk.app      # macOS application
    ├── dmg/
    │   └── VoiceDesk_*.dmg    # macOS disk image
    ├── msi/
    │   └── VoiceDesk_*.msi    # Windows installer
    └── nsis/
        └── VoiceDesk_*-setup.exe  # Windows NSIS installer
```

## Generated Files

These files are auto-generated and should not be edited:

- `node_modules/`: NPM packages
- `dist/`: Frontend build output
- `src-tauri/target/`: Rust build artifacts
- `Cargo.lock`: Rust dependency lock file (auto-generated)
- `package-lock.json`: NPM dependency lock file (auto-generated)

## File Sizes (Approximate)

| Category | Development | Production |
|----------|-------------|------------|
| Frontend | ~50 MB | ~500 KB |
| Backend (compiled) | ~30 MB | ~5-10 MB |
| Dependencies (node_modules) | ~100 MB | N/A |
| Dependencies (Rust target) | ~2 GB | N/A |
| Final app bundle | N/A | ~10-15 MB |

## Important Paths

### Configuration
- App config: `src-tauri/tauri.conf.json`
- Rust deps: `src-tauri/Cargo.toml`
- Node deps: `package.json`

### Development
- Frontend dev: `src/`
- Backend dev: `src-tauri/src/`
- Hot reload: Vite dev server (port 5173)

### Build Outputs
- macOS app: `src-tauri/target/release/bundle/macos/`
- Windows exe: `src-tauri/target/release/`
- Installers: `src-tauri/target/release/bundle/`

### Logs
- Dev logs: Terminal output
- Tauri logs: OS-specific:
  - macOS: `~/Library/Logs/com.voicedesk.app/`
  - Windows: `%APPDATA%/com.voicedesk.app/logs/`

## Security Considerations

### Sensitive Files
- API keys: Stored in system keyring, NOT in files
- No `.env` files needed (keyring used instead)

### What NOT to Commit
- API keys
- Personal data
- Build artifacts
- Node modules
- Lock files (optional, but usually committed)

### What to Commit
- Source code
- Configuration files
- Documentation
- Icon sources (PNG files)
- Build scripts

## Extending the Project

### Adding New Components
1. Create `src/components/ComponentName.tsx`
2. Import in `App.tsx` or parent component
3. Add styles to `App.css`

### Adding New Backend Commands
1. Add function in `src-tauri/src/commands.rs`
2. Register in `src-tauri/src/main.rs`
3. Call from frontend using `invoke()`

### Adding Dependencies

Frontend:
```bash
npm install package-name
```

Backend:
```toml
# Edit src-tauri/Cargo.toml
[dependencies]
package-name = "version"
```

## Documentation Files

- **README.md**: Main documentation, features, usage
- **QUICKSTART.md**: Quick start guide, 5-minute setup
- **BUILDING.md**: Detailed build instructions, troubleshooting
- **FILE_STRUCTURE.md**: This file, project structure

---

**Note**: This structure follows Tauri v2 conventions. For official docs, see https://tauri.app/
