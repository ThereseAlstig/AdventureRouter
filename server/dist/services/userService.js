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
exports.sendEmail = exports.updateUserPassword = exports.findOrCreateUserByGithub = exports.findOrCreateUserByGoogle = exports.createUser = exports.findUserByEmail = exports.verifyPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../config/db"));
const mailgun_js_1 = __importDefault(require("mailgun-js"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Din databasanslutning
//verifiera lösenord 
const verifyPassword = (inputPassword, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.compare(inputPassword, hashedPassword);
});
exports.verifyPassword = verifyPassword;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query('SELECT id, email, username, password, role FROM users WHERE email = ?', [email]);
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
//Skapar användare
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password, role } = user;
    // Hantera lösenord
    let hashedPassword = null;
    // Skapa användaren i databasen
    yield db_1.default.query('INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, ?)', [email, username || email.split('@')[0], password, role || 'user']);
    const newUser = yield (0, exports.findUserByEmail)(email);
    if (!newUser) {
        throw new Error('User creation failed');
    }
    return newUser;
});
exports.createUser = createUser;
//Skapa användare med Google
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
//Uppdaatera lösenordet
const updateUserPassword = (userId, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("userId:", userId);
    yield db_1.default.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);
});
exports.updateUserPassword = updateUserPassword;
//Mailgun Skicka mail
const sendEmail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    const mg = (0, mailgun_js_1.default)({
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
    });
    const DOMAIN = process.env.MAILGUN_DOMAIN;
    const data = {
        from: `<no-reply@${DOMAIN}>`, // Avsändaradress
        to,
        subject,
        html,
    };
    try {
        console.log("Skickar e-post...");
        // Skicka e-post via Mailgun
        yield mg.messages().send(data);
        console.log("E-post skickad!");
    }
    catch (error) {
        console.error("Fel vid e-postskick:", error);
        throw new Error("Kunde inte skicka e-post");
    }
});
exports.sendEmail = sendEmail;
