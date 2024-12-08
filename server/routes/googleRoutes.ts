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

    const isProduction = process.env.NODE_ENV === 'true';
    // Omdirigera användaren till frontend
    res.cookie('authToken', token, {
        httpOnly: true, // Gör cookien otillgänglig för JavaScript
        secure: isProduction,
        path: '/', // Använd bara över HTTPS
        
      
    });

    res.cookie('userEmail', user.email, {
        httpOnly: true, // Gör cookien otillgänglig för JavaScript
        secure: true, // Använd bara över HTTPS
        path: '/', // Använd bara över HTTPS
      
       
    });
    res.redirect(callback); // Ändra till din frontend-URL
});



export default router;
