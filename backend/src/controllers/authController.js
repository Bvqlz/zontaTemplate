import User from '../models/user.js';

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //if they miss email or password
        if(!email || !password) {
            return res.status(400).json({ success: false, error: 'email and password are required' }); //400 means bad request
        }

        // Find user and explicitly include password field
        const user = await User.findOne({ email: email.toLowerCase() })
            .select('+password');

        if (!user) {
            return res.status(401).json({ 
                success: false,
                error: 'Invalid credentials' // Generic message for security
            });
        }
       
        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Account is disabled'
            });
        }

        // Compare password
        const isPasswordMatch = await user.comparePassword(password);
        
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = user.generateAuthToken();

        console.log(`User logged in successfully: ${email}`);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                admin: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                expiresIn: process.env.JWT_EXPIRE
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        next(error); //pass to global error handler
    }
};

export const logout = (req, res) => {
    //for JWT, logout is handled on client side by deleting the token
    res.json({
        success: true,
        message: 'Logout successful'
    });
};

export const testAuthEndpoint = (req, res) => {
    res.json({
        success: true,
        message: 'auth api working',
        endpoints: {
            login: '/api/auth/login',
            logout: '/api/auth/logout',
        }
    });
};