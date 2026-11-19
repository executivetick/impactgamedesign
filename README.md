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
| `tutor.html` | AI Tutor Assistant |
| `tools/publisher.html` | **Game Publisher** (teacher only, not in the menu) |
| `jams.html` | Game Jams |
| `about.html` | About you and the program |
| `assets/js/games.js` | **The game list.** The only file you edit to add a game. |
| `assets/css/site.css` | Colors and fonts, all at the top of the file |
| `games/` | One folder per game, holding its web build |

To edit any page on GitHub, open the file, click the **pencil** icon, make the change, and click **Commit changes**. The live site updates in about a minute.

**First edits:** search each page for `[` to find the placeholders: `[Teacher name]`, `[DATE]` and so on.

---

## Add a student game: use the Game Publisher

Students don't submit games. You publish them with the **Game Publisher**, a page only you use. It's not linked anywhere on the site.

**Open it:** `https://executivetick.github.io/impactgamedesign/tools/publisher.html`. Bookmark it. It also works if you open `tools/publisher.html` from the downloaded zip on your computer.

**One-time setup on each computer:** connect it to GitHub with an access token. The steps are at the bottom of the publisher page. The token is saved only in that browser; it's never on the website.

**To publish a game:**
1. Click **Connect & load games**, then **+ Add a game**.
2. Fill in the title, studio, genre, engine and course.
3. Choose where the game is:
   - **Build folder** (Unity, Godot, GDevelop, Twine, HTML5): unzip the student's build and choose the folder that has `index.html`.
   - **Code.org** (Game Lab, App Lab, Sprite Lab), **Scratch** or **itch.io**: paste the share link.
4. Choose a cover image. Any size works; the publisher crops it to 630 × 500.
5. Click **Publish to the Arcade**. The game is live in about a minute.

The list in the publisher also lets you **Edit**, **Feature** (on the Home page) or **Remove** a game. Each action is one commit, so it can be undone from the repo's history.

**By hand (backup):** put the build in `games/<id>/` and add a block to `assets/js/games.js`, following the blocks already there.

### Unity WebGL builds

GitHub Pages can't serve Unity's compressed files the way Unity expects. Before building, go to **Player Settings → Publishing Settings** and either set one of these (the publisher blocks Brotli builds and warns about Gzip):
- set **Compression Format: Disabled**, or
- keep Gzip and tick **Decompression Fallback**.

GitHub limits single files to 100 MB, and the whole site should stay under 1 GB. If a game is bigger, put it on itch.io and use the `itch` type.

---

## Rules for student work on a public site

- [ ] Students are listed by first name and last initial only
- [ ] No student photos without a media release on file
- [ ] Every game was checked by you before publishing
- [ ] Only you (and co-teachers) have write access to this repo and a publisher token

---

## The sample game

`games/sample-dodge/` is a tiny sample game, so the Arcade and Home page work from day one. When real games are in, click **Remove** next to it in the Game Publisher.

## Preview on your own computer

Opening `index.html` by double-clicking works for every page. Some browsers block games that load from your own disk, so to test a game locally, run `python3 -m http.server` in this folder and open `http://localhost:8000`.

---

## Set up the AI tutors (AI Tutor Assistant page)

The page has four tutors: Blender, Code.org Game Lab, Code.org App Lab, and Unity/C#. Each tutor's instructions are in `assets/js/tutors.js`. A public website can't safely hold an AI account key, so each tutor runs as a **Google Gemini Gem** made with your school account.

For each tutor:
1. Go to [gemini.google.com](https://gemini.google.com) with your school account → **Gems** → **New Gem**.
2. Name it, such as "Code to Create — Unity & C# Tutor".
3. Copy that tutor's `instructions` text from `tutors.js` (or click **Copy tutor setup** on the live page) and paste it into the Gem's **Instructions** box. Optional: under **Knowledge**, add your own handouts or rubrics.
4. Save, then **Share** the Gem with your district (or your class) and copy the link.
5. In `tutors.js`, paste the link into that tutor's `link: ""` and commit.

Until a tutor has a link, the page shows **Copy tutor setup** and **Open Gemini**. Students paste the setup as their first message, and the tutor still works.

Check with district IT that Gemini (and Gem sharing) is turned on for student accounts, and add your class AI policy where the page says `[Link or short version of your policy]`.
