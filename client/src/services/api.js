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
	}
}; 