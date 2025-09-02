import { Router } from 'express';
import { get, run } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function randomBool() {
	return Math.random() < 0.5;
}

router.post('/coinflip', requireAuth, async (req, res) => {
	const { bet_skin_id, bet_quantity, rig_outcome } = req.body || {};
	if (!bet_skin_id || !bet_quantity) return res.status(400).json({ error: 'Missing fields' });

	const inv = await get(
		`SELECT i.id, i.quantity, s.value FROM inventories i JOIN skins s ON s.id = i.skin_id WHERE i.user_id = ? AND i.skin_id = ?`,
		[req.user.id, bet_skin_id]
	);
	if (!inv || inv.quantity < bet_quantity) return res.status(400).json({ error: 'Not enough quantity' });

	const totalBet = inv.value * bet_quantity;
	let win = randomBool();
	if (typeof rig_outcome === 'boolean' && req.user.is_admin) {
		win = rig_outcome;
	}

	if (win) {
		// payout 2x: add same quantity
		await run('UPDATE inventories SET quantity = ? WHERE id = ?', [inv.quantity + bet_quantity, inv.id]);
		await run('INSERT INTO games(user_id, game_type, bet_value, result, payout_value) VALUES (?,?,?,?,?)', [req.user.id, 'coinflip', totalBet, 'win', totalBet * 2]);
		return res.json({ result: 'win', payout_value: totalBet * 2 });
	} else {
		// lose: subtract quantity
		await run('UPDATE inventories SET quantity = ? WHERE id = ?', [inv.quantity - bet_quantity, inv.id]);
		await run('INSERT INTO games(user_id, game_type, bet_value, result, payout_value) VALUES (?,?,?,?,?)', [req.user.id, 'coinflip', totalBet, 'lose', 0]);
		return res.json({ result: 'lose', payout_value: 0 });
	}
});

export default router; 