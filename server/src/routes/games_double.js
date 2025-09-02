import { Router } from 'express';
import { get, run } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function rollOutcome(rig) {
	if (typeof rig === 'string') return rig; // 'red'|'black'|'green'
	const r = Math.random();
	if (r < 0.02) return 'green';
	if (r < 0.51) return 'red';
	return 'black';
}

router.post('/bet', requireAuth, async (req, res) => {
	const { bet_skin_id, bet_quantity, side, rig_outcome } = req.body || {};
	if (!bet_skin_id || !bet_quantity || !side) return res.status(400).json({ error: 'Missing fields' });
	if (!['red','black','green'].includes(side)) return res.status(400).json({ error: 'Invalid side' });
	const inv = await get(
		`SELECT i.id, i.quantity, s.value FROM inventories i JOIN skins s ON s.id = i.skin_id WHERE i.user_id = ? AND i.skin_id = ?`,
		[req.user.id, bet_skin_id]
	);
	if (!inv || inv.quantity < bet_quantity) return res.status(400).json({ error: 'Not enough quantity' });

	// consume bet
	await run('UPDATE inventories SET quantity = ? WHERE id = ?', [inv.quantity - bet_quantity, inv.id]);
	const betValue = inv.value * bet_quantity;
	let outcome = rollOutcome(req.user.is_admin ? rig_outcome : undefined);

	let multiplier = 0;
	if (outcome === 'green') multiplier = 14;
	else if (outcome === side) multiplier = 2;

	if (multiplier > 0) {
		const payout = betValue * multiplier;
		const extra = Math.floor((payout / inv.value)) - bet_quantity;
		const existing = await get('SELECT id, quantity FROM inventories WHERE user_id = ? AND skin_id = ?', [req.user.id, bet_skin_id]);
		if (existing) await run('UPDATE inventories SET quantity = ? WHERE id = ?', [existing.quantity + extra, existing.id]);
		else await run('INSERT INTO inventories(user_id, skin_id, quantity) VALUES (?,?,?)', [req.user.id, bet_skin_id, extra]);
		await run('INSERT INTO games(user_id, game_type, bet_value, result, payout_value, multiplier, meta) VALUES (?,?,?,?,?,?,?)', [
			req.user.id, 'double', betValue, 'win', payout, multiplier, JSON.stringify({ side, outcome })
		]);
		return res.json({ result: 'win', outcome, multiplier, payout_value: payout });
	} else {
		await run('INSERT INTO games(user_id, game_type, bet_value, result, payout_value, multiplier, meta) VALUES (?,?,?,?,?,?,?)', [
			req.user.id, 'double', betValue, 'lose', 0, 0, JSON.stringify({ side, outcome })
		]);
		return res.json({ result: 'lose', outcome, multiplier: 0, payout_value: 0 });
	}
});

export default router; 