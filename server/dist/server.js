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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const productRouter_1 = __importDefault(require("./routes/productRouter"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const body_parser_1 = __importDefault(require("body-parser"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
require("./config/passport");
const googleRoutes_1 = __importDefault(require("./routes/googleRoutes"));
const orderRouter_1 = __importDefault(require("./routes/orderRouter"));
const githubRouter_1 = __importDefault(require("./routes/githubRouter"));
const travelRouter_1 = __importDefault(require("./routes/travelRouter"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const stripeRouter_1 = __importDefault(require("./routes/stripeRouter"));
const compression_1 = __importDefault(require("compression"));
// Importera produktens router
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use((0, express_session_1.default)({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});
// Test av databasanslutning
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default.query('SELECT 1');
        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Om anslutningen misslyckas, stäng av servern
    }
}))();
// API-rutter - kolla av databasanslutningen
app.get('/', (req, res) => {
    res.send('Welcome to AdventureRouter backend!');
});
app.use('/products', productRouter_1.default);
app.use('/auth', authRouter_1.default);
app.use('/user', googleRoutes_1.default);
app.use('/orders', orderRouter_1.default);
app.use('/api', travelRouter_1.default);
app.use('/user', githubRouter_1.default);
app.use('/payment', stripeRouter_1.default);
// Starta servern
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
