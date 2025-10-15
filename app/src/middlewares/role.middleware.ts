interface User {
  id: string | number;
  role: string;
  // Otros campos que podrían diferir
}
import { Request, Response, NextFunction } from 'express';

// Middleware para verificar si el usuario es administrador
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    if (!req.user.role || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado: se requiere rol de administrador' });
    }
    next();
  } catch (error) {
    console.error('Error en isAdmin:', error);
    return res.status(500).json({ error: 'Error interno al verificar el rol de administrador' });
  }
};

// Middleware para verificar si el usuario es administrador o analista
export const isAnalistaOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    if (!req.user.role || !['admin', 'analista'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Acceso denegado: se requiere rol de administrador o analista' });
    }
    next();
  } catch (error) {
    console.error('Error en isAnalistaOrAdmin:', error);
    return res.status(500).json({ error: 'Error interno al verificar los roles' });
  }
};