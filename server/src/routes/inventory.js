import { Router } from 'express';
import { all, get, run } from '../lib/db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, async (req, res) => {
	const rows = await all(
		`SELECT i.id, i.quantity, s.id as skin_id, s.name, s.image, s.value
		 FROM inventories i JOIN skins s ON s.id = i.skin_id
		 WHERE i.user_id = ? ORDER BY s.value DESC`,
		[req.user.id]
	);
	return res.json(rows);
});

router.post('/grant', requireAuth, requireAdmin, async (req, res) => {
	const { user_id, skin_id, quantity } = req.body || {};
	if (!user_id || !skin_id || !quantity) return res.status(400).json({ error: 'Missing fields' });
	const existing = await get('SELECT id, quantity FROM inventories WHERE user_id = ? AND skin_id = ?', [user_id, skin_id]);
	if (existing) {
		await run('UPDATE inventories SET quantity = ? WHERE id = ?', [existing.quantity + quantity, existing.id]);
	} else {
		await run('INSERT INTO inventories(user_id, skin_id, quantity) VALUES (?,?,?)', [user_id, skin_id, quantity]);
	}
	return res.json({ ok: true });
});

router.post('/consume', requireAuth, async (req, res) => {
	const { skin_id, quantity } = req.body || {};
	if (!skin_id || !quantity) return res.status(400).json({ error: 'Missing fields' });
	const inv = await get('SELECT id, quantity FROM inventories WHERE user_id = ? AND skin_id = ?', [req.user.id, skin_id]);
	if (!inv || inv.quantity < quantity) return res.status(400).json({ error: 'Not enough quantity' });
	await run('UPDATE inventories SET quantity = ? WHERE id = ?', [inv.quantity - quantity, inv.id]);
	return res.json({ ok: true });
});

export default router; 