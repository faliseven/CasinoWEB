import { Router } from 'express';
import { all, get } from '../lib/db.js';

const router = Router();

router.get('/games/recent', async (req, res) => {
	const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 30));
	const rows = await all(
		`SELECT g.id, g.user_id, g.game_type, g.bet_value, g.result, g.payout_value, g.multiplier, g.meta, g.created_at, u.username
		 FROM games g JOIN users u ON u.id = g.user_id
		 ORDER BY g.created_at DESC, g.id DESC LIMIT ?`,
		[limit]
	);
	return res.json(rows);
});

router.get('/summary', async (_req, res) => {
	const today = await get(
		`SELECT COUNT(*) as games, SUM(CASE WHEN result='win' THEN 1 ELSE 0 END) as wins,
		 SUM(bet_value) as total_bet, SUM(payout_value) as total_payout
		 FROM games WHERE DATE(created_at) = DATE('now','localtime')`
	);
	const winrate = today && today.games ? Math.round((today.wins / today.games) * 100) : 0;
	return res.json({ games: today?.games || 0, wins: today?.wins || 0, winrate, total_bet: today?.total_bet || 0, total_payout: today?.total_payout || 0 });
});

router.get('/leaderboard', async (req, res) => {
	const range = (req.query.range || 'today').toString();
	let where = '';
	if (range === 'today') where = `WHERE DATE(g.created_at) = DATE('now','localtime')`;
	else if (range === 'week') where = `WHERE DATE(g.created_at) >= DATE('now','-7 day','localtime')`;
	const rows = await all(
		`SELECT u.username, MAX(g.payout_value) as best_payout
		 FROM games g JOIN users u ON u.id = g.user_id ${where}
		 GROUP BY g.user_id ORDER BY best_payout DESC LIMIT 10`
	);
	return res.json(rows);
});

export default router; 