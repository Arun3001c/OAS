const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors(
  {
  origin: 'http://localhost:5173', // React dev server
  credentials: true
}

));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err.message));

// Static Files (for image access)

// Routes
app.use('/api/profile', require('./routes/profile'));

app.use('/api', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
// Serve static files from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
