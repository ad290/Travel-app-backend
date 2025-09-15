const express = require('express');
const { body, validationResult } = require('express-validator');
const Destination = require('../models/Destination');

const router = express.Router();


const validateDestination = [
  body('name').notEmpty().trim().withMessage('Destination name is required'),
  body('country').notEmpty().trim().withMessage('Country is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('coordinates.latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  body('coordinates.longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required')
];


router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ name: 1 });
    res.json({
      success: true,
      count: destinations.length,
      data: destinations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve destinations',
      error: error.message
    });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.json({
      success: true,
      data: destination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve destination',
      error: error.message
    });
  }
});


router.post('/', validateDestination, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const destination = new Destination(req.body);
    const savedDestination = await destination.save();

    res.status(201).json({
      success: true,
      message: 'Destination created successfully',
      data: savedDestination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create destination',
      error: error.message
    });
  }
});

// PUT /api/destinations/:id - Update destination
router.put('/:id', validateDestination, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.json({
      success: true,
      message: 'Destination updated successfully',
      data: destination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update destination',
      error: error.message
    });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.json({
      success: true,
      message: 'Destination deleted successfully',
      data: destination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete destination',
      error: error.message
    });
  }
});

module.exports = router;
