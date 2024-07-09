# Semaklah

Welcome to Semaklah, the Final Year Project designed to showcase innovative solutions and comprehensive research. This project aims to make grading and providing feedback more efficient, thus helping instructors to save time while making sure students can receive timely feedback vital for improving student academic outcomes.

## Getting Started

To get started with Semaklah, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/JiaaaJiaa/semaklah.git

2. **Open a terminal to navigate to the frontend folder**
    ```bash 
    cd semaklah/frontend

3. **Open another terminal for backend folder**
    ```bash
    cd semaklah/backend    

3. **Install Dependencies for both frontend and backend**
    ```bash 
    npm install

4. **Notes**
    ```
    You will need a .env file (the key to access database)
    ```

## To run the application

1. **To run backend, navigate to backend folder**
    ```bash
    npm run dev

2. **To run frontend, navigate to the frontend folder**
    ```bash
    npm run start

## Highlighted Features:

Semaklah performs digital text extraction and applies natural language processing for automatic language quality evaluation (i.e., spelling and grammatical error checking). 

Semaklah generates feedback suggestions by finding similar text segments with historical feedback from all submissions within the same assignment. Instructors can then choose to accept the suggested feedback as it is or edit the feedback. 

## Technology used:

Version Control		    : GitHub

Database			    : Supabase

Frameworks		        : React.js, as the front-end framework. 
                          Node.js, as the backend framework.

Library			    	: scikit-learn, language-tool-python

## File Directory

```
|- backend
    |- config
    |- controller
    |- middleware
    |- python // Python script
    |- routes // All the backend routes
    |- server.js
|- data
    |- assignment.csv
    |- classroom.csv
    |- isntructor.csv
    |- student.csv
|- frontend
    |- src
    |- assets
    |- components // store different components in pages
        |- assignment 
        |- classroom
        |- enrolledstudent
        |- feedback
        |- grading
        |- student
        |- submission
    |- navbar.js 
    |- config 
        |- supabaseClient.js
    |- hooks
        |- useAuthContext.js
        |- useClassroomContext.js
        |- useLogin.js
        |- useLogout.js
        |- useSignup.js
    |- pages // store different pages for users
        |- Instructor
        |- Student
        |- loading.js
        |- Login.js
        |- Signup.js
    |- App.js
    |- Home.js
    |- index.js
```    
    
Thank you for exploring Semaklah!
