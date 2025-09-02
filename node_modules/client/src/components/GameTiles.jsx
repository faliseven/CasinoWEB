import { useNavigate } from 'react-router-dom';

export default function GameTiles() {
	const navigate = useNavigate();
	return (
		<section id="games" className="game-tiles">
			<h2>Games</h2>
			<div className="tiles">
				<div className="tile active" onClick={() => navigate('/double') }>
					<div className="thumb" style={{ backgroundImage: 'url(/art/double.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
					<div className="title">Double</div>
					<div className="desc">Pick red/black/green. x2 or x14!</div>
				</div>
				<div className="tile active" onClick={() => navigate('/crash') }>
					<div className="thumb" style={{ backgroundImage: 'url(/art/crash.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
					<div className="title">Crash</div>
					<div className="desc">Cash out before it busts.</div>
				</div>
				<div className="tile soon">
					<div className="thumb" style={{ backgroundImage: 'url(/art/jackrun.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
					<div className="title">Jackrun</div>
					<div className="desc">Coming soon</div>
				</div>
			</div>
		</section>
	);
} 