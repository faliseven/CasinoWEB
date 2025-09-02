import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import LoginPage from './LoginPage.jsx';
import LobbyPage from './LobbyPage.jsx';
import InventoryPage from './InventoryPage.jsx';
import AdminPage from './AdminPage.jsx';
import NavBar from '../components/NavBar.jsx';
import Hero from '../components/Hero.jsx';
import GameTiles from '../components/GameTiles.jsx';
import TabsBar from '../components/TabsBar.jsx';
import BannerCarousel from '../components/BannerCarousel.jsx';

export default function App() {
	const [me, setMe] = useState(null);
	useEffect(() => {
		api.me().then(setMe);
	}, []);

	async function handleLogout() {
		await api.logout();
		setMe(null);
	}

	return (
		<div className="app">
			<NavBar me={me} onLogout={handleLogout} />
			<main>
				<Routes>
					<Route path="/" element={<>
						<TabsBar />
						<BannerCarousel />
						<Hero />
						<LobbyPage me={me} />
						<GameTiles />
					</>} />
					<Route path="/login" element={me ? <Navigate to="/" /> : <LoginPage onLogin={setMe} />} />
					<Route path="/inventory" element={me ? <InventoryPage /> : <Navigate to="/login" />} />
					<Route path="/admin" element={me?.is_admin ? <AdminPage /> : <Navigate to="/" />} />
				</Routes>
			</main>
		</div>
	);
} 