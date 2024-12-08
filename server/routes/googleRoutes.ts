import express from 'express';
import passport from 'passport';
import { googleAuthCallback } from '../controllers/googleController';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/userModel';

const router = express.Router();

const callback = process.env.GOOGLE_REDIRECT_URL || 'https://adventure-router.vercel.app/';

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    console.log('User authenticated:', req.user);
    const user = req.user as IUser;
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' }
    );

    
    res.redirect(`${callback}?token=${token}&email=${user.email}`);// Ändra till din frontend-URL
});



export default router;
