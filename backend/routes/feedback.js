const express = require('express');
const supabase = require('../config/supabaseClient');

const router = express.Router();

// Get all comments by a single submission id
router.get('/getfeedback', async (req, res) => {
    const sub_id = req.query.sub_id;

    // Get all comments from the database
    let { data, error } = await supabase
        .from('feedbacktext')
        .select('feedback')
        .eq('sub_id', sub_id)

    if (error) {
        return res.status(400).json({ error: error.message });
    } else {
        console.log(data);
        return res.status(200).json(data);
    }
});

// Save comments in the database
router.post('/savefeedback', async (req, res) => {
    const { sub_id, feedback } = req.body;

    const newFeedback = {
        sub_id,
        feedback
    };

    let { data, error } = await supabase
        .from('feedbacktext')
        .update(newFeedback)
        .eq('sub_id', sub_id);

    if (error) {
        return res.status(400).json({ error: error.message });
    } else {
        return res.status(200).json(data);
    }
})

module.exports = router;