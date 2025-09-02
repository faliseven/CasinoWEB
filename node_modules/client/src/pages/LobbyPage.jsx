import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useToasts } from '../components/ToastProvider.jsx';

export default function LobbyPage({ me }) {
	const [skins, setSkins] = useState([]);
	const [selectedSkinId, setSelectedSkinId] = useState(null);
	const [qty, setQty] = useState(1);
	const [result, setResult] = useState(null);
	const [error, setError] = useState('');
	const toasts = useToasts();

	useEffect(() => {
		api.getSkins().then((s) => {
			setSkins(s);
			if (s.length === 0) {
				toasts.add({ type: 'info', title: 'No skins available', message: 'Create some skins in Admin first.' });
			}
		});
	}, []);

	async function playCoinflip() {
		setError('');
		setResult(null);
		if (!me) {
			toasts.add({ type: 'warning', title: 'Login required', message: 'Please login to play.' });
			return;
		}
		if (!selectedSkinId) {
			toasts.add({ type: 'warning', title: 'Select a skin', message: 'Choose a skin to bet.' });
			return;
		}
		try {
			const response = await api.coinflip({ bet_skin_id: selectedSkinId, bet_quantity: qty });
			setResult(response);
			toasts.add({ type: response.result === 'win' ? 'success' : 'error', title: `You ${response.result}!`, message: response.payout_value ? `Payout ${response.payout_value}` : 'Better luck next time' });
		} catch (e) {
			const msg = e?.response?.data?.error || 'Failed';
			setError(msg);
			toasts.add({ type: 'error', title: 'Error', message: msg });
		}
	}

	return (
		<section className="panel coinflip-card">
			<h3>Coinflip</h3>
			<div className="form-grid">
				<select value={selectedSkinId || ''} onChange={e => setSelectedSkinId(Number(e.target.value))}>
					<option value="">Select skin</option>
					{skins.map(s => (
						<option key={s.id} value={s.id}>{s.name} — {s.value}</option>
					))}
				</select>
				<input type="number" min="1" value={qty} onChange={e => setQty(Number(e.target.value) || 1)} />
				<button className="btn primary" disabled={!me || !selectedSkinId} onClick={playCoinflip}>Play</button>
			</div>
			{error && <div className="error">{error}</div>}
			{result && <div className={`result ${result.result}`}>Result: {result.result} {result.payout_value ? `(+${result.payout_value})` : ''}</div>}
		</section>
	);
} 