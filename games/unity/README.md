# Unity games go here

Each game gets its own folder holding a Unity **WebGL build**. Upload the folder and it appears in the Student Arcade about a minute later.

```
games/unity/
  SkyRunner/
    index.html       <- from the WebGL build (required)
    Build/
    TemplateData/
    cover.png        <- optional: the Arcade card picture (630 x 500 looks best)
    info.json        <- optional: title, creator and more (same as the Game Lab one)
```

**Before building in Unity:** go to **Edit → Project Settings → Player → Web (WebGL) → Publishing Settings** and set **Compression Format: Disabled**. Brotli builds don't load on GitHub Pages, so the Arcade skips them.

**Upload:** go to `github.com/executivetick/impactgamedesign/upload/main/games/unity`, drag the build folder in, and click **Commit changes**. It's fine if the zip unpacked as `SkyRunner/SkyRunner/index.html`; the Arcade looks one folder down.

**Limits:** each file must be under 100 MB.

Other web games (Godot, GDevelop, Twine, HTML5) work the same way in `games/html5/`.
