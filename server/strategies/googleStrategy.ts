import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { findUserByEmail , findOrCreateUserByGoogle,  createUser } from '../services/userService';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || `${profile.id}@google.com`;
        const user = await findOrCreateUserByGoogle({
          email,
          username: profile.displayName,
          
        });
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);


