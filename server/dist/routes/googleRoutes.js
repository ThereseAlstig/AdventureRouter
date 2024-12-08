"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const callback = process.env.GOOGLE_REDIRECT_URL || 'https://adventure-router.vercel.app/';
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { session: false }), (req, res) => {
    console.log('User authenticated:', req.user);
    const user = req.user;
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    const isProduction = process.env.NODE_ENV === 'production';
    // Omdirigera användaren till frontend
    res.cookie('authToken', token, {
        httpOnly: true, // Gör cookien otillgänglig för JavaScript
        secure: isProduction, // Använd bara över HTTPS
    });
    res.cookie('userEmail', user.email, {
        secure: false, // Använd bara över HTTPS
    });
    res.redirect(callback); // Ändra till din frontend-URL
});
exports.default = router;
