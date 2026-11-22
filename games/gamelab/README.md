# Code.org Game Lab games go here

These games play with **Code.org's own embed**, so they always run the real Game Lab and show the student's latest version. Each game is a small folder holding the project's share link.

```
games/gamelab/
  SpaceShooter/
    link.txt         <- required: the Code.org share link
    cover.png        <- optional: the Arcade card picture (630 x 500 looks best)
    title.png        <- optional: a screenshot of the game's title screen, shown before it starts
    info.json        <- optional: title, creator and more (see below)
```

**To add a game:**
1. In Code.org, the student opens the project and clicks **Share**, then copies the link. It looks like `https://studio.code.org/projects/gamelab/AbC123…`. Pasting the whole embed code works too.
2. On your computer, make a folder named for the game (e.g. `SpaceShooter`). Inside it, make a text file `link.txt` and paste the link. Add `cover.png` and `info.json` if you like.
3. Go to `github.com/executivetick/impactgamedesign/upload/main/games/gamelab`, drag the folder in, and click **Commit changes**.

The `_Example` folder shows both files. Folders starting with `_` are ignored by the Arcade.

**The start screen:** the site shows only the game square, enlarged, with a "Click to play" screen on top. That screen shows the game's title, or your `title.png` if the folder has one. One click starts the game. To make `title.png`, run the game on Code.org and take a screenshot of just the game square (Windows: **Win + Shift + S**).

App Lab and Sprite Lab links work here too. App Lab apps get a phone-shaped window automatically.

**Optional `info.json`** (leave out any line you don't need). You can also put the link here as `"link"` instead of using `link.txt`.

```json
{
  "title": "Space Shooter",
  "creator": "Derwin C.",
  "genre": "Shooter",
  "course": "Computer Literacy",
  "year": "2026-27",
  "pitch": "Blast asteroids before they reach your ship.",
  "controls": "Arrow keys to move, Space to shoot.",
  "featured": false
}
```

- Set `"featured": true` to show the game on the Home page.
- Set `"hidden": true` to take it off the Arcade without deleting it.
- Use first name + last initial for students.

**If a game shows an error instead of playing:** sharing is probably off for that student. Check the **Sharing** column in your Code.org section's roster.

**Want a game to run without Code.org?** Convert it with the GameLabJS template in `games/html5/_GameLabTemplate/` (see the README in `games/html5/`).
