import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2';
import passport from 'passport';
import { findUserByEmail, createUser, findOrCreateUserByGoogle } from '../services/userService';


passport.use(
   
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || '772312802467-c2mo9nr0rc5jffjeu4jpq6jt4drpor2u.apps.googleusercontent.com',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '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',
        callbackURL: 'http://localhost:3000/user/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value || ''; 
          let user = await findOrCreateUserByGoogle({
          email,
          username: profile.displayName,
          googleId: profile.id,
        });
          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
  