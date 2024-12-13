import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';



export const ensureAuthenticated: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
 res.status(401).json({ message: 'Access denied, malformed token' });   
 return; 
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET || '5498746513215468dfg646541654AE46546';

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Spara användardata i request-objektet
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      // Token har gått ut
      res.status(401).json({ message: 'Token expired' });
      return; 
    } else {
      // Ogiltig token eller annat fel
      res.status(403).json({ message: 'Invalid token' });
      return; 
    }
  }
};


export const verifyToken: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Hämta token från "Authorization" header

  if (!token) {
    res.status(401).json({ message: 'Access Denied: No Token Provided' });
    return 
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!); 
    req.user = decoded; 
    next(); 
  } catch (err) {
    res.status(401).json({ message: 'Invalid or Expired Token' });
  }
};