const express = require('express');
const supabase = require('../config/supabaseClient');

const router = express.Router();

// Get all submission by a single assignment id
router.get('/:assign_id', async (req, res) => {
    const { assign_id } = req.params;

    let { data, error } = await supabase
        .from('submission')
        .select('*')
        .eq('assign_id', assign_id);

    if (error) {
        return res.status(400).json({ error: error.message });
    } else {
        return res.status(200).json(data);
    }
});

// Update a submission by submission id - Remove this if not needed

// Create a new submission
router.post('/', async (req, res) => {
    const { assign_id, enrol_id, file } = req.body;

    // console.log('Assign ID:', assign_id);
    // console.log('Enrol ID:', enrol_id);
    // console.log('File:', file);

    const newSubmission = {
        assign_id,
        enrol_id,
        file
    };

    let { data, error } = await supabase
        .from('submission')
        .insert([newSubmission])
        .select();

    if (error) {
        return res.status(400).json({ error: error.message });
    } else {
        return res.status(200).json(data[0]);
    }
});

// Get a single submission by assgn_id and enrol_id
router.get('/:assign_id/:enrol_id', async (req, res) => {
    const { assign_id, enrol_id } = req.params;

    // console.log('Assign ID:', assign_id);
    let { data, error } = await supabase
        .from('submission')
        .select('*')
        .eq('assign_id', assign_id)
        .eq('enrol_id', enrol_id);

    if (error) {
        return res.status(400).json({ error: error.message });
    } else {
        return res.status(200).json(data[0]);
    }
});

// Delete a submission by id
router.delete('/:submission_id', async (req, res) => {
    const { submission_id } = req.params;

    let { data, error } = await supabase
        .from('submission')
        .delete()
        .eq('sub_id', submission_id)
        .select();

    if (error) {
        return res.status(400).json({ error: error.message });
    } else {
        return res.status(200).json(data);
    }
});

module.exports = router;