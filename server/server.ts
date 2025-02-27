
import dotenv from 'dotenv';
 dotenv.config();

import express, { Request, Response } from 'express';

import pool from './config/db'; 
import productRouter from './routes/productRouter';
import session from 'express-session';

import passport from 'passport';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRouter';
import './config/passport'; 
import googleRoutes from './routes/googleRoutes'; 
import orderRouter from './routes/orderRouter'; 
import githubRoutes from './routes/githubRouter'; 
import travelRoutes from './routes/travelRouter';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import stripeRoutes from './routes/stripeRouter'; 
import compression from 'compression';


 // Importera produktens router

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(compression());
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Test av databasanslutning
(async () => {
    try {
       
        await pool.query('SELECT 1'); 
        console.log('Database connected successfully');
       
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Om anslutningen misslyckas, stäng av servern
    }
})();

// API-rutter - kolla av databasanslutningen
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to AdventureRouter backend!');
});


app.use('/products', productRouter);
app.use('/auth', authRoutes);
app.use('/user', googleRoutes);
app.use('/orders', orderRouter);
app.use('/api', travelRoutes);
app.use('/user', githubRoutes);
app.use('/payment', stripeRoutes);

// Starta servern
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
