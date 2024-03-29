const express = require('express');
const supabase = require('../config/supabaseClient');

const router = express.Router();

// Get all classrooms
router.get('/', async (req, res) => { 

    // Get all classroom from the database
    let {data,error} = await supabase
        .from('classroom')
        .select('*');
    
    if(error){
        return res.status(400).json({error:error.message});
    } else {
        return res.status(200).json(data);
    }
});

// Get a classroom by id
router.get('/:id', async(req, res) => {
    const id = req.params.id;
    
    let {data,error} = await supabase
        .from('classroom')
        .select('*')
        .eq('classroom_id',id);

    if(error){
        return res.status(400).json({error});
    }else{
        return res.status(200).json(data);
    }
});

router.post('/', async (req, res) => {
    const { inst_id, academic_year, semester, course_name, course_code, course_desc, classroom_limit } = req.body;

    const newClassroom = {
        inst_id,
        academic_year,
        semester,
        course_name,
        course_code,
        course_desc,
        classroom_limit
    };

    let { data, error } = await supabase
        .from('classroom')
        .insert([newClassroom]);

    if (error) return res.status(500).json({ error: error.message });
    res.json(newClassroom);
});

// Update a classroom by id
router.patch('/:id', async (req, res) => {
    const classroom_id = req.params.classroom_id;
    const updates = {
        inst_id,
        academic_year,
        semester,
        course_name,
        course_code,
        course_desc,
        classroom_limit
    };
    let { data, error } = await supabase
        .from('classroom')
        .update(updates)
        .eq('classroom_id', classroom_id);

    if (error) return res.status(500).json({ error: error.message });
    if (data.length === 0) return res.status(404).json({ error: 'Classroom not found' });
    res.json({ message: 'Classroom updated successfully', data });
});

// Delete a classroom by id
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    let { data, error } = await supabase
        .from('classroom')
        .delete()
        .eq('classroom_id', id);
    
    if (error) 
        return res.status(500).json({ error: error.message });
    else 
        return res.status(200).json({ message: 'Classroom deleted successfully' });
    // if (!data || data.length === 0) 
    //     return res.status(404).json({ error: 'Classroom not found' });
    // res.json({ message: 'Classroom deleted successfully' });
});

module.exports = router;