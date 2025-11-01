import jwt from 'jsonwebtoken';
import User from '../models/user.js';

//this used for protected routes that require authentication
export const protect = async (req, res, next) => {
    let token;
    
    //just checking if even has a token in the header
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            //since it exists, we can get the token from the bearer. since its in the form of "Bearer token" we split by space and get the second part
            token = req.headers.authorization.split(' ')[1];

            //need to verify the token is valid
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from database (optional but recommended for fresh data)
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return res.status(401).json({ 
                    success: false,
                    error: 'User not found' 
                });
            }

            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    error: 'Account is disabled'
                });
            }

            // Attach user to request
            req.user = user;
            
            console.log("User authenticated:", user.email, user.role);
            next();

        } catch (error) {
            console.error("Token verification failed:", error);
            return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
        }
    }
};

