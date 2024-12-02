import express from 'express';
import passport from 'passport';
import { googleAuthCallback } from '../controllers/googleController';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    console.log('User authenticated:', req.user);

    // Omdirigera användaren till frontend
    res.redirect('http://localhost:5173/my-page'); // Ändra till din frontend-URL
});

export default router;
