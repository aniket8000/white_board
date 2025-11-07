const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// basic middleware setup
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// connect to MongoDB if configured, otherwise fallback to memory
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection failed:', err));
} else {
  console.log('Mongo not configured - using in-memory data');
}

// route imports
const shapeRoutes = require('./routes/shapeRoutes');
const pageRoutes = require('./routes/pageRoutes');

// route setup
app.use('/api/shapes', shapeRoutes);
app.use('/api/pages', pageRoutes);

// simple base route
app.get('/', (req, res) => res.send('Whiteboard backend is running'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
