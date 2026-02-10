const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();
const connectDB = require('./config/dbConn');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const CookieParser = require('cookie-parser');
const path = require('path');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors(corsOptions));

app.use(express.json());

app.use(CookieParser());

if(process.env.NODE_ENV === 'development') {
    console.log('Running in development mode');
    app.use(morgan('dev'));
} else {
    console.log('Running in production mode');
}

//render static files
app.use('/', express.static(path.join(__dirname, 'public')));


// Routes
app.use('/', require('./routes/root'));

app.use('/api/v1/auth', require('./routes/authRoutes'));

app.use('/api/v1/users', require('./routes/userRoutes'))


// 404 handler
app.use((req, res, next) => {
  res.status(404);

  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});


//MongoDB connection events
mongoose.connection.once('open', () => {
    console.log('MongoDB connection is open and ready to use');

    // Start the server only after DB connection
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);


    // ziad made
    console.log('Z3Tar & SDMX is here at http://localhost:3000')

    });
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});








