"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
const callback = process.env.GOOGLE_REDIRECT_URL || 'https://adventure-router.vercel.app/';
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { session: false }), (req, res) => {
    console.log('User authenticated:', req.user);
    // Omdirigera användaren till frontend
    res.redirect(callback); // Ändra till din frontend-URL
});
exports.default = router;
