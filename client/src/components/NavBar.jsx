import { Link } from 'react-router-dom';

export default function NavBar({ me, onLogout }) {
	return (
		<header className="topbar fancy">
			<div className="left">
				<Link to="/" className="brand logo">
					<img src="/logo.svg" alt="logo" />
					<span>RUN</span>
				</Link>
				<nav className="primary">
					<Link to="/">Games</Link>
					<Link to="/inventory">Inventory</Link>
					{me?.is_admin && <Link to="/admin">Admin</Link>}
				</nav>
			</div>
			<div className="right">
				{me ? (
					<div className="user">
						<span className="chip">{me.username}</span>
						<button className="btn" onClick={onLogout}>Logout</button>
					</div>
				) : (
					<Link to="/login" className="btn primary">Login</Link>
				)}
			</div>
		</header>
	);
} 