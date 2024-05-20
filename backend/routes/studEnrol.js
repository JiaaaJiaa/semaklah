const express = require('express');
const supabase = require('../config/supabaseClient');

const router = express.Router();

// Get students info for feedback page
router.get('/feedback/:enrol_id', async (req, res) => {
    const enrol_id = req.params.enrol_id;

    // from enrol entity get stud_id and student info from student entity
    let { data, error } = await supabase
        .from('enrol')
        .select('stud_id, student(*)')
        .eq('enrol_id', enrol_id)
        .single();

    if (error) {
        return res.status(400).json({ error });
    } else {
        return res.status(200).json(data);
    }
})

// Get all students enrolled in a classroom
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    let { data, error } = await supabase
        .from('enrol')
        .select('enrol_id, student(*)')
        .eq('classroom_id', id)
        .order('stud_id', { ascending: true });

    // console.log("Data:",data);

    if (error) {
        return res.status(400).json({ error });
    } else {
        return res.status(200).json(data);
    }
});

// Enrol a student in a classroom
router.post('/', async (req, res) => {
    const { stud_id, classroom_id } = req.body;

    // console.log("Backend",stud_id, classroom_id);

    try{
        // Check if the student exists
        let { data: student, error: studentError } = await supabase
            .from('student')
            .select('*')
            .eq('stud_id', stud_id);

        if (student && student.length === 0) {
            return res.status(400).json({ error: 'Student has not registered yet' });
        }

        // Fetch the classroom from the database
        let { data: classroom, error } = await supabase
            .from('classroom')
            .select('current_enrolment, classroom_limit')
            .eq('classroom_id', classroom_id)
            .single();

        if (error) throw error;

        // Check if the classroom is full
        if (classroom.current_enrolment >= classroom.classroom_limit) {
            return res.status(400).json({ error: 'Classroom is full' });
        }

        // Check if the student is already enrolled in the classroom
        let { data: existingEnrol, error: existingEnrolError } = await supabase
            .from('enrol')
            .select('*')
            .eq('stud_id', stud_id)
            .eq('classroom_id', classroom_id);

        if (existingEnrol.length > 0) {
            return res.status(400).json({ error: 'Student is already enrolled in the classroom' });
        }

        // Enrol the student in the classroom
        let { data, error:enrolError } = await supabase
            .from('enrol')
            .insert([{ stud_id, classroom_id }])
            .select('student(*)');

        if(enrolError) throw enrolError;

        // console.log("Check Data:",data)

        // Increment the current_enrolment value
        let updatedEnrollment = classroom.current_enrolment + 1;

        // Update the classroom in the database
        let { error: updateError } = await supabase
            .from('classroom')
            .update({ current_enrolment: updatedEnrollment })
            .eq('classroom_id', classroom_id);

        if (updateError) throw updateError;

        return res.status(200).json(data[0]);
    }catch(error){
        return res.status(400).json({ error: error.message });
    }
});

// Delete a student from a classroom
router.delete('/', async (req, res) => {
    const { stud_id, classroom_id } = req.body;

    //Fetch the students that will be deleted
    let{data: student, error: studentError} = await supabase
        .from('enrol')
        .select('*')
        .eq('stud_id', stud_id)
        .eq('classroom_id', classroom_id);

    if (studentError) {
        return res.status(400).json({ error: studentError });
    }

    let { data, error } = await supabase
        .from('enrol')
        .delete()
        .eq('stud_id', stud_id)
        .eq('classroom_id', classroom_id);

    if (error) {
        return res.status(400).json({ error });
    } 
    
    // Decrease the current_enrolment value
    let { data:classroom, error: classroomError } = await supabase
        .from('classroom')
        .select('current_enrolment')
        .eq('classroom_id', classroom_id)
        .single();

    if (classroomError) {
        return res.status(400).json({ error: classroomError });
    }
    classroom.current_enrolment -= 1;

    let { data: updatedClassroom, updateError } = await supabase
        .from('classroom')
        .update({ current_enrolment: classroom.current_enrolment })
        .eq('classroom_id', classroom_id)
        .single();

    if (updateError) {
        return res.status(400).json({ error: updateError });
    }
        
    return res.status(200).json(student);
     
});

module.exports = router;