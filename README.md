# Code to Create — Game Design @ IMPACT

The teacher website for the Game Design pathway at the IMPACT Center for Leadership & Innovation. It's plain HTML, CSS and JavaScript, with no build step and nothing to install. GitHub Pages hosts it for free.

**Design your game. Design your future.**

---

## Put it online (one time, about 10 minutes)

1. Sign in at [github.com](https://github.com). Click **+** → **New repository**.
   - Name it `codetocreate` (or anything you like). Set it to **Public**. Click **Create repository**.
2. On the new repo's page, click **uploading an existing file**.
   Unzip this download, open the folder, select **everything inside it** (not the folder itself), and drag it onto the page. Click **Commit changes**.
3. Go to **Settings → Pages**. Under *Build and deployment*, set **Source: Deploy from a branch**, **Branch: main**, folder **/ (root)**. Click **Save**.
4. Wait about a minute and refresh. GitHub shows your address:
   `https://YOUR-USERNAME.github.io/codetocreate/`

> Want a shorter address, like `gamedesign.yourschool.org`? Ask district IT to point a domain at GitHub Pages, then enter it under **Settings → Pages → Custom domain**.

---

## What's where

| File | What it is |
| --- | --- |
| `index.html` | Home |
| `pathway.html` | The Pathway: courses, skills, careers, family FAQ |
| `arcade.html` | Student Arcade: every game, with filters and search |
| `game.html` | One page that shows any game (`game.html?id=...`) |
| `publish.html` | Publish Your Game: checklist and submission |
| `jams.html` | Game Jams |
| `about.html` | About you and the program |
| `assets/js/games.js` | **The game list.** The only file you edit to add a game. |
| `assets/css/site.css` | Colors and fonts, all at the top of the file |
| `games/` | One folder per game, holding its web build |

To edit any page on GitHub, open the file, click the **pencil** icon, make the change, and click **Commit changes**. The live site updates in about a minute.

**First edits:** search each page for `[` to find the placeholders: `[Teacher name]`, `[DATE]`, `[Course 1 name]` and so on. In `publish.html`, replace `FORM-ID` with your Google Form link.

---

## Add a student game

1. **Get the build.** The student exports a web build (Unity WebGL, Godot HTML5, GDevelop HTML5, or Twine HTML) and zips the folder. `index.html` must be at the top of the zip.
2. **Upload it.** On your computer, unzip the build into a folder named after the game, such as `sky-runner`, and put the 630 × 500 cover in it as `cover.png`. In the repo, open `games/` → **Add file → Upload files**, then drag the whole `sky-runner` folder onto the page. GitHub keeps the folder structure. Click **Commit changes**.
3. **List it.** Open `assets/js/games.js`, copy the template block at the bottom, paste it at the top of the list, and fill it in. Set `play` to `{ type: "local", src: "games/sky-runner/index.html" }`.
4. **Commit.** The game appears in the Arcade, with its own page, in about a minute.

**Scratch games** don't need a folder. Use `play: { type: "scratch", src: "https://scratch.mit.edu/projects/123456789/embed" }`.
**Games already on itch.io:** use `play: { type: "itch", src: "https://itch.io/embed-upload/XXXXXXX" }`, copied from the game's itch.io **Distribute → Embed game** page.

To feature a game on the Home page, set `featured: true` on that game and `false` on the others.

### Unity WebGL builds

GitHub Pages can't serve Unity's compressed files the way Unity expects. Before building, go to **Player Settings → Publishing Settings** and either:
- set **Compression Format: Disabled**, or
- keep Gzip and tick **Decompression Fallback**.

GitHub limits single files to 100 MB, and the whole site should stay under 1 GB. If a game is bigger, put it on itch.io and use the `itch` type.

---

## Rules for student work on a public site

- [ ] Students are listed by first name and last initial only
- [ ] No student photos without a media release on file
- [ ] Every game passed the launch checklist on the Publish page
- [ ] Only you (and co-teachers) have write access to this repo. Students submit through the form.

---

## The sample game

`games/sample-dodge/` is a tiny sample game, so the Arcade and Home page work from day one. When real games are in, delete that folder and its block in `games.js`.

## Preview on your own computer

Opening `index.html` by double-clicking works for every page. Some browsers block games that load from your own disk, so to test a game locally, run `python3 -m http.server` in this folder and open `http://localhost:8000`.
