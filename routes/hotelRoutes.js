const express = require('express');
const { body, validationResult } = require('express-validator');
const Hotel = require('../models/Hotel');
const Destination = require('../models/Destination');

const router = express.Router();


const validateHotel = [
  body('name').notEmpty().trim().withMessage('Hotel name is required'),
  body('destinationId').isMongoId().withMessage('Valid destination ID is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('pricePerNight').isFloat({ min: 0 }).withMessage('Valid price per night is required'),
  body('starRating').optional().isInt({ min: 1, max: 5 }).withMessage('Star rating must be between 1 and 5')
];


router.get('/', async (req, res) => {
  try {
    const { destinationId } = req.query;
    let query = {};
    
    if (destinationId) {
      query.destinationId = destinationId;
    }

    const hotels = await Hotel.find(query)
      .populate('destinationId', 'name country')
      .sort({ name: 1 });

    res.json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve hotels',
      error: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('destinationId', 'name country description coordinates');
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve hotel',
      error: error.message
    });
  }
});


router.get('/destination/:destinationId', async (req, res) => {
  try {
    const hotels = await Hotel.find({ destinationId: req.params.destinationId })
      .populate('destinationId', 'name country')
      .sort({ starRating: -1, guestRating: -1 });

    res.json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve hotels for destination',
      error: error.message
    });
  }
});


router.post('/', validateHotel, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    
    const destination = await Destination.findById(req.body.destinationId);
    if (!destination) {
      return res.status(400).json({
        success: false,
        message: 'Destination not found'
      });
    }

    const hotel = new Hotel(req.body);
    const savedHotel = await hotel.save();
    
  
    await savedHotel.populate('destinationId', 'name country');

    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: savedHotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create hotel',
      error: error.message
    });
  }
});


router.put('/:id', validateHotel, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }


    if (req.body.destinationId) {
      const destination = await Destination.findById(req.body.destinationId);
      if (!destination) {
        return res.status(400).json({
          success: false,
          message: 'Destination not found'
        });
      }
    }

    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('destinationId', 'name country');

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.json({
      success: true,
      message: 'Hotel updated successfully',
      data: hotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update hotel',
      error: error.message
    });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.json({
      success: true,
      message: 'Hotel deleted successfully',
      data: hotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete hotel',
      error: error.message
    });
  }
});

module.exports = router;
