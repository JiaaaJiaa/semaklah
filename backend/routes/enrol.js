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
    const { stud_id, classroom_id } = req.body;

    try {
        // Fetch the classroom from the database
        let { data: classroom, error } = await supabase
        .from('classroom')
        .select('*')
        .eq('classroom_id', classroom_id)
        .single();

        if (error) throw error;

        // Check if the classroom is full
        if (classroom.current_enrolment >= classroom.classroom_limit) {
        return res.status(400).json({ error: 'Classroom is full' });
        }

        // Check if the user is already enrolled
        let { data: enrollment, error: enrollmentError } = await supabase
        .from('enrol')
        .select('*')
        .eq('stud_id', stud_id)
        .eq('classroom_id', classroom_id);

        if (enrollmentError) throw enrollmentError;

        if (enrollment.length > 0) {
        return res.status(400).json({ error: 'Already enrolled' });
        }

        // If neither condition is true, create the enrollment
        let { data, error: createError } = await supabase
        .from('enrol')
        .insert([{ stud_id, classroom_id }])
        .select('*,classroom(*)');

        if (createError) throw createError;

        // Increment the current_enrolment value
        let updatedEnrollment = classroom.current_enrolment + 1;

        // Update the classroom in the database
        let { error: updateError } = await supabase
        .from('classroom')
        .update({ current_enrolment: updatedEnrollment })
        .eq('classroom_id', classroom_id);

        if (updateError) throw updateError;

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
});

// Get enrol_id for submission
router.get('/id/', async (req, res) => {
    const { stud_id, classroom_id } = req.query;

    try {
        let { data, error } = await supabase
            .from('enrol')
            .select('enrol_id')
            .eq('stud_id', stud_id)
            .eq('classroom_id', classroom_id);

        if (error) {
            throw error;
        }

        // Ensure that data[0] exists before trying to access enrol_id
        if (data[0]) {
            return res.status(200).json(data[0].enrol_id);
        } else {
            throw new Error('No enrolment found');
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;