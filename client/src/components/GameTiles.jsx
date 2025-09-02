import { useNavigate } from 'react-router-dom';

export default function GameTiles() {
	const navigate = useNavigate();
	return (
		<section id="games" className="game-tiles">
			<h2>Games</h2>
			<div className="tiles">
				<div className="tile active" onClick={() => navigate('/') }>
					<div className="thumb" style={{ backgroundImage: 'url(/art/double.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
					<div className="title">Coinflip</div>
					<div className="desc">50/50 chance. Bet skins, win double.</div>
				</div>
				<div className="tile soon">
					<div className="thumb" style={{ backgroundImage: 'url(/art/crash.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
					<div className="title">Crash</div>
					<div className="desc">Coming soon</div>
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