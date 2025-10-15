import jwt from 'jsonwebtoken';

export const generateToken = (payload: { id: number; role: 'admin' | 'analyst' }) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

