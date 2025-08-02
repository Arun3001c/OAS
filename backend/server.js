     server.js
    const express = require('express');
    const mongoose = require('mongoose');
    const cors = require('cors');
    require('dotenv').config();  Load environment variables

    const app = express();
    const PORT = process.env.PORT  5000;  Define your server port

     Middleware
    app.use(cors());
    app.use(express.json());  Enable parsing of JSON request bodies

     MongoDB Connection
    mongoose.connect(process.env.DB_CONNECTION_STRING)
        .then(() = console.log('Connected to MongoDB'))
        .catch((error) = console.error('MongoDB connection error', error));

     Basic route
    app.get('', (req, res) = {
        res.send('MERN Backend Initialized!');
    });

     Start the server
    app.listen(PORT, () = {
        console.log(`Server running on port ${PORT}`);
    });