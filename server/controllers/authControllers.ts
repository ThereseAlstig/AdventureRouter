import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { findUserByEmail, createUser, verifyPassword } from '../services/userService';
import { RequestHandler } from 'express';



export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    console.log("Password received from frontend:", req.body.password);
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


  
    // Verifiera lösenordet
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log("Password Match:", isMatch); // Förväntat: true
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
    console.log("Email received from frontend:", email);

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return ;
    }

    const user = await findUserByEmail(email.trim());
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return 
    }

    if (!user.password) {
       res.status(401).json({ message: "User has no password set" });
      return
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) {
       res.status(401).json({ message: "Invalid credentials" });
      return
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRATION || "2h" }
    );

    res.status(200).json({
      token,
      email: user.email,
      username: user.username,
      role: user.role,
    });
    return 
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};


export const logoutUser: RequestHandler = (req: Request, res: Response) => {

  res.status(200).json({ message: 'User logged out' });
};

export const getProtectedResource: RequestHandler = (req: Request, res: Response) => {
    res.json({ message: 'This is a protected resource', user: req.user });
  };