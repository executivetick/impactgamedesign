// Builds the Arcade's automatic game list from the folders in games/.
//
//   games/gamelab/<Name>/link.txt     -> a Code.org Game Lab / App Lab / Sprite Lab game, played with
//                                        Code.org's embed. link.txt holds the project's share link
//                                        (or put "link" in info.json instead).
//   games/unity/<Name>/index.html     -> a Unity WebGL build
//   games/html5/<Name>/index.html     -> any other web game (Godot, GDevelop, Twine, ...)
//
// Optional in each game folder:
//   info.json  -> { "title", "creator", "genre", "course", "year", "pitch", "controls",
//                   "credits", "devlog", "feedback", "aspect", "featured", "hidden",
//                   "link" (Code.org share link, games/gamelab only) }
//   cover.png / cover.jpg / cover.webp  -> the Arcade card image (630 x 500 looks best)
//   title.png  -> Code.org games: a screenshot of the game's title screen, shown before it starts
//
// GitHub runs this automatically on every upload (.github/workflows/deploy.yml).
// To preview on your own computer: node scripts/build-arcade.mjs

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'assets', 'js', 'games-auto.js');
const KINDS = [
  { dir: 'games/gamelab', engine: 'Game Lab', type: 'codeorg', aspect: '1/1', entry: null },
  { dir: 'games/unity', engine: 'Unity', type: 'local', aspect: '16/9', entry: 'index.html' },
  { dir: 'games/html5', engine: 'HTML5', type: 'local', aspect: '16/9', entry: 'index.html' },
];
const COVER = /^cover\.(png|jpe?g|webp|gif)$/i;
const POSTER = /^title\.(png|jpe?g|webp|gif)$/i;
const problems = [];

const titleFromFolder = (name) => name
  .replace(/[_-]+/g, ' ')
  .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
  .replace(/\s+/g, ' ').trim();
const CODEORG = /https:\/\/studio\.code\.org\/projects\/(gamelab|applab|spritelab)\/([A-Za-z0-9_-]+)/i;
const CODEORG_NAMES = { gamelab: 'Game Lab', applab: 'App Lab', spritelab: 'Sprite Lab' };
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const urlPath = (p) => p.split('/').map(encodeURIComponent).join('/');

function lastChanged(rel) {
  try { return Number(execSync(`git log -1 --format=%ct -- "${rel}"`, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()) || 0; }
  catch { return 0; }
}

function findEntry(folderAbs, entry) {
  // Accept the entry file at the top of the folder, or one folder down
  // (zips often unpack as MyGame/MyGame/index.html).
  if (fs.existsSync(path.join(folderAbs, entry))) return '';
  const subs = fs.readdirSync(folderAbs, { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith('.'));
  for (const d of subs) if (fs.existsSync(path.join(folderAbs, d.name, entry))) return d.name + '/';
  return null;
}

function walk(dir) {
  const out = [];
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) out.push(...walk(p)); else out.push(p);
  }
  return out;
}

const games = [];
for (const kind of KINDS) {
  const base = path.join(ROOT, kind.dir);
  if (!fs.existsSync(base)) continue;
  for (const d of fs.readdirSync(base, { withFileTypes: true })) {
    if (!d.isDirectory() || d.name.startsWith('.') || d.name.startsWith('_')) continue;
    const folder = d.name;
    const rel = `${kind.dir}/${folder}`;
    const abs = path.join(base, folder);

    let sub = '';
    if (kind.entry) {
      sub = findEntry(abs, kind.entry);
      if (sub === null) { problems.push(`${rel}: skipped, no ${kind.entry} found.`); continue; }
    }

    let info = {};
    const infoPath = path.join(abs, 'info.json');
    if (fs.existsSync(infoPath)) {
      try { info = JSON.parse(fs.readFileSync(infoPath, 'utf8')); }
      catch (e) { problems.push(`${rel}/info.json: not valid JSON (${e.message}). Using defaults.`); }
    }
    if (info.hidden) continue;

    let co = null;
    if (kind.type === 'codeorg') {
      let raw = info.link || info.codeorg || info.url || '';
      const linkFile = fs.readdirSync(abs).find((f) => /^link\.txt$/i.test(f));
      if (!raw && linkFile) raw = fs.readFileSync(path.join(abs, linkFile), 'utf8');
      const m = String(raw).match(CODEORG);
      if (!m) { problems.push(`${rel}: skipped. Add link.txt with the Code.org share link (https://studio.code.org/projects/gamelab/...).`); continue; }
      co = { lab: m[1].toLowerCase(), id: m[2] };
    }

    const files = walk(abs).map((f) => path.relative(abs, f).split(path.sep).join('/'));
    if (kind.engine === 'Unity' && files.some((f) => /\.br$/i.test(f))) {
      problems.push(`${rel}: skipped. This Unity build uses Brotli (.br files), which won't load on GitHub Pages. Rebuild with Compression Format: Disabled.`);
      continue;
    }
    const big = files.filter((f) => fs.statSync(path.join(abs, f)).size > 95 * 1024 * 1024);
    if (big.length) problems.push(`${rel}: files near GitHub's 100 MB limit: ${big.join(', ')}`);

    const cover = fs.readdirSync(abs).find((f) => COVER.test(f));
    const poster = fs.readdirSync(abs).find((f) => POSTER.test(f));
    const id = `${kind.type === 'codeorg' ? 'codeorg' : slug(kind.engine)}-${slug(folder)}`;
    const play = co
      ? { type: 'codeorg', src: `https://studio.code.org/projects/${co.lab}/${co.id}` }
      : { type: 'local', src: urlPath(`${rel}/${sub}index.html`) };

    games.push({
      id,
      title: info.title || titleFromFolder(folder),
      studio: info.creator || info.studio || '',
      team: info.team || '',
      genre: info.genre || 'Arcade',
      engine: info.engine || (co ? CODEORG_NAMES[co.lab] : kind.engine),
      course: info.course || '',
      year: info.year || '',
      cover: cover ? urlPath(`${rel}/${cover}`) : '',
      poster: poster ? urlPath(`${rel}/${poster}`) : '',
      pitch: info.pitch || '',
      controls: info.controls || '',
      play,
      aspect: info.aspect || (co && co.lab === 'applab' ? '2/3' : kind.aspect),
      devlog: info.devlog || '',
      credits: info.credits || '',
      feedback: info.feedback || '',
      featured: !!info.featured,
      auto: true,
      _t: lastChanged(rel),
    });
  }
}

games.sort((a, b) => (b._t - a._t) || a.title.localeCompare(b.title));
games.forEach((g) => delete g._t);

const out = '/* AUTOMATIC GAME LIST: built from the folders in games/gamelab, games/unity and games/html5.\n' +
  '   Don\'t edit this file; GitHub rebuilds it on every upload (scripts/build-arcade.mjs). */\n' +
  'window.AUTO_GAMES = ' + JSON.stringify(games, null, 2) + ';\n';
fs.writeFileSync(OUT, out);

console.log(`Arcade: ${games.length} game(s) found in game folders.`);
games.forEach((g) => console.log(`  + ${g.title}  [${g.engine}]  ${g.play.src}`));
if (problems.length) {
  console.log('\nCheck these:');
  problems.forEach((p) => console.log('  ! ' + p));
  if (process.env.GITHUB_ACTIONS) problems.forEach((p) => console.log(`::warning::${p}`));
}
