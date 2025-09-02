import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

let idSeq = 1;

const iconFor = (type) => {
	switch (type) {
		case 'success': return '/icons/double.svg';
		case 'error': return '/icons/crash.svg';
		case 'warning': return '/icons/jackrun.svg';
		default: return '/icons/roulette.svg';
	}
};

export function ToastProvider({ children }) {
	const [toasts, setToasts] = useState([]);

	const remove = useCallback((id) => {
		setToasts((t) => t.filter(x => x.id !== id));
	}, []);

	const add = useCallback((toast) => {
		const id = idSeq++;
		const t = { id, type: toast.type || 'info', title: toast.title, message: toast.message, duration: toast.duration ?? 3000 };
		setToasts((list) => [...list, t]);
		if (t.duration > 0) {
			setTimeout(() => remove(id), t.duration);
		}
		return id;
	}, [remove]);

	const api = useMemo(() => ({ add, remove }), [add, remove]);

	return (
		<ToastContext.Provider value={api}>
			{children}
			<div className="toast-container">
				{toasts.map(t => (
					<div key={t.id} className={`toast ${t.type}`} onClick={() => remove(t.id)}>
						<div className="toast-row">
							<img src={iconFor(t.type)} alt="" width={20} height={20} />
							<div>
								<div className="toast-title">{t.title}</div>
								{t.message && <div className="toast-message">{t.message}</div>}
							</div>
						</div>
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}

export function useToasts() {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error('useToasts must be used within ToastProvider');
	return ctx;
} 