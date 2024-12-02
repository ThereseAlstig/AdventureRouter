import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const googleAuthCallback = async (req: Request, res: Response) => {
  const user = req.user as any;

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });

  res.status(200).json({ token, user });
};
