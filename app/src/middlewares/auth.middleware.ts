
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';

// Interfaz para el payload del token y req.user
interface UserPayload {
  id: string | number;
  role: string;
  [key: string]: any; // Para otros campos opcionales
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

// Middleware de autenticación
export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: 'Encabezado de autorización no proporcionado' });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Formato de autorización inválido. Use "Bearer <token>"' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = verifyToken(token) as UserPayload;
    if (!decoded.id || !decoded.role) {
      return res.status(401).json({ error: 'Token inválido: faltan campos requeridos (id, role)' });
    }

    req.user = decoded;
    next();
  } catch (error: any) {
    console.error('Error en auth:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    return res.status(500).json({ error: 'Error interno al verificar el token' });
  }
};