const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const destinationRoutes = require('./routes/destinationRoutes');
const hotelRoutes = require('./routes/hotelRoutes');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/destinations', destinationRoutes);
app.use('/api/hotels', hotelRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Travel Booking API is running successfully!', timestamp: new Date() });
});


mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://adityapawar02468:aditya12@cluster0.ix1nxye.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB database successfully');
})
.catch((error) => {
  console.error('Database connection failed:', error);
  process.exit(1);
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
