# Hinges — interactive desktop prototype

This branch contains a browser-based, clickable prototype of the Hinges desktop shell.

## Run it locally

1. Download or clone this branch: `prototype/interactive-desktop`.
2. Keep the three original visual assets in the repository root.
3. Open `index.html` in a modern desktop browser. If your browser restricts local file access, run a local static server from this folder:

   ```bash
   python -m http.server 8000
   ```

   Then visit `http://localhost:8000`.

No build step or package installation is required.

## Try it

- **Start:** click the purple-gradient Hinges icon. The Command Bar launches demo apps, handles basic calculations, and simulates simple system commands such as `volume 40%`, `Bluetooth off`, and `settings`.
- **Workspaces:** click the layered-diamond taskbar icon for the Mission Control-style open-window overview. Add desktops and move windows between them in the overview.
- **Notification Centre:** click the chevron at the far-right of the taskbar. The panel opens from the right edge, extending inward to the left, with the date first, notifications beneath it, and Control Centre below.
- **Control Centre:** toggle quick settings, adjust the volume and brightness sliders, and try the media controls.
- **Windows:** launch apps, drag windows by their title bars, minimize, maximize, and close them.
- **Keyboard:** `Ctrl/⌘ + Space` opens Start, `⌘ + Tab` opens Workspaces, and `Escape` dismisses overlays.

## Prototype boundaries

This is a front-end interaction prototype, not a running operating system. System toggles, media playback, terminal commands, shutdown, and external browsing are simulated. No hardware settings or shell commands are executed.

## Asset integrity

The wallpaper, battery icon, and purple-gradient Hinges icon are referenced directly from the original repository files. They are not edited, recolored, cropped, or re-encoded by this prototype. The CSS only controls their on-screen size and placement.
