import { useEffect, useMemo, useState } from 'react';

const slides = [
	{ id: 1, title: '6 ЛЕТ CSGORUN', desc: 'RUNPASS, RUN PARTY, CASE и другие бонусы доступны всем!', color: '#1f7cf0', art: '/art/jackrun.svg' },
	{ id: 2, title: 'Лиги', desc: 'Получай призы за активность', color: '#8a5cf6', art: '/art/roulette.svg' },
	{ id: 3, title: 'Бонусы', desc: 'Ежедневные награды и задания', color: '#2ed3a2', art: '/art/double.svg' }
];

export default function BannerCarousel() {
	const [idx, setIdx] = useState(0);
	const current = useMemo(() => slides[idx % slides.length], [idx]);
	useEffect(() => {
		const id = setInterval(() => setIdx(i => (i + 1) % slides.length), 4000);
		return () => clearInterval(id);
	}, []);
	return (
		<section className="banner">
			<div className="banner-card" style={{ ['--accent']: current.color, backgroundImage: `url(${current.art})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
				<div className="banner-title">{current.title}</div>
				<div className="banner-desc">{current.desc}</div>
			</div>
			<div className="dots">
				{slides.map((s, i) => (
					<button key={s.id} className={`dot ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)} aria-label={`slide ${i+1}`} />
				))}
			</div>
		</section>
	);
} 