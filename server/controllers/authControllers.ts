import bcrypt, { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { findUserByEmail, createUser, verifyPassword, sendEmail, updateUserPassword } from '../services/userService';
import { RequestHandler } from 'express';
import { IUser } from '../models/userModel';


//registrerar användare och kollar om användaren redan finns
export const registerUser: RequestHandler = async (req, res, next) => {
  try {
      const { email, password, username} = req.body;

      if (!email) {
          res.status(400).json({ message: 'Email is required' });
          return;
      }

      const existingUser = await findUserByEmail(email);
      if (existingUser) {
          res.status(400).json({ message: 'User already exists' });
          return;
      }

      
      // För traditionell registrering (lösenord krävs)
      if (!password) {
          res.status(400).json({ message: 'Password is required for this registration method' });
          return;
      }

      const hashedPassword = await bcrypt.hash(password.trim(), 10);
      
      const user = await createUser({
          email,
          password: hashedPassword,
          username: username || email.split('@')[0],
      });

      res.status(201).json({
          message: 'User registered successfully',
          user: {
              id: user.id,
              email: user.email,
              username: user.username,
              role: user.role,
          },
      });
  } catch (error) {
      next(error);
  }
};


//Loggar in användare och skapar en token för att verifiera att man är inloggad, är giltig 2h sen blir man utloggad
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

//utloggning
export const logoutUser: RequestHandler = (req: Request, res: Response) => {

  res.status(200).json({ message: 'User logged out' });
};

export const getProtectedResource: RequestHandler = (req: Request, res: Response) => {
    res.json({ message: 'This is a protected resource', user: req.user });
  };

  // Begära nytt lösenord reset

  export const requestPasswordReset = async (req: Request, res: Response) => {
    const { email } = req.body;

    // Hitta användare baserat på e-post
    const user = await findUserByEmail(email);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return 
    }

    // Skapa token för lösenordsåterställning
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRATION || "2h" }
    );

    const frontendUrl = process.env.GOOGLE_REDIRECT_URL|| 'http://localhost:3000';
    // Skicka e-post med återställningslänk
    const resetLink = `${frontendUrl}/reset-password/${token}`;
    await sendEmail(
        user.email,
        "Password Reset",
        `<p>Click the link below to reset your password:</p>
         <a href="${resetLink}">${resetLink}</a>`
    );

    res.json({ message: "Password reset email sent" });
};


// Återställa lösenord
export const resetPassword = async (req: Request, res: Response) => {
  const {newPassword} = req.body;
  const user = req.user as IUser;
  const userId = user?.id;
  console.log("userId:", userId);

  if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
  }
  try {
     

      // Hashera och uppdatera lösenord
      const hashedPassword = await hash(newPassword, 10);
      await updateUserPassword(userId, hashedPassword);

      res.json({ message: 'Password reset successful' });
  } catch (err) {
      res.status(401).json({ message: 'Invalid or expired token' });
  }
};