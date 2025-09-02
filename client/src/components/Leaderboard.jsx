import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

export default function Leaderboard() {
	const [range, setRange] = useState('today');
	const [rows, setRows] = useState(null);
	useEffect(() => {
		let alive = true;
		api.leaderboard(range).then(r => alive && setRows(r));
		return () => { alive = false; };
	}, [range]);
	return (
		<section className="panel glass">
			<div className="feed-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<h3>Top winners</h3>
				<div className="tabs">
					<button className={range==='today'?'active':''} onClick={() => setRange('today')}>Today</button>
					<button className={range==='week'?'active':''} onClick={() => setRange('week')}>Week</button>
				</div>
			</div>
			<div className="feed">
				{rows ? rows.map((r,i) => (
					<div key={r.username + i} className="feed-row">
						<div className="t user"><span className="badge">{i+1}</span> {r.username}</div>
						<div className="t result">+{r.best_payout}</div>
					</div>
				)) : Array.from({ length: 5 }).map((_,i) => <div key={i} className="feed-row skeleton" />)}
			</div>
		</section>
	);
} 