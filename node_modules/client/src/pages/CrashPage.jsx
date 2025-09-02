import { useEffect, useRef, useState } from 'react';
import { api } from '../services/api.js';
import { useToasts } from '../components/ToastProvider.jsx';
import CrashSparkline from '../components/CrashSparkline.jsx';

export default function CrashPage() {
	const [skins, setSkins] = useState([]);
	const [skinId, setSkinId] = useState(null);
	const [qty, setQty] = useState(1);
	const [round, setRound] = useState(null);
	const [current, setCurrent] = useState(1.0);
	const [history, setHistory] = useState([]);
	const toasts = useToasts();
	const animRef = useRef(null);

	useEffect(() => { api.getSkins().then(setSkins); }, []);
	useEffect(() => { api.recentGames(20).then(d => setHistory(d.filter(x => x.game_type === 'crash'))); }, []);

	useEffect(() => {
		if (!round) return;
		cancelAnimationFrame(animRef.current);
		const tick = () => {
			api.crashStatus().then((s) => {
				if (!s) return;
				setCurrent(s.current);
				if (s.current >= s.bustMultiplier || s.settled) return;
				animRef.current = requestAnimationFrame(tick);
			});
		};
		animRef.current = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(animRef.current);
	}, [round]);

	async function startRound() {
		try {
			const r = await api.crashStart({ bet_skin_id: skinId, bet_quantity: qty });
			setRound(r); setCurrent(1.0);
		} catch (e) {
			toasts.add({ type: 'error', title: 'Crash', message: e?.response?.data?.error || 'Failed to start' });
		}
	}
	async function cashout() {
		try {
			const res = await api.crashCashout();
			toasts.add({ type: 'success', title: `Cashout x${res.multiplier}`, message: `+${res.payout_value}` });
			setRound(null);
			api.recentGames(20).then(d => setHistory(d.filter(x => x.game_type === 'crash')));
		} catch (e) {
			toasts.add({ type: 'error', title: 'Busted', message: e?.response?.data?.error || 'Lost' });
			setRound(null);
			api.recentGames(20).then(d => setHistory(d.filter(x => x.game_type === 'crash')));
		}
	}

	return (
		<div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 16 }}>
			<section className="panel glass" style={{ overflow: 'hidden' }}>
				<h3>Crash</h3>
				<div className="form-grid" style={{ gridTemplateColumns: '1fr max-content' }}>
					<select value={skinId || ''} onChange={e => setSkinId(Number(e.target.value))}>
						<option value="">Select skin</option>
						{skins.map(s => <option key={s.id} value={s.id}>{s.name} — {s.value}</option>)}
					</select>
					<input type="number" min="1" value={qty} onChange={e => setQty(Number(e.target.value) || 1)} />
				</div>
				<div style={{ marginTop: 14, position: 'relative', height: 180, border: '1px solid #202636', borderRadius: 12, background: '#0d1320', display: 'grid', placeItems: 'center' }}>
					<div style={{ fontSize: 44, fontWeight: 800, background: 'linear-gradient(90deg,var(--accent),var(--accent2))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
						x{current.toFixed(2)}
					</div>
				</div>
				<div className="row" style={{ marginTop: 12 }}>
					<button className="btn primary" disabled={!skinId || !!round} onClick={startRound}>Start</button>
					<button className="btn" disabled={!round} onClick={cashout}>Cashout</button>
				</div>
			</section>
			<section className="panel glass">
				<h3>Recent</h3>
				<CrashSparkline />
				<div className="feed" style={{ marginTop: 10 }}>
					{history.length ? history.map(h => (
						<div key={h.id} className={`feed-row ${h.result}`}>
							<div className="t">x{h.multiplier || '-'}</div>
							<div className="t user">{h.username}</div>
							<div className="t result">{h.result === 'win' ? `+${h.payout_value}` : '—'}</div>
							<div className="t time">{new Date(h.created_at).toLocaleTimeString()}</div>
						</div>
					)) : Array.from({ length: 6 }).map((_,i) => <div key={i} className="feed-row skeleton" />)}
				</div>
			</section>
		</div>
	);
} 