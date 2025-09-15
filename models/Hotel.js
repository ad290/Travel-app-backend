const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  address: {
    type: String,
    required: true
  },
  starRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  guestRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  pricePerNight: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    default: ''
  },
  roomCategories: [{
    categoryName: {
      type: String,
      required: true
    },
    pricePerNight: {
      type: Number,
      required: true
    },
    amenities: [String],
    maxOccupancy: {
      type: Number,
      default: 2
    }
  }],
  hotelAmenities: [String],
  nearbyLandmarks: [{
    landmarkName: String,
    distanceInKm: Number
  }],
  nearbyAttractions: [{
    name: String,
    distance: String
  }],
  contactInfo: {
    phoneNumber: String,
    email: String,
    website: String
  },
  imageGallery: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  strict: false 
});


hotelSchema.index({ destinationId: 1 });
hotelSchema.index({ starRating: 1 });
hotelSchema.index({ pricePerNight: 1 });

module.exports = mongoose.model('Hotel', hotelSchema);
