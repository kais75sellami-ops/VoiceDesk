#!/usr/bin/env python3
"""
Icon generator for VoiceDesk
Creates placeholder icons with a microphone symbol
Replace these with professional icons for production use
"""

try:
    from PIL import Image, ImageDraw
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    print("PIL not available. Install with: pip3 install Pillow")
    print("Using basic icon generation fallback...")

import os

def create_microphone_icon(size, bg_color=(99, 102, 241), fg_color=(255, 255, 255)):
    """Create a simple microphone icon"""
    if not PIL_AVAILABLE:
        # Create a simple colored square as fallback
        img = Image.new('RGBA', (size, size), bg_color + (255,))
        return img

    # Create image with rounded corners background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Draw rounded rectangle background
    margin = size // 8
    draw.rounded_rectangle(
        [(margin, margin), (size - margin, size - margin)],
        radius=size // 6,
        fill=bg_color + (255,)
    )

    # Draw microphone shape
    center_x = size // 2
    center_y = size // 2

    # Microphone capsule (ellipse)
    mic_width = size // 5
    mic_height = size // 3
    mic_top = center_y - mic_height // 2 - size // 10

    draw.ellipse(
        [
            center_x - mic_width,
            mic_top,
            center_x + mic_width,
            mic_top + mic_height
        ],
        fill=fg_color
    )

    # Microphone arc (bottom part)
    arc_width = mic_width * 1.8
    arc_height = mic_height * 0.8
    arc_top = mic_top + mic_height - size // 20

    draw.arc(
        [
            center_x - arc_width,
            arc_top,
            center_x + arc_width,
            arc_top + arc_height
        ],
        start=0,
        end=180,
        fill=fg_color,
        width=max(2, size // 40)
    )

    # Microphone stand (vertical line)
    stand_top = arc_top + arc_height
    stand_bottom = stand_top + size // 8
    draw.line(
        [(center_x, stand_top), (center_x, stand_bottom)],
        fill=fg_color,
        width=max(2, size // 40)
    )

    # Microphone base (horizontal line)
    base_width = mic_width * 1.2
    draw.line(
        [(center_x - base_width, stand_bottom), (center_x + base_width, stand_bottom)],
        fill=fg_color,
        width=max(2, size // 40)
    )

    return img

def generate_icons():
    """Generate all required icon sizes"""
    if not PIL_AVAILABLE:
        print("Warning: Pillow not installed. Install with: pip3 install Pillow")
        print("Creating minimal fallback icons...")

    icons_dir = os.path.join(os.path.dirname(__file__), 'icons')
    os.makedirs(icons_dir, exist_ok=True)

    # Icon sizes needed
    sizes = [32, 128, 256, 512, 1024]

    print("Generating icons...")

    for size in sizes:
        icon = create_microphone_icon(size)

        # Save PNG
        png_path = os.path.join(icons_dir, f'{size}x{size}.png')
        icon.save(png_path, 'PNG')
        print(f"  ✓ Created {png_path}")

        # Save @2x version for certain sizes
        if size == 128:
            png_path_2x = os.path.join(icons_dir, f'{size}x{size}@2x.png')
            icon_2x = create_microphone_icon(size * 2)
            icon_2x.save(png_path_2x, 'PNG')
            print(f"  ✓ Created {png_path_2x}")

    # Create .icns for macOS (requires multiple sizes)
    print("\nFor macOS .icns generation:")
    print("  1. Install 'iconutil' (comes with Xcode)")
    print("  2. Or use online converter: https://cloudconvert.com/png-to-icns")
    print("  3. Place the generated icon.icns in the icons/ folder")

    # Create .ico for Windows (requires Pillow)
    if PIL_AVAILABLE:
        try:
            ico_sizes = [(32, 32), (128, 128), (256, 256)]
            ico_images = [create_microphone_icon(size[0]) for size in ico_sizes]
            ico_path = os.path.join(icons_dir, 'icon.ico')
            ico_images[0].save(ico_path, format='ICO', sizes=ico_sizes)
            print(f"\n  ✓ Created {ico_path}")
        except Exception as e:
            print(f"\n  ✗ Failed to create .ico: {e}")
            print("  You can use an online converter: https://cloudconvert.com/png-to-ico")
    else:
        print("\n  Note: Install Pillow to automatically generate .ico files")
        print("  Or use online converter: https://cloudconvert.com/png-to-ico")

    print("\n✓ Icon generation complete!")
    print("\nIMPORTANT: These are placeholder icons.")
    print("For production, replace with professionally designed icons.")

if __name__ == '__main__':
    generate_icons()
