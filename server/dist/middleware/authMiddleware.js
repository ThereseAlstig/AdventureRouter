"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = exports.verifyToken = exports.ensureAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Access denied, malformed token' });
        return;
    }
    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || '5498746513215468dfg646541654AE46546';
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = decoded; // Spara användardata i request-objektet
        next();
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            // Token har gått ut
            res.status(401).json({ message: 'Token expired' });
            return;
        }
        else {
            // Ogiltig token eller annat fel
            res.status(403).json({ message: 'Invalid token' });
            return;
        }
    }
};
exports.ensureAuthenticated = ensureAuthenticated;
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Hämta token från "Authorization" header
    if (!token) {
        res.status(401).json({ message: 'Access Denied: No Token Provided' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid or Expired Token' });
    }
};
exports.verifyToken = verifyToken;
const verifyAdmin = (req, res, next) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ message: 'Du är inte inloggad.' });
        return;
    }
    if (user.role !== 'admin') {
        res.status(403).json({ message: 'Endast admin har behörighet.' });
        return;
    }
    next(); // Fortsätt till nästa middleware eller route-handler
};
exports.verifyAdmin = verifyAdmin;
