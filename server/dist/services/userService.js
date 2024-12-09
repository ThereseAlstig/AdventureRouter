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
exports.findOrCreateUserByGithub = exports.findOrCreateUserByGoogle = exports.createUser = exports.findUserByEmail = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../config/db"));
// Din databasanslutning
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return null; // Ingen användare hittades
        }
        return rows[0]; // Returnera den första användaren
    }
    catch (error) {
        console.error('Error finding user by email:', error);
        throw new Error('Database query failed');
    }
});
exports.findUserByEmail = findUserByEmail;
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield (0, exports.findUserByEmail)(user.email);
    if (existingUser) {
        throw new Error('User with this email already exists');
    }
    const hashedPassword = user.password ? yield bcryptjs_1.default.hash(user.password, 10) : null;
    yield db_1.default.query('INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, ?)', [
        user.email,
        user.username || null,
        hashedPassword,
        user.role || 'user',
    ]);
    const newUser = yield (0, exports.findUserByEmail)(user.email);
    if (!newUser)
        throw new Error('User creation failed');
    return newUser;
});
exports.createUser = createUser;
const findOrCreateUserByGoogle = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Kontrollera om användaren redan finns baserat på e-post
    let user = yield (0, exports.findUserByEmail)(data.email);
    if (!user) {
        // Skapa en ny användare om ingen hittas
        user = yield (0, exports.createUser)({
            email: data.email,
            role: 'user',
            username: data.username, // Standardroll för nya användare
        });
    }
    return user;
});
exports.findOrCreateUserByGoogle = findOrCreateUserByGoogle;
const findOrCreateUserByGithub = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Kontrollera om användaren redan finns baserat på e-post
    let user = yield (0, exports.findUserByEmail)(data.email);
    if (!user) {
        // Skapa en ny användare om ingen hittas
        user = yield (0, exports.createUser)({
            username: data.username,
            email: data.email,
            role: 'user', // Standardroll för nya användare
        });
    }
    return user;
});
exports.findOrCreateUserByGithub = findOrCreateUserByGithub;
