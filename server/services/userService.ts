import bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2';

import { IUser } from '../models/userModel';
import pool from '../config/db';
// Din databasanslutning

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    try {
      const [rows] = await pool.query<IUser[] & RowDataPacket[]>(
        'SELECT * FROM users WHERE email = ?',
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

export const createUser = async (user: Partial<IUser>): Promise<IUser> => {
  const hashedPassword = user.password ? await bcrypt.hash(user.password, 10) : null;
  await pool.query(
    'INSERT INTO users (email, username, password, role,  googleId, githubId) VALUES (?, ?, ?, ?, ?, ?)',
    [
        user.email,
       user.username || null,
        user.password,
        user.role || 'user',
        user.googleId || null,
        user.githubId || null,
      ]
  );

  const newUser = await findUserByEmail(user.email!);
  if (!newUser) throw new Error('User creation failed');
  return newUser;
};



export const findOrCreateUserByGoogle = async (data: {
  email: string;
  username?: string;
  googleId: string;
}): Promise<IUser> => {
  // Kontrollera om användaren redan finns baserat på e-post
  let user = await findUserByEmail(data.email);

  if (!user) {
    // Skapa en ny användare om ingen hittas
    user = await createUser({
      email: data.email,
      googleId: data.googleId,
      role: 'user', // Standardroll för nya användare
    });
  }

  return user;
};
