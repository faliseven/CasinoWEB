import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

function Card({ title, value, sub, accent }) {
	return (
		<div className="kpi-card panel glass" style={{ borderColor: accent }}>
			<div className="kpi-title">{title}</div>
			<div className="kpi-value" style={{ color: accent }}>{value}</div>
			{typeof sub !== 'undefined' && <div className="kpi-sub">{sub}</div>}
			<div className="kpi-mini">
				<div className="bar" />
			</div>
		</div>
	);
}

export default function KPICards() {
	const [data, setData] = useState(null);
	useEffect(() => {
		let alive = true;
		api.statsSummary().then(d => alive && setData(d));
		const id = setInterval(() => api.statsSummary().then(d => alive && setData(d)), 7000);
		return () => { alive = false; clearInterval(id); };
	}, []);
	return (
		<div className="kpi-grid">
			<Card title="Games today" value={data?.games ?? '—'} sub={`Wins ${data?.wins ?? 0}`} accent="#6c9ef8" />
			<Card title="Winrate" value={`${data?.winrate ?? 0}%`} sub="of all games" accent="#2ed3a2" />
			<Card title="Total bets" value={data?.total_bet ?? 0} sub="sum of stakes" accent="#b16cea" />
			<Card title="Total payout" value={data?.total_payout ?? 0} sub="awarded" accent="#f6a94b" />
		</div>
	);
} 