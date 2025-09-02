import axios from 'axios';

const http = axios.create({ withCredentials: true });

export const api = {
	async register(payload) {
		await http.post('/api/auth/register', payload);
	},
	async login(payload) {
		const { data } = await http.post('/api/auth/login', payload);
		return data;
	},
	async me() {
		const { data } = await http.get('/api/auth/me');
		return data;
	},
	async logout() {
		await http.post('/api/auth/logout');
	},
	async getSkins() {
		const { data } = await http.get('/api/skins');
		return data;
	},
	async createSkin(payload) {
		await http.post('/api/skins', payload);
	},
	async grant(payload) {
		await http.post('/api/inventory/grant', payload);
	},
	async getMyInventory() {
		const { data } = await http.get('/api/inventory/me');
		return data;
	},
	async coinflip(payload) {
		const { data } = await http.post('/api/games/coinflip', payload);
		return data;
	},
	async crashStart(payload) {
		const { data } = await http.post('/api/crash/start', payload);
		return data;
	},
	async crashCashout() {
		const { data } = await http.post('/api/crash/cashout');
		return data;
	},
	async crashStatus() {
		const { data } = await http.get('/api/crash/status');
		return data;
	},
	async doubleBet(payload) {
		const { data } = await http.post('/api/double/bet', payload);
		return data;
	},
	async recentGames(limit = 30) {
		const { data } = await http.get('/api/stats/games/recent', { params: { limit } });
		return data;
	},
	async statsSummary() {
		const { data } = await http.get('/api/stats/summary');
		return data;
	},
	async leaderboard(range = 'today') {
		const { data } = await http.get('/api/stats/leaderboard', { params: { range } });
		return data;
	},
	async listUsers(q = '') {
		const { data } = await http.get('/api/admin/users', { params: { q } });
		return data;
	},
	async setUserAdmin(id, is_admin) {
		const { data } = await http.post(`/api/admin/users/${id}/admin`, { is_admin });
		return data;
	}
}; 