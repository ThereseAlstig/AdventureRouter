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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = require("../services/userService");
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return; // Avsluta funktionen här för att undvika fortsatt exekvering
        }
        const existingUser = yield (0, userService_1.findUserByEmail)(email);
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield (0, userService_1.createUser)({ email, password: hashedPassword, username: username || email.split('@')[0], });
        // Logik för att hantera registrering
        res.status(201).json({ message: 'User registered successfully', user });
    }
    catch (error) {
        next(error); // Vid fel, skicka vidare till Express error-handler
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return; // Avsluta här
        }
        const user = yield (0, userService_1.findUserByEmail)(email);
        if (!user || !user.password) {
            res.status(401).json({ message: 'Invalid credentials' });
            return; // Avsluta här
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return; // Avsluta här
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.status(200).json({ token, email: user.email, username: user.username, role: user.role });
    }
    catch (error) {
        next(error); // Skicka vidare fel till Express error-handler
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
