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
import crashRouter from './routes/games_crash.js';
import doubleRouter from './routes/games_double.js';
import statsRouter from './routes/stats.js';
import adminRouter from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Root
app.get('/', (_req, res) => res.type('text').send('API server is running. Use /health'));
// Health
app.get('/health', (_req, res) => res.json({ ok: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/skins', skinsRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/games', gamesRouter);
app.use('/api/crash', crashRouter);
app.use('/api/double', doubleRouter);
app.use('/api/stats', statsRouter);
app.use('/api/admin', adminRouter);

// Start
initDb().then(() => {
	app.listen(PORT, () => {
		console.log(`[server] running on http://localhost:${PORT}`);
	});
}).catch((err) => {
	console.error('DB init failed', err);
	process.exit(1);
}); 