require('dotenv').config(); // This will load the .env file and add the values to the process.env object

const express = require('express'); 
const classroomRoutes = require('./routes/classroom'); // Import the classroom route

// Create an express app
const app = express();

// Middleware

app.use(express.json()); // This will parse incoming JSON requests

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

// Create a route
app.use('/api/classroom',classroomRoutes);



// lsiten for requests
app.listen(process.env.PORT, () => {
    console.log('Server is listening on port ' + process.env.PORT);
});
