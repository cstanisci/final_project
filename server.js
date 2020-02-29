// Bring in Express
const express = require('express');

const connectDB = require('./config/db');
// const path = require('path');

// Initialize app variable with express
const app = express();

// Connect Database
connectDB();

// Init Middleware - allows us to get data in req.body
app.use(
    express.json({
        extended: false
    })
);

// MIDDLEWARE ADDON
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); //matching domain request
    res.header(
        'Access-Control-Allow-Headers',
        'x-auth-token Origin, X-Request-With, Content-type, Accept'
    );
    next();
});

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));