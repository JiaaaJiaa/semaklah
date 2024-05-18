const express = require('express');
const supabase = require('../config/supabaseClient');

const router = express.Router();

// Get the grading rubric by assignment id
router.get('/:assignId', async (req, res) => {
    const assignId = req.params.assignId;

    // Get the grading rubric from the database
    let { data, error } = await supabase
        .from('gradingrubric')
        .select('*')
        .eq('assign_id', assignId);

    if (error) {
        return res.status(400).json({ error: error.message });
    } else {
        data = data.sort((a, b) => a.question - b.question);
        return res.status(200).json(data);
    }
});

// Create a new row whenever user add new row in grading rubric
router.post('/', async (req, res) => {
    const { assign_id } = req.body;


    let { data, error } = await supabase
        .from('gradingrubric')
        .insert([{ assign_id }])
        .select('gr_id');

    if (error) {
        return res.status(400).json({ error: error.message });
    } else {
        return res.status(200).json(data[0]);
    }
});

// Updating or Save the grading rubric by Grading Rubric ID
router.put('/', async (req, res) => {
    const { gr_id, assign_id, question, mark_possible, description} = req.body;

    const updatedGrading = {
        assign_id,
        question, 
        mark_possible, 
        description
    };

    let { data, error } = await supabase
        .from('gradingrubric')
        .update(updatedGrading)
        .eq('gr_id', gr_id)
        .select('*');

    console.log(data);

    if (error) {
        return res.status(400).json({ error: error.message });
    } else {
        return res.status(200).json(data[0]);
    }
});

// Delete the grading rubric by Grading Rubric ID
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    let { data, error } = await supabase
        .from('gradingrubric')
        .delete()
        .eq('gr_id', id);

    if (error) {
        return res.status(400).json({ error: error.message });
    } else {
        return res.status(200).json(data);
    }
});


module.exports = router;