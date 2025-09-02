import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../../data');
const dbPath = path.join(dataDir, 'app.db');
let db;

export function getDb() {
	if (!db) throw new Error('DB not initialized');
	return db;
}

export async function initDb() {
	sqlite3.verbose();
	if (!fs.existsSync(dataDir)) {
		fs.mkdirSync(dataDir, { recursive: true });
	}
	db = new sqlite3.Database(dbPath);
	await run(`PRAGMA foreign_keys = ON;`);
	await run(`CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT UNIQUE NOT NULL,
		password_hash TEXT NOT NULL,
		username TEXT NOT NULL,
		is_admin INTEGER DEFAULT 0
	);`);
	await run(`CREATE TABLE IF NOT EXISTS skins (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		image TEXT NOT NULL,
		value INTEGER NOT NULL
	);`);
	await run(`CREATE TABLE IF NOT EXISTS inventories (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		skin_id INTEGER NOT NULL,
		quantity INTEGER NOT NULL DEFAULT 1,
		FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
		FOREIGN KEY(skin_id) REFERENCES skins(id) ON DELETE CASCADE
	);`);
	await run(`CREATE TABLE IF NOT EXISTS games (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		game_type TEXT NOT NULL,
		bet_value INTEGER NOT NULL,
		result TEXT NOT NULL,
		payout_value INTEGER NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		multiplier REAL,
		meta TEXT,
		FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
	);`);
	// Optional columns for existing DBs
	await run(`ALTER TABLE games ADD COLUMN multiplier REAL`, []).catch(() => {});
	await run(`ALTER TABLE games ADD COLUMN meta TEXT`, []).catch(() => {});
	// Indexes to speed stats
	await run(`CREATE INDEX IF NOT EXISTS idx_games_created ON games(created_at DESC)`);
	await run(`CREATE INDEX IF NOT EXISTS idx_games_type ON games(game_type)`);
	await run(`CREATE INDEX IF NOT EXISTS idx_games_result ON games(result)`);
}

export function run(sql, params = []) {
	return new Promise((resolve, reject) => {
		getDb().run(sql, params, function (err) {
			if (err) return reject(err);
			resolve(this);
		});
	});
}

export function all(sql, params = []) {
	return new Promise((resolve, reject) => {
		getDb().all(sql, params, (err, rows) => {
			if (err) return reject(err);
			resolve(rows);
		});
	});
}

export function get(sql, params = []) {
	return new Promise((resolve, reject) => {
		getDb().get(sql, params, (err, row) => {
			if (err) return reject(err);
			resolve(row);
		});
	});
} 