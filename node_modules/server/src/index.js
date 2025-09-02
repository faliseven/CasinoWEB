import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './lib/db.js';
import authRouter from './routes/auth.js';
import skinsRouter from './routes/skins.js';
import inventoryRouter from './routes/inventory.js';
import gamesRouter from './routes/games.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Health
app.get('/health', (_req, res) => res.json({ ok: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/skins', skinsRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/games', gamesRouter);

// Start
initDb().then(() => {
	app.listen(PORT, () => {
		console.log(`[server] running on http://localhost:${PORT}`);
	});
}).catch((err) => {
	console.error('DB init failed', err);
	process.exit(1);
}); 