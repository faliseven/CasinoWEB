import { useEffect, useRef, useState } from 'react';
import { api } from '../services/api.js';

export default function CrashSparkline() {
	const canvasRef = useRef(null);
	const [data, setData] = useState([]);
	useEffect(() => {
		let alive = true;
		const load = () => api.recentGames(40).then(r => {
			if (!alive) return;
			const xs = r.filter(x => x.game_type === 'crash' && x.multiplier).slice(0, 30).map(x => Number(x.multiplier));
			setData(xs);
		});
		load();
		const id = setInterval(load, 8000);
		return () => { alive = false; clearInterval(id); };
	}, []);
	useEffect(() => {
		const c = canvasRef.current; if (!c) return;
		const ctx = c.getContext('2d');
		const DPR = Math.min(2, window.devicePixelRatio || 1);
		const w = c.clientWidth * DPR, h = c.clientHeight * DPR; c.width = w; c.height = h;
		ctx.clearRect(0,0,w,h);
		ctx.lineWidth = 2 * DPR;
		ctx.strokeStyle = '#6c9ef8';
		const vals = data.length ? data : [1,1.2,1.1,1.5,1.3,1.8,1.2];
		const max = Math.max(2, ...vals);
		const min = 1.0;
		const pad = 8 * DPR;
		ctx.beginPath();
		vals.forEach((v, i) => {
			const x = pad + (i/(vals.length-1||1)) * (w - pad*2);
			const y = h - pad - ((v-min)/(max-min||1)) * (h - pad*2);
			i ? ctx.lineTo(x,y) : ctx.moveTo(x,y);
		});
		ctx.stroke();
	}, [data]);
	return (
		<div className="sparkline">
			<canvas ref={canvasRef} className="spark-canvas" />
		</div>
	);
} 