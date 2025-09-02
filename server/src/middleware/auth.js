import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
	const token = req.cookies['token'];
	if (!token) return res.status(401).json({ error: 'Unauthorized' });
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
		req.user = payload;
		next();
	} catch (e) {
		return res.status(401).json({ error: 'Invalid token' });
	}
}

export function requireAdmin(req, res, next) {
	if (!req.user?.is_admin) return res.status(403).json({ error: 'Forbidden' });
	next();
} 