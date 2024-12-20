"use strict";
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
exports.getProtectedResource = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = require("../services/userService");
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
        const hashedPassword = yield bcrypt_1.default.hash(password.trim(), 10);
        console.log("Hashed password:", hashedPassword);
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
        const isMatch = yield bcrypt_1.default.compare(password.trim(), user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || "4h" });
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
const logoutUser = (req, res) => {
    res.status(200).json({ message: 'User logged out' });
};
exports.logoutUser = logoutUser;
const getProtectedResource = (req, res) => {
    res.json({ message: 'This is a protected resource', user: req.user });
};
exports.getProtectedResource = getProtectedResource;
