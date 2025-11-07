import User from '../models/user.js';

export const login = async (req, res, next) => {
    try {
        // extract email and password from request body
        // this would come from the auth/login endpoint
        const { email, password } = req.body;

        //if they miss email or password
        if(!email || !password) {
            return res.status(400).json({ success: false, error: 'email and password are required' }); //400 means bad request
        }

        // Find user and explicitly include password field from the database
        const user = await User.findOne({ email: email.toLowerCase() })
            .select('+password');

        //error response of user is not found
        if (!user) {
            return res.status(401).json({ 
                success: false,
                error: 'Invalid credentials' // Generic message for security
            });
        }
       
        // Check if user is active, can probably remove this attribute from the schema
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Account is disabled'
            });
        }

        // Compare password
        const isPasswordMatch = await user.comparePassword(password);
        
        // error response if passwords do not match
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Update last login
        // this is just a simple audit log
        user.lastLogin = new Date();
        await user.save(); // saves the database entry to the table

        // since password matched, we can generate a jwt token
        const token = user.generateAuthToken();

        // debug line
        console.log(`User logged in successfully: ${email}`);

        // this is the successful response
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
        // catches only unexpected errors. can be from db connection issues, code bugs, etc
        console.error("Login error:", error);
        next(error); //pass to global error handler that is on the server.js file
    }
};

export const logout = (req, res) => {
    //for JWT, logout is handled on client side by deleting the token on the frontend localstorage/cookies
    res.json({
        success: true,
        message: 'Logout successful'
    });
};

//useless 
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