
import dotenv from 'dotenv';
 dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import pool from './config/db'; // Importera databaskonfigurationen
import productRouter from './routes/productRouter';
import session from 'express-session';

import passport from 'passport';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRouter';
import './config/passport'; 
import googleRoutes from './routes/googleRoutes'; // Import googleRoutes
import orderRouter from './routes/orderRouter'; // Import ordersRoutes
import travelRoutes from './routes/travelRouter';




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

// Starta servern
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
