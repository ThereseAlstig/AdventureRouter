// // services/authService.ts
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { IUser } from '../models/userModel';
// import { createUser, findUserByEmail } from './userService';

// const JWT_SECRET = 'your_jwt_secret';  // Sätt denna i en miljövariabel för säkerhet i produktion

// // Skapa JWT-token
// const generateToken = (user: IUser): string => {
//     return jwt.sign({ email: user.email, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
// };

// // Login eller registrera användare
// // export const registerOrLogin = async (email: string, username: string, password: string, role: string): Promise<{ token: string, user: IUser }> => {
// //     let user = findUserByEmail(email);

// //     if (user) {
// //         // Om användaren finns, kontrollera lösenordet
// //         const isMatch = await bcrypt.compare(password, user.password);
// //         if (!isMatch) throw new Error('Invalid credentials');
// //     } else {
// //         // Om användaren inte finns, skapa en ny användare
// //         user = createUser(email, username, await bcrypt.hash(password, 10), role);
// //     }

// //     // Generera och returnera JWT-token
// //     const token = generateToken(user);
// //     return { token, user };
// // };
