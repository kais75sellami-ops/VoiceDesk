# Building VoiceDesk

Detailed instructions for building VoiceDesk on macOS and Windows.

## Prerequisites

### macOS

1. **Install Xcode Command Line Tools**:
   ```bash
   xcode-select --install
   ```

2. **Install Homebrew** (if not already installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

3. **Install Node.js**:
   ```bash
   brew install node
   ```

4. **Install Rust**:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source $HOME/.cargo/env
   ```

5. **Verify installations**:
   ```bash
   node --version  # Should be v18 or later
   npm --version
   cargo --version
   rustc --version
   ```

### Windows

1. **Install Node.js**:
   - Download from https://nodejs.org/
   - Run the installer
   - Choose "Automatically install necessary tools" option

2. **Install Rust**:
   - Download from https://rustup.rs/
   - Run `rustup-init.exe`
   - Follow the prompts (choose default installation)

3. **Install Visual Studio Build Tools**:
   - Download from https://visualstudio.microsoft.com/visual-cpp-build-tools/
   - Run the installer
   - Select "Desktop development with C++"
   - Install

4. **Install WebView2** (if not already installed):
   - Download from https://developer.microsoft.com/en-us/microsoft-edge/webview2/
   - Usually pre-installed on Windows 11

5. **Verify installations** (in PowerShell):
   ```powershell
   node --version  # Should be v18 or later
   npm --version
   cargo --version
   rustc --version
   ```

## Development Build

### First Time Setup

1. **Navigate to project directory**:
   ```bash
   cd VoiceDesk
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **This will install**:
   - React and React DOM
   - TypeScript
   - Vite
   - Tauri CLI and API packages
   - Build tooling

### Running in Development Mode

```bash
npm run tauri dev
```

This will:
1. Start the Vite dev server (frontend)
2. Compile the Rust backend
3. Launch the app with hot-reload enabled

**First Launch**: You'll be prompted to enter your ElevenLabs API key. Get one from https://elevenlabs.io/app/settings/api-keys

### Development Features

- **Hot Reload**: Frontend changes reload automatically
- **Rust Changes**: Require app restart
- **Console Logs**: Check the terminal for backend logs
- **DevTools**: Use the app's right-click menu > "Inspect Element"

## Production Build

### macOS Build

1. **Build the app**:
   ```bash
   npm run tauri build
   ```

2. **Build process**:
   - Compiles TypeScript to JavaScript
   - Bundles frontend with Vite
   - Compiles Rust with `--release` flag
   - Creates application bundle
   - Generates DMG installer

3. **Output locations**:
   ```
   src-tauri/target/release/bundle/macos/VoiceDesk.app
   src-tauri/target/release/bundle/dmg/VoiceDesk_0.1.0_aarch64.dmg  # Apple Silicon
   src-tauri/target/release/bundle/dmg/VoiceDesk_0.1.0_x64.dmg      # Intel
   ```

4. **Build artifacts**:
   - `.app`: Application bundle (drag to Applications folder)
   - `.dmg`: Disk image for distribution

### Windows Build

1. **Build the app**:
   ```bash
   npm run tauri build
   ```

2. **Build process**:
   - Compiles TypeScript to JavaScript
   - Bundles frontend with Vite
   - Compiles Rust with `--release` flag
   - Creates executable and installer

3. **Output locations**:
   ```
   src-tauri/target/release/VoiceDesk.exe
   src-tauri/target/release/bundle/msi/VoiceDesk_0.1.0_x64_en-US.msi
   src-tauri/target/release/bundle/nsis/VoiceDesk_0.1.0_x64-setup.exe
   ```

4. **Build artifacts**:
   - `.exe`: Standalone executable
   - `.msi`: Windows Installer package
   - `-setup.exe`: NSIS installer

## Build Configuration

### Optimizing Build Size

Edit `src-tauri/Cargo.toml`:

```toml
[profile.release]
panic = "abort"
codegen-units = 1
lto = true
opt-level = "z"  # Optimize for size
strip = true     # Strip symbols
```

### Changing App Version

Edit `src-tauri/tauri.conf.json`:

```json
{
  "version": "0.2.0"
}
```

Also update `src-tauri/Cargo.toml`:

```toml
[package]
version = "0.2.0"
```

### Custom Build Features

#### Building for Specific Architecture

macOS:
```bash
# Apple Silicon only
rustup target add aarch64-apple-darwin
npm run tauri build -- --target aarch64-apple-darwin

# Intel only
rustup target add x86_64-apple-darwin
npm run tauri build -- --target x86_64-apple-darwin
```

Windows:
```bash
# 64-bit only
npm run tauri build -- --target x86_64-pc-windows-msvc

# 32-bit
rustup target add i686-pc-windows-msvc
npm run tauri build -- --target i686-pc-windows-msvc
```

## Code Signing (Optional but Recommended)

### macOS Code Signing

1. **Requirements**:
   - Apple Developer account ($99/year)
   - Developer ID Application certificate

2. **Configure signing**:

   Edit `src-tauri/tauri.conf.json`:
   ```json
   {
     "bundle": {
       "macOS": {
         "signingIdentity": "Developer ID Application: Your Name (TEAM_ID)",
         "entitlements": null,
         "exceptionDomain": "",
         "frameworks": [],
         "providerShortName": null
       }
     }
   }
   ```

3. **Build with signing**:
   ```bash
   npm run tauri build
   ```

4. **Notarization** (recommended):
   ```bash
   # Requires Apple ID credentials
   xcrun notarytool submit \
     src-tauri/target/release/bundle/dmg/VoiceDesk_*.dmg \
     --apple-id "your@email.com" \
     --team-id "TEAM_ID" \
     --password "app-specific-password"
   ```

### Windows Code Signing

1. **Requirements**:
   - Code signing certificate (from DigiCert, Sectigo, etc.)
   - Certificate installed in Windows Certificate Store

2. **Configure signing**:

   Edit `src-tauri/tauri.conf.json`:
   ```json
   {
     "bundle": {
       "windows": {
         "certificateThumbprint": "YOUR_CERTIFICATE_THUMBPRINT",
         "digestAlgorithm": "sha256",
         "timestampUrl": "http://timestamp.digicert.com"
       }
     }
   }
   ```

3. **Build with signing**:
   ```bash
   npm run tauri build
   ```

## Troubleshooting Builds

### macOS

**Error: `xcrun: error: unable to find utility "metal"`**
- Solution: Install Xcode Command Line Tools
  ```bash
  xcode-select --install
  ```

**Error: `linker 'cc' not found`**
- Solution: Install Xcode Command Line Tools (see above)

**Build succeeds but app won't open**
- Check Console.app for crash logs
- Verify minimum macOS version in `tauri.conf.json`

**Incremental build issues**
- Clean and rebuild:
  ```bash
  cd src-tauri
  cargo clean
  cd ..
  npm run tauri build
  ```

### Windows

**Error: `link.exe not found`**
- Solution: Install Visual Studio Build Tools with C++ development tools

**Error: `WebView2 not found`**
- Solution: Install WebView2 Runtime from Microsoft

**Build fails with "disk full" error**
- Rust builds can be large (2-3 GB)
- Free up disk space
- Or build in release mode only

**Antivirus blocks build**
- Some antivirus software blocks Rust compiler
- Add exception for project folder and cargo directories

### General

**Out of memory during build**
- Reduce parallel compilation:
  ```bash
  CARGO_BUILD_JOBS=2 npm run tauri build
  ```

**Slow build times**
- First build takes 5-15 minutes (normal)
- Subsequent builds are faster (incremental compilation)
- Release builds are slower than debug builds

**Cargo fails to download crates**
- Check internet connection
- Try different network
- Clear cargo cache:
  ```bash
  cargo clean
  rm -rf ~/.cargo/registry
  ```

## Build Scripts

### Custom Build Script

Create `build.sh` (macOS/Linux) or `build.bat` (Windows):

```bash
#!/bin/bash
# build.sh

echo "Building VoiceDesk..."

# Clean previous builds
echo "Cleaning..."
cd src-tauri
cargo clean
cd ..
rm -rf dist

# Install dependencies
echo "Installing dependencies..."
npm install

# Build
echo "Building app..."
npm run tauri build

echo "Build complete!"
echo "Output: src-tauri/target/release/bundle/"
```

Make it executable:
```bash
chmod +x build.sh
./build.sh
```

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/build.yml`:

```yaml
name: Build

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    strategy:
      matrix:
        os: [macos-latest, windows-latest]

    runs-on: ${{ matrix.os }}

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node
      uses: actions/setup-node@v3
      with:
        node-version: 18

    - name: Setup Rust
      uses: actions-rs/toolchain@v1
      with:
        toolchain: stable

    - name: Install dependencies
      run: npm install

    - name: Build
      run: npm run tauri build

    - name: Upload artifacts
      uses: actions/upload-artifact@v3
      with:
        name: voicedesk-${{ matrix.os }}
        path: src-tauri/target/release/bundle/
```

## Next Steps

After building:
1. Test the built app thoroughly
2. Set up code signing for distribution
3. Create distribution packages
4. Set up auto-updates (optional)
5. Publish to app stores or website

## Resources

- [Tauri Documentation](https://tauri.app/)
- [Tauri Build Guide](https://tauri.app/v1/guides/building/)
- [Rust Book](https://doc.rust-lang.org/book/)
- [React Documentation](https://react.dev/)
