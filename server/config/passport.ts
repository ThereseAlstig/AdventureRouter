import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2';
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
                
              });
              console.log('User:', user);
              console.log('profile:', profile);
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
            scope: ['user:email'],
        },
        async (accessToken: string,
          refreshToken: string,
          profile: GitHubProfile,
          done: (error: any, user?: any) => void) => {
            try {
              // Typdefinition för email-objekten
              const primaryEmail = profile.emails?.find(
                  (email: { value: string; primary?: boolean }) => email.primary
              )?.value || profile.emails?.[0]?.value;

              const user = await findOrCreateUserByGithub({
                  email: primaryEmail || '',
                  username: profile.username || '',
              });


            // Skicka användaren till req.user
            done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);



export default passport;