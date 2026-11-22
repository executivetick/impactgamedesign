# Other web games go here

Godot, GDevelop, Twine, any HTML5 game, and **Game Lab games converted to run without Code.org**. Use one folder per game with `index.html` inside. It works exactly like `games/unity/`, including the optional `cover.png` and `info.json`.

## Converting a Game Lab game (GameLabJS)

1. Copy the `_GameLabTemplate` folder and rename the copy, e.g. `SpaceShooter`. Use no spaces, and don't start the name with `_`; `_` folders are ignored.
2. Replace `game.js` with the student's Game Lab code. In Code.org, open the project in text mode, select all the code, and paste it into `game.js`.
3. Put the game's images in `assets/`, named like the animations in the code (`ship.png` for `setAnimation("ship")`).
4. Fill in `info.json` (title, creator…). Keep `"engine": "Game Lab"` and `"aspect": "1/1"`.
5. Upload the folder to `github.com/executivetick/impactgamedesign/upload/main/games/html5`.

The game runs on the GameLabJS runtime (`gamelab.js`, included in the template) on a 400 x 400 canvas. If it uses a Game Lab command the runtime doesn't support, it shows a "GameLabJS Error" screen naming it. Keep that game as a Code.org link in `games/gamelab/` instead.
