const express = require('express');
const supabase = require('../config/supabaseClient');

const router = express.Router();

// Get all assignment by a single classroom id
router.get('/', async (req, res) => {
const classroomId = req.query.classroomId;

// Get all assignment from the database
let { data, error } = await supabase
    .from('assignment')
    .select('*')
    .eq('classroom_id', classroomId)
    .order('created_at', { ascending: false });

if (error) {
    return res.status(400).json({ error: error.message });
} else {
    return res.status(200).json(data);
}
});

// Get a single assignment by id
router.get('/:id', async (req, res) => {
const id = req.params.id;

// Get a single assignment from the database
let { data, error } = await supabase
    .from('assignment')
    .select('*')
    .eq('assign_id', id);

if (error) {
    return res.status(400).json({ error: error.message });
} else {
    return res.status(200).json(data[0]);
}
});

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

router.patch('/release/:id', async (req,res)=>{
    const id = req.params.id;
    const { is_released } = req.body;

    const updatedAssignment = {
        is_released
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

// // Get PDF
// router.get('/pdf/*', async (req, res) => {
//     const id = req.params[0];

//     console.log('ID:', id)

//     const { data, error } = await supabase
//         .storage    
//         .from('assignment')
//         .download(id);

//     if (error) {
//         return res.status(400).json({ error: error.message });
//     } else {
//         const url = URL.createObjectURL(data);
//         return res.status(200).send(url);
//     }
// });

module.exports = router;