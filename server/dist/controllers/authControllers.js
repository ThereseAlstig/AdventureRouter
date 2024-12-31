"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = exports.getProtectedResource = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importStar(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = require("../services/userService");
//registrerar användare och kollar om användaren redan finns
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username } = req.body;
        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }
        const existingUser = yield (0, userService_1.findUserByEmail)(email);
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        // För traditionell registrering (lösenord krävs)
        if (!password) {
            res.status(400).json({ message: 'Password is required for this registration method' });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password.trim(), 10);
        const user = yield (0, userService_1.createUser)({
            email,
            password: hashedPassword,
            username: username || email.split('@')[0],
        });
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.registerUser = registerUser;
//Loggar in användare och skapar en token för att verifiera att man är inloggad, är giltig 2h sen blir man utloggad
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log("Email received from frontend:", email);
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const user = yield (0, userService_1.findUserByEmail)(email.trim());
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        if (!user.password) {
            res.status(401).json({ message: "User has no password set" });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password.trim(), user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || "2h" });
        res.status(200).json({
            token,
            email: user.email,
            username: user.username,
            role: user.role,
        });
        return;
    }
    catch (error) {
        console.error("Login error:", error);
        next(error);
    }
});
exports.loginUser = loginUser;
//utloggning
const logoutUser = (req, res) => {
    res.status(200).json({ message: 'User logged out' });
};
exports.logoutUser = logoutUser;
const getProtectedResource = (req, res) => {
    res.json({ message: 'This is a protected resource', user: req.user });
};
exports.getProtectedResource = getProtectedResource;
// Begära nytt lösenord reset
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    // Hitta användare baserat på e-post
    const user = yield (0, userService_1.findUserByEmail)(email);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    // Skapa token för lösenordsåterställning
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || "2h" });
    const frontendUrl = process.env.GOOGLE_REDIRECT_URL || 'http://localhost:3000';
    // Skicka e-post med återställningslänk
    const resetLink = `${frontendUrl}/reset-password/${token}`;
    yield (0, userService_1.sendEmail)(user.email, "Password Reset", `<p>Click the link below to reset your password:</p>
         <a href="${resetLink}">${resetLink}</a>`);
    res.json({ message: "Password reset email sent" });
});
exports.requestPasswordReset = requestPasswordReset;
// Återställa lösenord
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword } = req.body;
    const user = req.user;
    const userId = user === null || user === void 0 ? void 0 : user.id;
    console.log("userId:", userId);
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        // Hashera och uppdatera lösenord
        const hashedPassword = yield (0, bcryptjs_1.hash)(newPassword, 10);
        yield (0, userService_1.updateUserPassword)(userId, hashedPassword);
        res.json({ message: 'Password reset successful' });
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});
exports.resetPassword = resetPassword;
