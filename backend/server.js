require('dotenv').config(); // This will load the .env file and add the values to the process.env object

const express = require('express'); 
const classroomRoutes = require('./routes/classroom'); // Import the classroom route
// const instRoutes = require('./routes/instructor'); // Import the instructor route
const enrollRoutes = require('./routes/enrol'); // Import the enroll route
// Create an express app
const studenrolRoutes = require('./routes/studEnrol'); // Import the studEnrol route
const assignmentRoutes = require('./routes/assignment'); // Import the assignment route
const submissionRoutes = require('./routes/submission'); // Import the submission route
const feedbackRoutes = require('./routes/feedback'); // Import the feedback route
const pythoncodeRoutes = require('./routes/pythoncode'); // Import the pythoncode route
const gradingrubricRoutes = require('./routes/gradingrubric'); // Import the grading route
const gradingRoutes = require('./routes/grading'); // Import the grading route
const app = express();

// Middleware

app.use(express.json()); // This will parse incoming JSON requests

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

// app.use('/InsHomepage',instRoutes);
// Routes
app.use('/api/grading',gradingRoutes); // This will use the grading route when the path is '/api/grading'
app.use('/api/gradingrubric',gradingrubricRoutes); // This will use the grading route when the path is '/api/grading'
app.use('/api/pythoncode',pythoncodeRoutes); // This will use the pythoncode route when the path is '/api/pythoncode'
app.use('/api/feedback',feedbackRoutes); // This will use the feedback route when the path is '/api/feedback'
app.use('/api/submission',submissionRoutes);
app.use('/api/assignment',assignmentRoutes);
app.use('/api/studentEnrol',studenrolRoutes);
app.use('/api/enrol',enrollRoutes);
app.use('/api/classroom',classroomRoutes);

// lsiten for requests
app.listen(process.env.PORT, () => {
    console.log('Server is listening on port ' + process.env.PORT);
});
