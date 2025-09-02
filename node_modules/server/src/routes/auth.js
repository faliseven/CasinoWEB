import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { get, run, all } from '../lib/db.js';

const router = Router();

const isProd = process.env.NODE_ENV === 'production';
const cookieOptions = {
	httpOnly: true,
	sameSite: isProd ? 'none' : 'lax',
	secure: isProd,
	path: '/'
};

router.post('/register', async (req, res) => {
	const { email, password, username } = req.body || {};
	if (!email || !password || !username) return res.status(400).json({ error: 'Missing fields' });
	const existing = await get('SELECT id FROM users WHERE email = ?', [email]).catch(() => null);
	if (existing) return res.status(409).json({ error: 'Email already registered' });
	const password_hash = await bcrypt.hash(password, 10);
	// If this is the very first user, promote to admin for convenience
	const total = await get('SELECT COUNT(*) as c FROM users');
	const is_admin = total?.c === 0 ? 1 : 0;
	try {
		await run('INSERT INTO users(email, password_hash, username, is_admin) VALUES (?,?,?,?)', [email, password_hash, username, is_admin]);
		return res.json({ ok: true, is_admin: !!is_admin });
	} catch (e) {
		return res.status(500).json({ error: 'Failed to create user' });
	}
});

router.post('/login', async (req, res) => {
	const { email, password } = req.body || {};
	if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
	const user = await get('SELECT id, email, password_hash, username, is_admin FROM users WHERE email = ?', [email]);
	if (!user) return res.status(401).json({ error: 'Invalid credentials' });
	const ok = await bcrypt.compare(password, user.password_hash);
	if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

	if (process.env.AUTO_ADMIN_EMAIL && process.env.AUTO_ADMIN_EMAIL === email && !user.is_admin) {
		await run('UPDATE users SET is_admin = 1 WHERE id = ?', [user.id]);
		user.is_admin = 1;
	}

	const token = jwt.sign({ id: user.id, email: user.email, username: user.username, is_admin: !!user.is_admin }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
	res.cookie('token', token, cookieOptions);
	return res.json({ id: user.id, email: user.email, username: user.username, is_admin: !!user.is_admin });
});

router.get('/me', async (req, res) => {
	const token = req.cookies['token'];
	if (!token) return res.json(null);
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
		return res.json(payload);
	} catch {
		return res.json(null);
	}
});

router.post('/logout', (req, res) => {
	res.clearCookie('token', cookieOptions);
	return res.json({ ok: true });
});

export default router; 