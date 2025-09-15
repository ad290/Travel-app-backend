const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  popularAttractions: [{
    name: String,
    description: String
  }],
  bestTimeToVisit: {
    type: String,
    default: ''
  },
  currency: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  strict: false 
});

destinationSchema.index({ name: 1, country: 1 });

module.exports = mongoose.model('Destination', destinationSchema);
