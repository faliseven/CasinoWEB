import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

export default function SideInfo() {
	const [items, setItems] = useState([]);
	useEffect(() => { api.getMyInventory().then(setItems).catch(() => setItems([])); }, []);
	const top = items.slice(0,3);
	return (
		<div className="side">
			<section className="panel glass">
				<h3>Quick balance</h3>
				<div className="grid" style={{ gridTemplateColumns: '1fr', gap: 8 }}>
					{top.length ? top.map(i => (
						<div key={i.id} className="card" style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 10 }}>
							<img src={`/skins/${i.image}`} alt="" style={{ width: 42, height: 42, objectFit: 'contain' }} />
							<div>
								<div className="title">{i.name}</div>
								<div className="sub">Value {i.value} • Qty {i.quantity}</div>
							</div>
						</div>
					)) : <div className="sub" style={{ color: 'var(--muted)' }}>No items yet</div>}
				</div>
			</section>
			<section className="panel glass">
				<h3>Quick actions</h3>
				<div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
					<a className="btn" href="/inventory">Inventory</a>
					<a className="btn" href="/double">Play Double</a>
					<a className="btn" href="/crash">Play Crash</a>
				</div>
			</section>
			<section className="panel glass">
				<h3>Tips</h3>
				<ul style={{ margin: 0, paddingLeft: 16, color: 'var(--muted)' }}>
					<li>Use Admin to create skins and grant to your account</li>
					<li>Crash: set an auto cashout target to reduce risk</li>
					<li>Double: green is rare but pays x14</li>
				</ul>
			</section>
		</div>
	);
} 