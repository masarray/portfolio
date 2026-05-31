# v7 Direct Repair Notes

This build was repaired directly from `angelic-interface-main`.

Fixed areas:

1. Window manager
   - Close / minimize / maximize controls no longer share fragile pointer-up logic with the draggable title bar.
   - Traffic-light buttons use click actions only and are ignored by titlebar drag.
   - Drag threshold added so normal clicks do not become accidental drag.
   - Double-click titlebar still toggles maximize.

2. Z-index / focus
   - Replaced stale `zTop` state usage with deterministic `zCounter` ref.
   - Every open/focus/maximize gets a clean increasing z-index.

3. Dock
   - Rebuilt dock magnification using actual mouse X distance from every icon center.
   - Added smoother continuous scale/lift, active dots, better glass shelf, and custom icon-like shapes.

4. Wallpaper
   - Rebuilt animated background as a dark neon spline wallpaper with blue/violet/magenta glow, subtle fog, cursor heat and line displacement.

5. Cursor fluid
   - Replaced wipe-clean particle layer with persistent fading canvas.
   - Added velocity-based light smoke, ribbon trail, plume spread, sparks, and screen/lighter compositing.

6. Typography / UI polish
   - Reduced menu bar height, refined window title typography, toned down over-bold headings, and tuned content hierarchy.

Run:

```powershell
npm config set registry https://registry.npmjs.org/
npm install
npm run dev
```

If your machine already has a polluted npm cache/lockfile from previous builds, delete `node_modules` and any `package-lock.json` before reinstalling.
