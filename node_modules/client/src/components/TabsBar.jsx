import { Link, useLocation } from 'react-router-dom';

const tabs = [
	{ key: 'crash', label: 'CRASH', to: '/', icon: '/icons/crash.svg' },
	{ key: 'double', label: 'DOUBLE', to: '/', icon: '/icons/double.svg' },
	{ key: 'jackrun', label: 'JACKRUN', to: '/', icon: '/icons/jackrun.svg' },
	{ key: 'rollrun', label: 'ROLLRUN', to: '/', icon: '/icons/roulette.svg' },
	{ key: 'cases', label: 'КЕЙСЫ', to: '/', icon: '/icons/roulette.svg' },
	{ key: 'casebattle', label: 'КЕЙСБАТЛ', to: '/', icon: '/icons/roulette.svg' }
];

export default function TabsBar() {
	const { pathname } = useLocation();
	return (
		<div className="tabsbar">
			{tabs.map(t => (
				<Link key={t.key} to={t.to} className={`tab ${pathname === t.to ? 'active' : ''}`}>
					<span className="tab-icon"><img src={t.icon} alt="" width={24} height={24} /></span>
					<span>{t.label}</span>
				</Link>
			))}
		</div>
	);
} 