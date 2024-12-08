import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { findUserByEmail, createUser } from '../services/userService';
import { RequestHandler } from 'express';



export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return; // Avsluta funktionen här för att undvika fortsatt exekvering
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({ email, password: hashedPassword, username: username || email.split('@')[0], });
    // Logik för att hantera registrering
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    next(error); // Vid fel, skicka vidare till Express error-handler
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return; // Avsluta här
      }
  
      const user = await findUserByEmail(email);
      if (!user || !user.password) {
        res.status(401).json({ message: 'Invalid credentials' });
        return; // Avsluta här
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ message: 'Invalid credentials' });
        return; // Avsluta här
      }
  
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role  }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      });
     
      res.status(200).json({ token, email:user.email, username: user.username, role: user.role });
    } catch (error) {
      next(error); // Skicka vidare fel till Express error-handler
    }
  };


export const logoutUser: RequestHandler = (req: Request, res: Response) => {

  const isProduction = process.env.NODE_ENV === 'production';

res.clearCookie('authToken', {
    httpOnly: true,
    secure: isProduction,

});

console.log('Cleared authToken cookie');

res.clearCookie('userEmail', {
    secure: isProduction,
   
});

console.log('Cleared userEmail cookie');


  res.status(200).json({ message: 'User logged out' });
};

export const getProtectedResource: RequestHandler = (req: Request, res: Response) => {
    res.json({ message: 'This is a protected resource', user: req.user });
  };