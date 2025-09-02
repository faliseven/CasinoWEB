import { Router } from 'express';
import { get, run } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

// In-memory rounds keyed by user id
const userRounds = new Map();

function nowMs() { return Date.now(); }
// Simple curve: multiplier(t) = 1 + rate * t, bust at bustMultiplier
function multiplierAt(startMs, rate) {
	const elapsed = Math.max(0, nowMs() - startMs) / 1000; // seconds
	return 1 + rate * elapsed;
}

function randomBust() {
	// Heavily weighted to 1.1-3.0, sometimes spikes
	const r = Math.random();
	if (r < 0.75) return (1.05 + Math.random() * 1.5).toFixed(2);
	if (r < 0.95) return (2.0 + Math.random() * 3.0).toFixed(2);
	return (5.0 + Math.random() * 15.0).toFixed(2);
}

const router = Router();

router.post('/start', requireAuth, async (req, res) => {
	const { bet_skin_id, bet_quantity, rig_bust, rig_rate } = req.body || {};
	if (!bet_skin_id || !bet_quantity) return res.status(400).json({ error: 'Missing fields' });
	const inv = await get(
		`SELECT i.id, i.quantity, s.value FROM inventories i JOIN skins s ON s.id = i.skin_id WHERE i.user_id = ? AND i.skin_id = ?`,
		[req.user.id, bet_skin_id]
	);
	if (!inv || inv.quantity < bet_quantity) return res.status(400).json({ error: 'Not enough quantity' });

	// consume upfront
	await run('UPDATE inventories SET quantity = ? WHERE id = ?', [inv.quantity - bet_quantity, inv.id]);
	const betValue = inv.value * bet_quantity;

	const bustMultiplier = req.user.is_admin && rig_bust ? Number(rig_bust) : Number(randomBust());
	const rate = Number(rig_rate) || 0.6; // units per second
	const startMs = nowMs();
	userRounds.set(req.user.id, { startMs, rate, bustMultiplier, betValue, bet_skin_id, bet_quantity, settled: false });
	return res.json({ startMs, rate, bustMultiplier });
});

router.post('/cashout', requireAuth, async (req, res) => {
	const round = userRounds.get(req.user.id);
	if (!round) return res.status(400).json({ error: 'No active round' });
	if (round.settled) return res.status(400).json({ error: 'Round already settled' });
	const current = multiplierAt(round.startMs, round.rate);
	if (current >= round.bustMultiplier) {
		// busted before cashout
		round.settled = true;
		await run('INSERT INTO games(user_id, game_type, bet_value, result, payout_value, multiplier) VALUES (?,?,?,?,?,?)', [
			req.user.id, 'crash', round.betValue, 'lose', 0, round.bustMultiplier
		]);
		return res.status(400).json({ error: 'Busted' });
	}
	// win
	round.settled = true;
	const payout = Math.floor(round.betValue * current);
	// reward as skins quantity proportional to original skin value
	const unitValue = Math.max(1, Math.floor(round.betValue / round.bet_quantity));
	const extra = Math.max(0, Math.floor(payout / unitValue) - round.bet_quantity);
	// add extra quantity to same inventory item (may need to recreate row if consumed fully)
	const inv = await get('SELECT id, quantity FROM inventories WHERE user_id = ? AND skin_id = ?', [req.user.id, round.bet_skin_id]);
	if (inv) {
		await run('UPDATE inventories SET quantity = ? WHERE id = ?', [inv.quantity + extra, inv.id]);
	} else {
		await run('INSERT INTO inventories(user_id, skin_id, quantity) VALUES (?,?,?)', [req.user.id, round.bet_skin_id, extra]);
	}
	await run('INSERT INTO games(user_id, game_type, bet_value, result, payout_value, multiplier) VALUES (?,?,?,?,?,?)', [
		req.user.id, 'crash', round.betValue, 'win', payout, Number(current.toFixed(2))
	]);
	return res.json({ result: 'win', multiplier: Number(current.toFixed(2)), payout_value: payout });
});

router.get('/status', requireAuth, (req, res) => {
	const round = userRounds.get(req.user.id);
	if (!round) return res.json(null);
	const current = multiplierAt(round.startMs, round.rate);
	return res.json({ current: Number(current.toFixed(2)), bustMultiplier: round.bustMultiplier, started: round.startMs, settled: !!round.settled });
});

export default router; 