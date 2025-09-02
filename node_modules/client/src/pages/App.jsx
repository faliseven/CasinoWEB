import { Routes, Route, Navigate, Link } from 'react-router-dom';
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
import CrashPage from './CrashPage.jsx';
import DoublePage from './DoublePage.jsx';
import RouteFade from '../components/RouteFade.jsx';
import Particles from '../components/Particles.jsx';
import LiveFeed from '../components/LiveFeed.jsx';
import Leaderboard from '../components/Leaderboard.jsx';
import KPICards from '../components/KPICards.jsx';
import SideInfo from '../components/SideInfo.jsx';
import LiveFeedFilters from '../components/LiveFeedFilters.jsx';

export default function App() {
	const [me, setMe] = useState(null);
	const [filters, setFilters] = useState({ types: { crash: true, double: true }, results: { win: true, lose: true } });
	useEffect(() => {
		api.me().then(setMe);
	}, []);

	async function handleLogout() {
		await api.logout();
		setMe(null);
	}

	return (
		<div className="app">
			<Particles />
			<NavBar me={me} onLogout={handleLogout} />
			<main>
				<RouteFade>
					<Routes>
						<Route path="/" element={<>
							<div className="layout">
								<div className="side">
									<LiveFeedFilters value={filters} onChange={setFilters} />
								</div>
								<div>
									<TabsBar />
									<BannerCarousel />
									<Hero />
									<LobbyPage me={me} />
									<GameTiles />
									<KPICards />
									<div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
										<LiveFeed filters={filters} />
										<Leaderboard />
									</div>
								</div>
								<SideInfo />
							</div>
						</>} />
						<Route path="/crash" element={me ? <CrashPage /> : <Navigate to="/login" />} />
						<Route path="/double" element={me ? <DoublePage /> : <Navigate to="/login" />} />
						<Route path="/login" element={me ? <Navigate to="/" /> : <LoginPage onLogin={setMe} />} />
						<Route path="/inventory" element={me ? <InventoryPage /> : <Navigate to="/login" />} />
						<Route path="/admin" element={me?.is_admin ? <AdminPage /> : <Navigate to="/" />} />
					</Routes>
				</RouteFade>
			</main>
		</div>
	);
} 