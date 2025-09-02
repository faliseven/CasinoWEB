import { useState } from 'react';
import { api } from '../services/api.js';
import { useToasts } from '../components/ToastProvider.jsx';

export default function LoginPage({ onLogin }) {
	const [mode, setMode] = useState('login');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [error, setError] = useState('');
	const toasts = useToasts();

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');
		try {
			if (mode === 'register') {
				await api.register({ email, password, username: username || email.split('@')[0] });
				toasts.add({ type: 'success', title: 'Account created', message: 'You can login now.' });
			}
			const me = await api.login({ email, password });
			onLogin(me);
			toasts.add({ type: 'success', title: 'Welcome', message: me.username });
		} catch (e) {
			const msg = e?.response?.data?.error || 'Failed';
			setError(msg);
			toasts.add({ type: 'error', title: 'Error', message: msg });
		}
	}

	return (
		<div className="auth-layout">
			<section className="auth-illustration" />
			<section className="auth-card panel glass">
				<h2 className="title">{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
				<div className="subtitle">Local demo — play with skins, no real money.</div>
				<div className="tabs">
					<button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
					<button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Register</button>
				</div>
				<form onSubmit={handleSubmit} className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
					{mode === 'register' && (
						<input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
					)}
					<input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
					<input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
					<button type="submit" className="btn primary pulse">{mode === 'login' ? 'Login' : 'Create account'}</button>
				</form>
				{error && <div className="error">{error}</div>}
			</section>
		</div>
	);
} 