import express from 'express';
import cors from 'cors';
import memberRoutes from './src/routes/members.js';
import eventRoutes from './src/routes/events.js';
import scholarshipRoutes from './src/routes/scholarships.js';
import authRoutes from './src/routes/auth.js';
import donationRoutes, { handleWebhook } from './src/routes/donations.js';
import productRoutes, { handleProductWebhook } from './src/routes/products.js';
import { connectDB } from './src/config/database.js';

connectDB();
const app = express();

const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true
}

app.use(cors());

// Stripe webhooks need raw body
app.post('/api/donations/webhook', express.raw({ type: 'application/json' }), handleWebhook);
app.post('/api/products/webhook', express.raw({ type: 'application/json' }), handleProductWebhook);

// JSON parsing for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


if(process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

app.get('/', (req, res) => {
    res.json({
        message: "Welcome to Zonta Club of Naples API",
        version: "1.0.0",
        endpoints: {
            health: "/health",
            api: "/api"
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString() 
    });
});

// API Routes
app.use('/api/members', memberRoutes);

app.use('/api/events', eventRoutes);

app.use('/api/scholarship', scholarshipRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/donations', donationRoutes);

app.use('/api/products', productRoutes);

app.use((req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        path: req.path 
    });
});

// Global error handler/middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong!';
    
    res.status(statusCode).json({ 
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // what does this do
    });
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Email configured: ${process.env.EMAIL_USER}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

const gracefulShutdown = async (signal) => {
    console.log(`Received ${signal}. Closing server...`);
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    })

    setTimeout(() => {
        console.error('Forcing server shutdown...');
        process.exit(1);
    }, 10000);
};


process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); //signal termination
process.on('SIGINT', () => gracefulShutdown('SIGINT')); //signal interrupt (Ctrl+C)


process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

export default app;
