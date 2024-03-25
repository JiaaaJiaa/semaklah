const express = require('express');

const router = express.Router();

// Get all classroom
router.get('/', (req, res) => { 
    res.json({ message: 'Get all classroom' });
});

// Get a classroom by id
router.get('/:id', (req, res) => {
    res.json({ message: 'Get a classroom by id' });
});

// Create a new classroom
router.post('/', (req, res) => {
    res.json({ message: 'Create a new classroom' });
});

// Update a classroom by id
router.patch('/:id', (req, res) => {
    res.json({ message: 'Update a classroom by id' });
});

// Delete a classroom by id
router.delete('/:id', (req, res) => {
    res.json({ message: 'Delete a classroom by id' });
});

module.exports = router;