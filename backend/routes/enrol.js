const express = require('express');
const supabase = require('../config/supabaseClient');

const router = express.Router();

// Get all enrolled classroom
router.get('/', async (req, res) => {

    const userId = req.query.userId;

    // console.log('userId:', userId);

    const { data, error } = await supabase
        .from('enrol')
        .select('*,classroom(*)')
        .eq('stud_id', userId);

    if (error) return res.status(401).json({ error: error.message });

    return res.status(200).json(data);
});

// Enroll into a classroom
router.post('/', async (req, res) => {
    const { student_id, classroom_id } = req.body;

    const { data, error } = await supabase
        .from('enrol')
        .insert([{ student_id, classroom_id }]);

    if (error) return res.status(401).json({ error: error.message });

    return res.status(200).json(data);
});







module.exports = router;