/* =====================================================================
   THE GAME LIST — the only file you edit to add a game to the Arcade.
   Copy one { ... } block, paste it at the TOP of the list, and fill it in.
   Newest first. Remember the comma between blocks.

   id        short name, lowercase, dashes only (used in the page link)
   title     game name
   studio    studio name
   team      first name + last initial only, with roles
   genre     Platformer, Puzzle, Narrative, Arcade, ... (a new genre adds a new filter button)
   engine    Unity, Godot, GDevelop, Scratch, Twine, ...
   course    your course name
   year      school year, e.g. "2026-27"
   cover     cover image, 630 x 500 (put it in the game's folder). "" = placeholder art
   pitch     two sentences: the hook, and what the player does
   controls  how to play
   play      WHERE THE GAME IS. One of:
               { type: "local",   src: "games/<id>/index.html" }   game files in this repo
               { type: "itch",    src: "https://itch.io/embed-upload/XXXXXXX?color=0B1F3A" }
               { type: "scratch", src: "https://scratch.mit.edu/projects/XXXXXXX/embed" }
   aspect    shape of the game window: "16/9" (default), "4/3", "1/1"
   devlog    link to the team's dev log (Google Doc, etc.) or ""
   credits   every team member and every borrowed asset with its license
   feedback  link to a feedback Google Form, or ""
   featured  true = shown on the Home page (only one game at a time)
   ===================================================================== */
window.GAMES = [

  {
    id: "sample-dodge",
    title: "Pixel Dodge (sample)",
    studio: "Code to Create",
    team: "[Teacher name] — sample game to show how the Arcade works. Delete this block once real games are in.",
    genre: "Arcade",
    engine: "HTML5",
    course: "[Course 1]",
    year: "2026-27",
    cover: "games/sample-dodge/cover.webp",
    pitch: "Falling blocks, one tiny ship. Dodge as long as you can and beat your best score.",
    controls: "Left / Right arrow keys (or A / D) to move. Space to restart. Click the game first.",
    play: { type: "local", src: "games/sample-dodge/index.html" },
    aspect: "16/9",
    devlog: "",
    credits: "Made for the Code to Create site template. No outside assets.",
    feedback: "",
    featured: false
  }

  /* ---- TEMPLATE: copy from here ----
  ,{
    id: "sky-runner",
    title: "[Game title]",
    studio: "[Studio name]",
    team: "[First name L.] (programming), [First name L.] (art), [First name L.] (design)",
    genre: "Platformer",
    engine: "Unity",
    course: "[Course 2]",
    year: "2026-27",
    cover: "games/sky-runner/cover.png",
    pitch: "[Two sentences.]",
    controls: "[How to play.]",
    play: { type: "local", src: "games/sky-runner/index.html" },
    aspect: "16/9",
    devlog: "",
    credits: "[Team and asset credits.]",
    feedback: "",
    featured: false
  }
  ---- to here ---- */

];
