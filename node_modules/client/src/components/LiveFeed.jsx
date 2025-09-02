import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

function Row({ g }) {
	return (
		<div className={`feed-row ${g.result}`}>
			<div className="t game">{g.game_type.toUpperCase()}</div>
			<div className="t user">{g.username}</div>
			<div className="t bet">{g.bet_value}</div>
			<div className="t result">{g.result === 'win' ? `+${g.payout_value}` : '—'}</div>
			<div className="t time">{new Date(g.created_at).toLocaleTimeString()}</div>
		</div>
	);
}

export default function LiveFeed({ filters }) {
	const [rows, setRows] = useState(null);
	useEffect(() => {
		let alive = true;
		api.recentGames(30).then(r => alive && setRows(r));
		const id = setInterval(() => api.recentGames(30).then(r => alive && setRows(r)), 5000);
		return () => { alive = false; clearInterval(id); };
	}, []);

	const filtered = rows?.filter(r => {
		if (filters?.types) {
			if (!filters.types[r.game_type]) return false;
		}
		if (filters?.results) {
			if (!filters.results[r.result]) return false;
		}
		return true;
	});

	return (
		<section className="panel glass">
			<div className="feed-head">
				<h3>Live feed</h3>
			</div>
			<div className="feed">
				{(filtered ?? rows)?.length ? (filtered ?? rows).map(r => <Row key={r.id} g={r} />) : (!rows ? Array.from({ length: 6 }).map((_,i) => <div key={i} className="feed-row skeleton" />) : <div className="sub" style={{ color: 'var(--muted)' }}>No results</div>)}
			</div>
		</section>
	);
} 