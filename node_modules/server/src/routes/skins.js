import { Router } from 'express';
import { all, get, run } from '../lib/db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
	const rows = await all('SELECT id, name, image, value FROM skins ORDER BY value DESC');
	return res.json(rows);
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
	const { name, image, value } = req.body || {};
	if (!name || !image || typeof value !== 'number') return res.status(400).json({ error: 'Missing fields' });
	await run('INSERT INTO skins(name, image, value) VALUES (?,?,?)', [name, image, value]);
	return res.json({ ok: true });
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
	const { id } = req.params;
	const { name, image, value } = req.body || {};
	const skin = await get('SELECT id FROM skins WHERE id = ?', [id]);
	if (!skin) return res.status(404).json({ error: 'Not found' });
	await run('UPDATE skins SET name = ?, image = ?, value = ? WHERE id = ?', [name, image, value, id]);
	return res.json({ ok: true });
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
	const { id } = req.params;
	await run('DELETE FROM skins WHERE id = ?', [id]);
	return res.json({ ok: true });
});

export default router; 