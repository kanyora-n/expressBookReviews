const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Set up session middleware for customer routes
app.use("/customer", session({ 
    secret: "fingerprint_customer", 
    resave: true, 
    saveUninitialized: true 
}));

// Authentication middleware for /customer/auth/* routes
app.use("/customer/auth/*", function auth(req, res, next) {
    // Get the token from the session
    const token = req.session.token;

    // If no token is found in the session, return an unauthorized response
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access. Please login first." });
    }

    // Verify the token using JWT
    jwt.verify(token, "your_jwt_secret", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token." });
        }

        // If the token is valid, store the decoded user info in req.user and proceed
        req.user = decoded;
        next();
    });
});

// Example login route that generates a JWT and stores it in the session
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if the user is authenticated
    if (authenticatedUser(username, password)) {
        // Generate a JWT with a secret and expiration time
        const token = jwt.sign({ username: username }, "your_jwt_secret", { expiresIn: '1h' });

        // Store the token in the session
        req.session.token = token;

        return res.status(200).json({ message: "Login successful!", token: token });
    } else {
        return res.status(401).json({ message: "Invalid credentials." });
    }
});

// Use customer routes
app.use("/customer", customer_routes);

// Use general routes
app.use("/", genl_routes);

const PORT = 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
