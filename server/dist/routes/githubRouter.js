"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const callback = process.env.GOOGLE_REDIRECT_URL || 'https://adventure-router.vercel.app/';
router.get('/github', passport_1.default.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport_1.default.authenticate('github', { session: false }), (req, res) => {
    if (!req.user) {
        res.status(401).send('Unauthorized');
        return;
    }
    const user = req.user;
    const token = jsonwebtoken_1.default.sign({
        username: user.username,
        email: user.email,
    }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    res.redirect(`${callback}/github/callback?token=${token}&email=${user.email}&username=${user.username}`);
});
exports.default = router;
