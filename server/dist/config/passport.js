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
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_github2_1 = require("passport-github2");
const passport_1 = __importDefault(require("passport"));
const userService_1 = require("../services/userService");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let user = yield (0, userService_1.findOrCreateUserByGoogle)({
            email: ((_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) || '',
            username: profile.displayName,
        });
        // Logga användarens data
        done(null, user);
    }
    catch (error) {
        console.error('Error in GoogleStrategy:', error);
        done(error);
    }
})));
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackURL: process.env.GITHUB_CALLBACK_URL || '',
    scope: ['user:email'],
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        // Typdefinition för email-objekten
        const primaryEmail = ((_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a.find((email) => email.primary)) === null || _b === void 0 ? void 0 : _b.value) || ((_d = (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value);
        const user = yield (0, userService_1.findOrCreateUserByGithub)({
            email: primaryEmail || '',
            username: profile.username || '',
        });
        // Skicka användaren till req.user
        done(null, user);
    }
    catch (error) {
        done(error);
    }
})));
exports.default = passport_1.default;
