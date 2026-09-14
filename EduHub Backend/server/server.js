require('dotenv').config({ path: '../.env' }); 
const cors = require('cors');
const express = require('express');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
require('./dbconnection/dbtest');

// Home Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "EduHub Backend is Running Successfully 🚀"
    });
});

// Routes
const webRoutes = require('./routes/web');
app.use('/api', webRoutes);

// Handle Invalid Routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});

// Server Configuration
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running securely on port ${PORT}`);
});
