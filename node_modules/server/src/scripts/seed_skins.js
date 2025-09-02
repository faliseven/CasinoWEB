import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb, run } from '../lib/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '../../..');
const skinsDir = path.join(rootDir, 'client/public/skins');

const skins = [
	{ name: 'AWP | Dragon Lore', image: 'awp-dragon-lore.svg', value: 10000 },
	{ name: 'M4A4 | Howl', image: 'm4a4-howl.svg', value: 7000 },
	{ name: 'AK-47 | Redline', image: 'ak-redline.svg', value: 800 },
	{ name: 'AK-47 | Fire Serpent', image: 'ak-fire-serpent.svg', value: 4500 },
	{ name: 'Karambit | Doppler', image: 'karambit-doppler.svg', value: 6000 },
	{ name: 'Glock-18 | Fade', image: 'glock-fade.svg', value: 1200 },
	{ name: 'Desert Eagle | Blaze', image: 'deagle-blaze.svg', value: 3000 },
	{ name: 'USP-S | Kill Confirmed', image: 'usps-kill-confirmed.svg', value: 1400 },
	{ name: 'AK-47 | Neon Rider', image: 'ak-neon-rider.svg', value: 900 },
	{ name: 'AWP | Asiimov', image: 'awp-asiimov.svg', value: 1100 }
];

function placeholderSvg(title, color) {
	return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">\n<defs>\n	<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">\n		<stop offset="0%" stop-color="#0f1116"/>\n		<stop offset="100%" stop-color="${color}"/>\n	</linearGradient>\n</defs>\n<rect width="800" height="450" fill="url(#g)"/>\n<rect x="40" y="40" width="720" height="370" rx="18" fill="#00000022" stroke="#ffffff22"/>\n<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Segoe UI, Roboto, Arial" font-size="36" fill="#e6e8ef">${title}</text>\n<text x="50%" y="75%" dominant-baseline="middle" text-anchor="middle" font-family="Segoe UI, Roboto, Arial" font-size="16" fill="#9aa3b2">Placeholder preview</text>\n</svg>`;
}

async function main() {
	await initDb();
	if (!fs.existsSync(skinsDir)) fs.mkdirSync(skinsDir, { recursive: true });
	for (const s of skins) {
		await run('INSERT INTO skins(name, image, value) VALUES (?,?,?)', [s.name, s.image, s.value]).catch(() => {});
		const out = path.join(skinsDir, s.image);
		if (!fs.existsSync(out)) {
			const color = '#'+Math.floor(Math.random()*16777215).toString(16).padStart(6,'0');
			fs.writeFileSync(out, placeholderSvg(s.name, color));
		}
	}
	console.log('Seeded skins and ensured placeholder images exist.');
	process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); }); 