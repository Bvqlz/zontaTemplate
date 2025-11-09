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

// this is the cors config
// origin is our frontend url 
// setting credentials to true allows cookies to be sent
const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true
}

// Stripe webhooks need raw body - MUST come before any body parsing middleware
// Apply CORS to webhook routes first, then raw body parser
app.use('/api/donations/webhook', cors(), express.raw({ type: 'application/json' }));
app.use('/api/products/webhook', cors(), express.raw({ type: 'application/json' }));

// Register webhook routes
app.post('/api/donations/webhook', handleWebhook);
app.post('/api/products/webhook', handleProductWebhook);

// CORS and body parsing for all other routes
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // just means parsing for URL-encoded data like form submissions


if(process.env.NODE_ENV !== 'production') {
    // what this does is it logs every request method and path to the console
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// useless
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

// also useless
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
    console.error('Error:', err.stack); //err stack shows where the error originated
    
    const statusCode = err.statusCode || 500; // default to 500 if statusCode not set
    const message = err.message || 'Something went wrong!'; // default error message as well
    
    // this is the error response
    res.status(statusCode).json({ 
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // this copies the stack trace into the response only in development mode
    });
});

const PORT = process.env.PORT || 3000;

//debug info when the server starts. If the envs show up correctly, then we know the .env file is being read properly
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

    // only happens when server doesn't close in time
    setTimeout(() => {
        console.error('Forcing server shutdown...');
        process.exit(1);
    }, 10000);
};

// the process keyword here refers to the Node.js process itself
process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); //signal termination
process.on('SIGINT', () => gracefulShutdown('SIGINT')); //signal interrupt (Ctrl+C)

//generic uncaught exception and unhandled rejection handlers
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

export default app;
