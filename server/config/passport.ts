import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';

import passport from 'passport';
import {  findOrCreateUserByGoogle } from '../services/userService';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();


passport.use(
   
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: 'http://localhost:3000/user/google/callback',
      },
     
        
        
          async (accessToken, refreshToken, profile, done) => {
            try {  
              
           
              console.log('Google profile received:', profile); // Logga hela profilen
              console.log('Google email:', profile.emails?.[0]?.value);
      
              const email = profile.emails?.[0]?.value || '';
              let user = await findOrCreateUserByGoogle({
                email,
                username: profile.displayName,
                googleId: profile.id,
              });

              const token = jwt.sign(
                {
                  id: user.id,
                  email: user.email,
                  role: user.role,
                },
                process.env.JWT_SECRET || 'your_jwt_secret', // Hämta från miljövariabler
                { expiresIn: '1h' } // Token gäller i 1 timme
              );
      
              console.log('Generated Token:', token); // Logga token för debugging
      
              console.log('User after findOrCreate:', user); // Logga användarens data
              done(null, user);
            } catch (error) {
              console.error('Error in GoogleStrategy:', error);
              done(error);
            }
      }
    )
  );
  