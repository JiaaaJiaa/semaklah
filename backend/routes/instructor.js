const express = require('express');
const supabase = require('../config/supabaseClient');

const router = express.Router();


// Get an instructor with the instructor id
router.get('/:id', async(req, res) => {
    const id = req.params.id;
    
    let {data,error} = await supabase
        .from('instructor')
        .select('*')
        .eq('inst_id',id);

    if(error){
        return res.status(400).json({error});
    }else{
        return res.status(200).json(data);
    }
});

module.exports = router;