import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteFade({ children }) {
	const { pathname } = useLocation();
	const ref = useRef(null);

	useEffect(() => {
		if (!ref.current) return;
		const el = ref.current;
		// restart animation
		el.classList.remove('page-fade');
		// force reflow
		void el.offsetWidth;
		el.classList.add('page-fade');
	}, [pathname]);

	return (
		<div ref={ref} className="route-fade page-fade">
			{children}
		</div>
	);
} 