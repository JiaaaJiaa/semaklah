const express = require('express');
const supabase = require('../config/supabaseClient');

const router = express.Router();

// Get all assignment using classroom id
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    // Get all assignment from the database
    let { data, error } = await supabase
        .from('assignment')
        .select('*')
        .eq('classroom_id', id)
        .order('created_at', { ascending: false });

    if (error) {
        return res.status(400).json({ error: error.message });
    } else {
        return res.status(200).json(data);
    }
});

// Get a assignment by id using assign_id
// router.get('/:id', async (req, res) => {    
//     const id = req.params.id;

//     // Get a assignment from the database
//     let { data, error } = await supabase
//         .from('assignment')
//         .select('*')
//         .eq('assign_id', id);

//     if (error) {
//         return res.status(400).json({ error: error.message });
//     } else {
//         return res.status(200).json(data);
//     }
// });

// Create a new assignment
router.post('/', async (req, res) => {
    const { classroom_id, title, desc, instruc, file, start_date, end_date } = req.body;

    const newAssignment = {
        classroom_id,
        title,
        desc,
        instruc,
        file,
        start_date,
        end_date
    };

    let { data, error } = await supabase
        .from('assignment')
        .insert([newAssignment])
        .select();

    if (error) {
        return res.status(400).json({ error: error.message });
    } else {
        return res.status(200).json(data);
    }
});

// Update an assignment by id
router.patch('/:id', async (req,res)=>{
    const id = req.params.id;
    const { title, desc, instruc, file, start_date, end_date } = req.body;

    const updatedAssignment = {
        title,
        desc,
        instruc,
        file,
        start_date,
        end_date
    };

    let { data, error } = await supabase
        .from('assignment')
        .update(updatedAssignment)
        .eq('assign_id', id);

    if (error) {
        return res.status(400).json({ error: error.message });
    } else {
        return res.status(200).json(data);
    }
})

// Delete an assignment by id
router.delete('/:id', async (req, res) => {

    const id = req.params.id;
    
    let{data:lastdata,error:lasterror} = await supabase
        .from('assignment')
        .select('*')
        .eq('assign_id',id);

    if(lasterror){
        return res.status(400).json({error:lasterror.message});
    }

    let { error } = await supabase
        .from('assignment')
        .delete()
        .eq('assign_id', id);

    if (error) {
        return res.status(400).json({ error: error.message });
    } else {
        return res.status(200).json(lastdata);
    }
});

module.exports = router;