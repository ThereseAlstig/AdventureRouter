import passport from 'passport';
import express from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/userModel';




const router = express.Router();


const callback = process.env.GOOGLE_REDIRECT_URL || 'https://adventure-router.vercel.app/';
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { session: false }), (req, res) => {
    if (!req.user) {
        res.status(401).send('Unauthorized');
        return;
    }
    const user = req.user as IUser;
    const token = jwt.sign(
        {
            username: user.username,
            email: user.email,
            
        },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' }
    );
   
    res.redirect(`${callback}/github/callback?token=${token}&email=${user.email}&username=${user.username}`);
});


export default router;