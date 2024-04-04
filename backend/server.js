require('dotenv').config(); // This will load the .env file and add the values to the process.env object

const express = require('express'); 
const classroomRoutes = require('./routes/classroom'); // Import the classroom route
// const instRoutes = require('./routes/instructor'); // Import the instructor route
const enrollRoutes = require('./routes/enrol'); // Import the enroll route
// Create an express app
const studenrolRoutes = require('./routes/studEnrol'); // Import the studEnrol route
const assignmentRoutes = require('./routes/assignment'); // Import the assignment route
const app = express();

// Middleware

app.use(express.json()); // This will parse incoming JSON requests

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

// app.use('/InsHomepage',instRoutes);
// Routes
app.use('/api/assignment', assignmentRoutes);
app.use('/api/studentEnrol',studenrolRoutes);
app.use('/api/enrol',enrollRoutes);
app.use('/api/classroom',classroomRoutes);

// lsiten for requests
app.listen(process.env.PORT, () => {
    console.log('Server is listening on port ' + process.env.PORT);
});
