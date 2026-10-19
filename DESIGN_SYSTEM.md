# Hinges / Windows 11H Design Foundation

**Status:** Step 1 baseline  
**Direction:** Glass and fluid  
**Default appearance:** Light  
**Shell layout:** Hybrid: top system bar, bottom taskbar, custom Control Centre  
**Implementation approach:** Evolve the existing Hinges prototype incrementally.

## Design principles

1. **Glass with restraint.** Use translucent, blurred material on transient surfaces such as the launcher, Control Centre, notifications, and menus. Keep important reading areas sufficiently opaque for legibility.
2. **Light-first, not pure-white everywhere.** Use soft neutral surfaces, dark plum-gray text, and a restrained violet accent.
3. **One visual system.** Shared tokens govern color, border, elevation, radii, focus, and motion across shell components and future replacement apps.
4. **Hybrid shell.** Preserve the existing top system bar and bottom icon taskbar, with a custom Control Centre and notification panel.
5. **Evolve, do not reset.** Keep existing interactions and component structure unless a scoped change requires otherwise.
6. **Accessible by default.** Retain visible keyboard focus, respect reduced-motion preferences, and preserve readable contrast over translucent surfaces.

## Initial design tokens

| Token | Value | Use |
|---|---|---|
| `--h11h-color-text` | `#292536` | Primary text on light surfaces |
| `--h11h-color-muted` | `#716b7d` | Secondary text |
| `--h11h-color-accent` | `#7652c7` | Primary accent |
| `--h11h-color-accent-strong` | `#6240b0` | Accent text and emphasis |
| `--h11h-color-accent-soft` | `rgba(118,82,199,.12)` | Subtle selection surfaces |
| `--h11h-surface-glass` | `rgba(250,248,255,.72)` | Glass panels |
| `--h11h-surface-raised` | `rgba(255,255,255,.74)` | Raised cards and controls |
| `--h11h-surface-subtle` | `rgba(255,255,255,.48)` | Low-emphasis surfaces |
| `--h11h-border` | `rgba(255,255,255,.82)` | Glass edge highlight |
| `--h11h-border-subtle` | `rgba(87,70,117,.14)` | Low-emphasis separators |
| `--h11h-shadow` | `0 20px 56px rgba(43,31,66,.16)` | Shared panel elevation |
| `--h11h-radius-control` | `10px` | Compact controls |
| `--h11h-radius-card` | `16px` | Cards and grouped controls |
| `--h11h-radius-panel` | `22px` | Major floating panels |
| `--h11h-motion-fast` | `140ms` | Small state changes |
| `--h11h-motion-standard` | `200ms` | Standard transitions |

## Component map

- **Desktop shell:** wallpaper, desktop shortcuts, top system bar, bottom taskbar.
- **Launcher:** command/search field, app grid, power actions.
- **Control Centre:** quick toggles, media controls, volume and brightness.
- **Notification Centre:** date, notifications, dismiss/clear actions.
- **Window layer:** draggable windows, title-bar actions, workspace overview.
- **Future shared app components:** window chrome, navigation, buttons, text fields, dialogs, menus, empty states, and status indicators.

## Glass usage rules

- Reserve the strongest backdrop blur for floating/transient panels.
- Avoid stacking several equally strong transparent surfaces directly against one another.
- Keep primary text neutral and high contrast; do not use the accent color for long text on glass.
- Preserve a solid-surface fallback path for future native Windows integrations and reduced-transparency settings.
- Treat the current CSS blur as a prototype effect. Native Windows Mica/Acrylic integration will be evaluated per component later.

## Scope of this pass

This pass adds the first shared token layer and aligns the existing top bar with the selected light-first appearance. It intentionally does not restructure the shell, replace app UIs, change the wallpaper, rename controls, or alter existing interaction logic.