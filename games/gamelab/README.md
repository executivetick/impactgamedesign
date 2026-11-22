# Game Lab games go here

Each game gets its own folder. Upload the folder and it appears in the Student Arcade about a minute later. You don't edit any list.

```
games/gamelab/
  SpaceShooter/
    game.js          <- required: the student's Game Lab code
    assets/          <- the game's images (ship.png, rock.png …), named like the animations in the code
    cover.png        <- optional: the Arcade card picture (630 x 500 looks best)
    info.json        <- optional: title, creator and more (see below)
```

**Folder names:** letters, numbers, `-` and `_` only, with no spaces. The Arcade turns `SpaceShooter` into the title "Space Shooter".

**Upload:** go to `github.com/executivetick/impactgamedesign/upload/main/games/gamelab`, drag the whole game folder in, and click **Commit changes**.

**Optional `info.json`** (leave out any line you don't need):

```json
{
  "title": "Space Shooter",
  "creator": "Derwin C.",
  "genre": "Shooter",
  "course": "Computer Literacy",
  "year": "2026-27",
  "pitch": "Blast asteroids before they reach your ship.",
  "controls": "Arrow keys to move, Space to shoot.",
  "credits": "Art from the Game Lab library.",
  "featured": false
}
```

- Set `"featured": true` to show the game on the Home page.
- Set `"hidden": true` to take a game off the Arcade without deleting it.
- Use first name + last initial for students.

Games run with the GameLabJS runtime in `gamelab/gamelab.js` on a 400 x 400 canvas. If a game uses a Game Lab command the runtime doesn't have yet, the game shows a "GameLabJS Error" screen naming it.
