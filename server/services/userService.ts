import bcrypt from 'bcrypt';
import { RowDataPacket } from 'mysql2';
import { IUser } from '../models/userModel';
import pool from '../config/db';
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

export const createUser = async (user: Partial<IUser>): Promise<IUser> => {
  const existingUser = await findUserByEmail(user.email!);
  if (existingUser) {
      throw new Error('User with this email already exists');
  }
  const trimmedPassword = user.password ? user.password.trim() : '';
  const hashedPassword = user.password ? await bcrypt.hash(trimmedPassword, 10) : null;
  console.log("Generated hash during user creation:", hashedPassword);

  if (!hashedPassword) {
    throw new Error('Password is required for this registration method');
  }
  console.log("Generated hash:", hashedPassword);
  await pool.query(
    'INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, ?)',
    [
        user.email,
        user.username || null,
        hashedPassword,
        user.role || 'user',
      ]
  );

  const newUser = await findUserByEmail(user.email!);
  if (!newUser) throw new Error('User creation failed');
  return newUser;
};



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
