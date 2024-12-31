import bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2';
import { IUser } from '../models/userModel';
import pool from '../config/db';
import mailgun from "mailgun-js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
// Din databasanslutning

//verifiera lösenord 
export const verifyPassword = async (inputPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    try {
      const [rows] = await pool.query<IUser[] & RowDataPacket[]>(
        'SELECT id, email, username, password, role FROM users WHERE email = ?',
        [email]
      );
  
      if (rows.length === 0) {
        return null; // Ingen användare hittades
      }
  
      return rows[0]; // Returnera den första användaren
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Database query failed');
    }
  };


  //Skapar användare
  export const createUser = async (user: Partial<IUser>): Promise<IUser> => {
    const { email, username, password, role } = user;

    // Hantera lösenord
    let hashedPassword = null;
 

    // Skapa användaren i databasen
    await pool.query(
        'INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, ?)',
        [email, username || email!.split('@')[0], password, role || 'user']
    );

    const newUser = await findUserByEmail(email!);
    if (!newUser) {
        throw new Error('User creation failed');
    }

    return newUser;
};



//Skapa användare med Google
export const findOrCreateUserByGoogle = async (data: {
  email: string;
  username?: string;
}): Promise<IUser> => {
  // Kontrollera om användaren redan finns baserat på e-post
  let user = await findUserByEmail(data.email);

  if (!user) {
    // Skapa en ny användare om ingen hittas
    user = await createUser({
      email: data.email,
      role: 'user',
      username: data.username, // Standardroll för nya användare
    });
  }

  return user;
};
export const findOrCreateUserByGithub = async (data: {
  email: string;
  username?: string;
}): Promise<IUser> => {
  // Kontrollera om användaren redan finns baserat på e-post
  let user = await findUserByEmail(data.email);

  if (!user) {
    // Skapa en ny användare om ingen hittas
    user = await createUser({
      username: data.username,
      email: data.email,
      role: 'user', // Standardroll för nya användare
    });
  }

  return user;
  
  
};

//Uppdaatera lösenordet

export const updateUserPassword = async (userId: number, hashedPassword: string) => {
  console.log("userId:", userId);
  await pool.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, userId]
  );
};

//Mailgun Skicka mail


export const sendEmail = async (to: string, subject: string, html: string) => {
  const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY!,
  domain: process.env.MAILGUN_DOMAIN!,
});
const DOMAIN = process.env.MAILGUN_DOMAIN;

  const data = {
      from: `<no-reply@${DOMAIN}>`, // Avsändaradress
      to, 
      subject, 
      html, 
  };

  try {
    console.log("Skickar e-post...");
      // Skicka e-post via Mailgun
      await mg.messages().send(data);
      console.log("E-post skickad!");
  } catch (error) {
      console.error("Fel vid e-postskick:", error);
      throw new Error("Kunde inte skicka e-post");
  }
};

