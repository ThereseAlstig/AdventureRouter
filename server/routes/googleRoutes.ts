import express from 'express';
import passport from 'passport';
import { googleAuthCallback } from '../controllers/googleController';

const router = express.Router();

const callback = process.env.GOOGLE_REDIRECT_URL || 'https://adventure-router.vercel.app/';

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    console.log('User authenticated:', req.user);

    // Omdirigera användaren till frontend
    res.redirect(callback); // Ändra till din frontend-URL
});



export default router;
