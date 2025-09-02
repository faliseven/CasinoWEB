import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useToasts } from '../components/ToastProvider.jsx';

export default function DoublePage() {
	const [skins, setSkins] = useState([]);
	const [skinId, setSkinId] = useState(null);
	const [qty, setQty] = useState(1);
	const [spin, setSpin] = useState(false);
	const [history, setHistory] = useState([]);
	const toasts = useToasts();

	useEffect(() => { api.getSkins().then(setSkins); }, []);
	useEffect(() => { api.recentGames(20).then(d => setHistory(d.filter(x => x.game_type === 'double'))); }, []);

	async function bet(side) {
		try {
			setSpin(true);
			setTimeout(async () => {
				const res = await api.doubleBet({ bet_skin_id: skinId, bet_quantity: qty, side });
				setSpin(false);
				if (res.result === 'win') toasts.add({ type: 'success', title: `Win ${res.outcome}`, message: `x${res.multiplier} • +${res.payout_value}` });
				else toasts.add({ type: 'error', title: `Lose ${res.outcome}`, message: 'Better luck next time' });
				api.recentGames(20).then(d => setHistory(d.filter(x => x.game_type === 'double')));
			}, 900);
		} catch (e) {
			setSpin(false);
			toasts.add({ type: 'error', title: 'Double', message: e?.response?.data?.error || 'Failed' });
		}
	}

	return (
		<div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 16 }}>
			<section className="panel glass">
				<h3>Double</h3>
				<div className="form-grid" style={{ gridTemplateColumns: '1fr max-content' }}>
					<select value={skinId || ''} onChange={e => setSkinId(Number(e.target.value))}>
						<option value="">Select skin</option>
						{skins.map(s => <option key={s.id} value={s.id}>{s.name} — {s.value}</option>)}
					</select>
					<input type="number" min="1" value={qty} onChange={e => setQty(Number(e.target.value) || 1)} />
				</div>
				<div style={{ marginTop: 12, border: '1px solid #202636', borderRadius: 12, overflow: 'hidden' }}>
					<div className="spinbar" data-spin={spin} />
				</div>
				<div className="row" style={{ gap: 14, marginTop: 12 }}>
					<button className="btn" style={{ borderColor: '#3a2230', background: '#20121a' }} disabled={!skinId} onClick={() => bet('red')}>Bet Red x2</button>
					<button className="btn" style={{ borderColor: '#223a2f', background: '#142019' }} disabled={!skinId} onClick={() => bet('black')}>Bet Black x2</button>
					<button className="btn" style={{ borderColor: '#225338', background: '#0d1f17' }} disabled={!skinId} onClick={() => bet('green')}>Bet Green x14</button>
				</div>
			</section>
			<section className="panel glass">
				<h3>Recent</h3>
				<div className="color-history">
					{history.length ? history.map(h => (
						<span key={h.id} className={`chip color ${h.meta?.includes('green') ? 'green' : (h.meta?.includes('red') ? 'red' : 'black')}`}></span>
					)) : Array.from({ length: 18 }).map((_,i) => <span key={i} className="chip color skeleton" />)}
				</div>
			</section>
		</div>
	);
} 