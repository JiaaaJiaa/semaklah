const express = require('express');
const supabase = require('../config/supabaseClient');

const router = express.Router();

// Get all classrooms
router.get('/', async (req, res) => { 

    const userId = req.query.userId;

    // console.log('userId:', userId);

    // Get all classroom from the database
    let {data,error} = await supabase
        .from('classroom')
        .select('*')
        .eq('inst_id', userId)
        .order('created_at', { ascending: false });
    
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

// Create a new classroom
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
        .insert([newClassroom])
        .select();

    // console.log('Classroom:', newClassroom)
    // console.log('data:', data);
    // console.log('error:', error);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// Update a classroom by id
router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const { inst_id, academic_year, semester, course_name, course_code, course_desc, classroom_limit } = req.body;

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
        .eq('classroom_id', id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    // if (data.length === 0) return res.status(404).json({ error: 'Classroom not found' });
    res.json(data[0]);
});

// Delete a classroom by id
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    // Fetch the classroom to be deleted
    let { data: classroom, error: fetchError } = await supabase
        .from('classroom')
        .select('*')
        .eq('classroom_id', id);

    if (fetchError) 
        return res.status(500).json({ error: fetchError.message });

    // console.log('classroom to delete:', classroom);

    // Delete the classroom
    let { error: deleteError } = await supabase
        .from('classroom')
        .delete()
        .eq('classroom_id', id);

    if (deleteError) 
        return res.status(500).json({ error: deleteError.message });

    return res.status(200).json(classroom[0]);
});

module.exports = router;