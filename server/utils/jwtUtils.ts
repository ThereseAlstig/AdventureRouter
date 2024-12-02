import jwt from 'jsonwebtoken';
import { IUser } from '../models/userModel';

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const generateToken = (user: IUser): string => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string): IUser | null => {
  try {
    return jwt.verify(token, SECRET) as IUser;
  } catch {
    return null;
  }
};
