import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'academic-merit-secret-key';

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    type: string;
  };
}

export const authenticateToken = (req: any, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Token de acesso necessário' });
    return;
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      res.status(403).json({ error: 'Token inválido' });
      return;
    }

    req.user = user as { id: number; email: string; type: string };
    next();
  });
};
