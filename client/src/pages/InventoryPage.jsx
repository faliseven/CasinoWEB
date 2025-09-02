import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useToasts } from '../components/ToastProvider.jsx';

export default function InventoryPage() {
	const [items, setItems] = useState([]);
	const toasts = useToasts();
	useEffect(() => {
		api.getMyInventory().then((res) => {
			setItems(res);
			if (!res || res.length === 0) {
				toasts.add({ type: 'info', title: 'Inventory is empty', message: 'Ask admin to grant you some skins.' });
			}
		});
	}, []);

	if (!items || items.length === 0) {
		return (
			<div>
				<h2>My Inventory</h2>
				<div className="panel" style={{ textAlign: 'center' }}>
					<p style={{ color: 'var(--muted)' }}>No items yet.</p>
					<p style={{ color: 'var(--muted)' }}>Go to Admin (if available) to grant yourself skins, or ask an admin user.</p>
				</div>
			</div>
		);
	}

	return (
		<div>
			<h2>My Inventory</h2>
			<div className="grid">
				{items.map(it => (
					<div className="card" key={it.id}>
						<img src={`/skins/${it.image}`} alt={it.name} />
						<div className="meta">
							<div className="title">{it.name}</div>
							<div className="sub">Value: {it.value} • Qty: {it.quantity}</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
} 