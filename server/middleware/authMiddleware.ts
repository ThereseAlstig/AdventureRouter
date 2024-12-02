import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export const ensureAuthenticated: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
     res.status(401).json({ message: 'Access denied, no token provided' });
     return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded; // Lägg till användarinformation i request-objektet
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};
