const express = require('express');
const supabase = require('../config/supabaseClient');

const router = express.Router();

// Get all instructors with id
router.get('/:id', async (req, res) => {

    const id = req.params.id;

    // Get all instructors from the database
    let {data,error} = await supabase
        .from('instructor')
        .select('*')
        .eq('id',id);
    
    if(error){
        return res.status(400).json({error});
    } else {
        return res.status(200).json(data);
    }
});

module.exports = router;