import { IUser } from '../models/userModel'; // Importera din IUser-typ
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Egenskapen 'user' som du vill använda
    }
  }
}

export const requireRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return 
      }
  
      if (req.user.role !== role) {
        return res.status(403).json({ message: 'Access denied, insufficient permissions' });
      }
  
      next();
    };
  };
  