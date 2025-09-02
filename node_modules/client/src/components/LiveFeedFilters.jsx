import { useState, useEffect } from 'react';

export default function LiveFeedFilters({ value, onChange }) {
	const [types, setTypes] = useState(value?.types || { crash: true, double: true });
	const [results, setResults] = useState(value?.results || { win: true, lose: true });
	useEffect(() => { onChange?.({ types, results }); }, [types, results]);

	function toggle(setter, key) { setter(prev => ({ ...prev, [key]: !prev[key] })); }
	function setAllTypes(val){ setTypes({ crash: val, double: val }); }
	function setAllResults(val){ setResults({ win: val, lose: val }); }

	return (
		<section className="panel glass">
			<h3>Filter feed</h3>
			<div className="filters">
				<div className="group">
					<div className="label">Game</div>
					<div className="chip-row">
						<button className={`chip tag ${types.crash?'active':''}`} onClick={() => toggle(setTypes,'crash')}>Crash</button>
						<button className={`chip tag ${types.double?'active':''}`} onClick={() => toggle(setTypes,'double')}>Double</button>
					</div>
					<div className="chip-row">
						<button className="chip" onClick={() => setAllTypes(true)}>All</button>
						<button className="chip" onClick={() => setAllTypes(false)}>None</button>
					</div>
				</div>
				<div className="group">
					<div className="label">Result</div>
					<div className="chip-row">
						<button className={`chip tag ${results.win?'active':''}`} onClick={() => toggle(setResults,'win')}>Win</button>
						<button className={`chip tag ${results.lose?'active':''}`} onClick={() => toggle(setResults,'lose')}>Lose</button>
					</div>
					<div className="chip-row">
						<button className="chip" onClick={() => setAllResults(true)}>All</button>
						<button className="chip" onClick={() => setAllResults(false)}>None</button>
					</div>
				</div>
			</div>
		</section>
	);
} 