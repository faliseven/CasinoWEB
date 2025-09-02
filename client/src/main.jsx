import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './pages/App.jsx';
import './styles.css';
import { ToastProvider } from './components/ToastProvider.jsx';

createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<BrowserRouter>
			<ToastProvider>
				<App />
			</ToastProvider>
		</BrowserRouter>
	</React.StrictMode>
); 