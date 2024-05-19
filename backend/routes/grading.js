const express = require('express');
const supabase = require('../config/supabaseClient');

const router = express.Router();


// // Create a new entry with a submission id and gr_id
// router.post('/', async (req, res) => {
//     const { sub_id, gr_id, mark_earned } = req.body;

//     let { data, error } = await supabase
//         .from('grading')
//         .insert([{ sub_id, gr_id, mark_earned }])
//         .select('gr_id');

//     if (error) {
//         return res.status(400).json({ error: error.message });
//     } else {
//         return res.status(200).json(data[0]);
//     }
// });

// Create a new entry with a submission id and gr_id
router.put('/', async (req, res) => {
    const { sub_id, gr_id, mark_earned } = req.body;

    let { data, error } = await supabase
        .from('grading')
        .upsert([{ sub_id, gr_id, mark_earned }], { onConflict: ['sub_id', 'gr_id'] })
        .select('*');

    if (error) {
        return res.status(400).json({ error: error.message });
    } else {
        return res.status(200).json(data[0]);
    }
});

// Get all the grading by submission id
router.get('/', async (req, res) => {
    const sub_id = req.query.sub_id;

    // Get all grading from the database
    let { data, error } = await supabase
        .from('grading')
        .select('*')
        .eq('sub_id', sub_id)

    if (error) {
        return res.status(400).json({ error: error.message });
    } else {
        return res.status(200).json(data);
    }
});


module.exports = router;