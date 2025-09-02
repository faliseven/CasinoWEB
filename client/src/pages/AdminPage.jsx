import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useToasts } from '../components/ToastProvider.jsx';

export default function AdminPage() {
	const [skins, setSkins] = useState([]);
	const [form, setForm] = useState({ name: '', image: '', value: 100 });
	const [grant, setGrant] = useState({ user_id: '', skin_id: '', quantity: 1 });
	const [users, setUsers] = useState([]);
	const [query, setQuery] = useState('');
	const [error, setError] = useState('');
	const [ok, setOk] = useState('');
	const toasts = useToasts();

	async function refresh() {
		setSkins(await api.getSkins());
	}
	useEffect(() => { refresh(); }, []);
	useEffect(() => {
		let alive = true;
		api.listUsers(query).then(r => alive && setUsers(r));
		return () => { alive = false; };
	}, [query]);

	async function createSkin(e) {
		e.preventDefault(); setError(''); setOk('');
		try {
			await api.createSkin(form);
			setForm({ name: '', image: '', value: 100 });
			setOk('Skin created');
			toasts.add({ type: 'success', title: 'Skin created', message: 'You can grant it now' });
			refresh();
		} catch (e) { const msg = e?.response?.data?.error || 'Failed'; setError(msg); toasts.add({ type: 'error', title: 'Error', message: msg }); }
	}

	async function grantSkin(e) {
		e.preventDefault(); setError(''); setOk('');
		try {
			await api.grant({ ...grant, user_id: Number(grant.user_id), skin_id: Number(grant.skin_id), quantity: Number(grant.quantity) });
			setOk('Granted');
			toasts.add({ type: 'success', title: 'Granted', message: 'Items added to inventory' });
		} catch (e) { const msg = e?.response?.data?.error || 'Failed'; setError(msg); toasts.add({ type: 'error', title: 'Error', message: msg }); }
	}

	return (
		<div className="admin">
			<h2>Admin</h2>
			<div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 16 }}>
				<div>
					<div className="panel">
						<h3>Create Skin</h3>
						<form onSubmit={createSkin} className="form-grid">
							<input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
							<input placeholder="Image filename (in /skins)" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
							<input type="number" placeholder="Value" value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) || 0 })} />
							<button type="submit" className="btn primary">Create</button>
						</form>
					</div>

					<div className="panel">
						<h3>Grant Skin</h3>
						<form onSubmit={grantSkin} className="form-grid">
							<select value={grant.user_id} onChange={e => setGrant({ ...grant, user_id: e.target.value })}>
								<option value="">Select user</option>
								{users.map(u => <option key={u.id} value={u.id}>{u.username} — {u.email}</option>)}
							</select>
							<select value={grant.skin_id} onChange={e => setGrant({ ...grant, skin_id: e.target.value })}>
								<option value="">Select skin</option>
								{skins.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
							</select>
							<input type="number" placeholder="Quantity" value={grant.quantity} onChange={e => setGrant({ ...grant, quantity: e.target.value })} />
							<button type="submit" className="btn primary">Grant</button>
						</form>
					</div>
				</div>
				<div className="panel">
					<h3>Find user</h3>
					<input placeholder="Search by email or username" value={query} onChange={e => setQuery(e.target.value)} />
					<div className="feed" style={{ marginTop: 10 }}>
						{users.map(u => (
							<div key={u.id} className="feed-row">
								<div className="t user">{u.username}</div>
								<div className="t">{u.email}</div>
								<div className="t">{u.is_admin ? 'admin' : ''}</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{error && <div className="error">{error}</div>}
			{ok && <div className="ok">{ok}</div>}
		</div>
	);
} 