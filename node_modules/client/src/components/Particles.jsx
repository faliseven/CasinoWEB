import { useEffect, useRef } from 'react';

export default function Particles() {
	const canvasRef = useRef(null);
	useEffect(() => {
		const c = canvasRef.current;
		if (!c) return;
		const ctx = c.getContext('2d');
		let raf; let running = true;
		const DPR = Math.min(2, window.devicePixelRatio || 1);
		const resize = () => {
			c.width = c.clientWidth * DPR;
			c.height = c.clientHeight * DPR;
		};
		const particles = Array.from({ length: 28 }, () => ({
			x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * .0008, vy: (Math.random() - .5) * .0008
		}));
		const tick = () => {
			if (!running) return;
			ctx.clearRect(0, 0, c.width, c.height);
			ctx.lineWidth = 1 * DPR; ctx.globalAlpha = 0.6;
			for (const p of particles) {
				p.x += p.vx; p.y += p.vy;
				if (p.x < 0 || p.x > 1) p.vx *= -1;
				if (p.y < 0 || p.y > 1) p.vy *= -1;
				const x = p.x * c.width; const y = p.y * c.height;
				ctx.strokeStyle = '#233a6a';
				ctx.beginPath(); ctx.arc(x, y, 12 * DPR, 0, Math.PI * 2); ctx.stroke();
				ctx.fillStyle = '#6c9ef81a'; ctx.beginPath(); ctx.arc(x, y, 3 * DPR, 0, Math.PI * 2); ctx.fill();
			}
			raf = requestAnimationFrame(tick);
		};
		resize();
		window.addEventListener('resize', resize);
		running = true; raf = requestAnimationFrame(tick);
		return () => { running = false; cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
	}, []);
	return <canvas ref={canvasRef} className="particles" />;
} 