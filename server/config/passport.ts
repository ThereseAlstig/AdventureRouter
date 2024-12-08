import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import passport from 'passport';
import {  findOrCreateUserByGithub, findOrCreateUserByGoogle, findUserByEmail} from '../services/userService';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();


passport.use(
   
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
      },
     
        
        
          async (accessToken, refreshToken, profile, done) => {
            try {  
              
           
              console.log('Google profile received:', profile); // Logga hela profilen
              console.log('Google email:', profile.emails?.[0]?.value);
      
              
              let user = await findOrCreateUserByGoogle({
                email: profile.emails?.[0]?.value || '',
                username: profile.displayName,
                googleId: profile.id,
              });

      
      
             // Logga användarens data
              done(null, user);
            } catch (error) {
              console.error('Error in GoogleStrategy:', error);
              done(error);
            }
      }
    )
  );
  
  passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
            callbackURL: process.env.GITHUB_CALLBACK_URL || '',
        },
        async (profile: any, done:any) => {
            try {
              const user = await findOrCreateUserByGithub({
               
                email: profile.emails?.[0]?.value || '',
            });

            // Skicka användaren till req.user
            done(null, {
                id: user.id,
                email: user.email,
                
            });
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.serializeUser((user: any, done) => done(null, user.email));
passport.deserializeUser(async (email, done) => {
    try {
        const user = await findUserByEmail(email as string); // Implementera denna funktion
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;