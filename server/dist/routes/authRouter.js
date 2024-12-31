"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("../controllers/authControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/register', authControllers_1.registerUser);
router.post('/login', authControllers_1.loginUser);
router.post('/logout', authControllers_1.logoutUser);
router.get('/protected', authMiddleware_1.ensureAuthenticated, (req, res) => {
    res.json({ message: 'Protected route accessed', user: req.user });
});
router.get('/protected-resource', authMiddleware_1.verifyToken, (req, res) => {
    res.status(200).json({
        message: 'Access granted to protected resource',
        user: req.user,
    });
});
router.post('/password-reset', authControllers_1.requestPasswordReset);
router.post('/password-reset/confirm', authMiddleware_1.verifyToken, authControllers_1.resetPassword);
exports.default = router;
