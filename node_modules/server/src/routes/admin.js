import { Router } from 'express';
import { all, run } from '../lib/db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/users', requireAuth, requireAdmin, async (req, res) => {
	const q = (req.query.q || '').toString().trim();
	let rows;
	if (q) {
		const like = `%${q}%`;
		rows = await all('SELECT id, email, username, is_admin FROM users WHERE email LIKE ? OR username LIKE ? ORDER BY id DESC LIMIT 50', [like, like]);
	} else {
		rows = await all('SELECT id, email, username, is_admin FROM users ORDER BY id DESC LIMIT 50');
	}
	return res.json(rows);
});

router.post('/users/:id/admin', requireAuth, requireAdmin, async (req, res) => {
	const { id } = req.params;
	const is_admin = req.body?.is_admin ? 1 : 0;
	await run('UPDATE users SET is_admin = ? WHERE id = ?', [is_admin, id]);
	return res.json({ ok: true });
});

export default router; 