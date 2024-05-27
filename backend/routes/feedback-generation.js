const express = require('express');
const supabase = require('../config/supabaseClient');

const router = express.Router();

const { spawn } = require('child_process');

// Import the 'fs' module
const fs = require('fs');

// Get all feedbacks
router.post('/', async (req, res) => {
    const {assign_id, specific_sentence} = req.body;

    console.log('Assign ID:', assign_id);
    console.log('Specific Sentence:', specific_sentence);

    const { data: submissions, error: submissionsError } = await supabase
    .from('submission')
    .select('sub_id')
    .eq('assign_id', assign_id);

    console.log('Submissions:', submissions);

    if (submissionsError) {
        console.error('Error:', submissionsError.message);
        return res.status(500).json({ error: 'Error' });
    }
    const submissionIds = submissions.map(submission => submission.sub_id);

    console.log('Submission IDs:', submissionIds);

    const { data: feedbacks, error: feedbacksError } = await supabase
        .from('feedbacktext')
        .select('feedback')
        .in('sub_id', submissionIds);

    console.log('Feedbacks:', feedbacks);

    if (!feedbacks || feedbacks.length === 0 || feedbacks.every(feedback => feedback.feedback === null)) {
        console.log('checking');
        return res.status(200).json({ message: 'Insufficient feedback' });
    }

    if (feedbacksError) {
        console.error('Error downloading file:', error.message);
        return res.status(500).json({ error: 'Error downloading file' });
    }else{
        const documents = feedbacks
            .filter(item => item.feedback !== null)
            .flatMap(item => item.feedback.map(feedbackItem => feedbackItem.quote));
        
        const feedback = feedbacks
            .filter(item => item.feedback !== null)
            .flatMap(item => item.feedback.map(feedbackItem => feedbackItem.content));
        
        if (feedback.length < 3) {
            return res.status(200).json({ message: 'Insufficient feedback' });
        }
    
        let pythonOutput = '';
        const python = spawn('python', ['./python/tf-idf.py'], {
            stdio: [null, null, null, 'ipc']
        });
        python.stdin.write(JSON.stringify({
            documents,
            feedback,
            specific_sentence
        }));
        python.stdin.end();

        python.stdout.on('data', (data) => {
            pythonOutput += data.toString();
        });

        python.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        python.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            const output = JSON.parse(pythonOutput);     
            return res.status(200).json(output);  

        });

    }
});

// // Update vectorizer and tfidf matrix
// router.post('/vectorizer/', async (req, res) => {
//     const {assign_id} = req.body;  

//     const { data: submissions, error: submissionsError } = await supabase
//     .from('submission')
//     .select('sub_id')
//     .eq('assign_id', assign_id);

//     if (submissionsError) {
//         console.error('Error:', submissionsError.message);
//         return res.status(500).json({ error: 'Error' });
//     }
//     const submissionIds = submissions.map(submission => submission.sub_id);

//     const { data: feedbacks, error: feedbacksError } = await supabase
//         .from('feedbacktext')
//         .select('feedback')
//         .in('sub_id', submissionIds);

//     if (feedbacksError) {
//         console.error('Error downloading file:', error.message);
//         return res.status(500).json({ error: 'Error downloading file' });
//     }else{
//         const content = feedbacks
//             .filter(item => item.feedback !== null)
//             .flatMap(item => item.feedback.map(feedbackItem => feedbackItem.quote));
        
//         const feedback = feedbacks
//             .filter(item => item.feedback !== null)
//             .flatMap(item => item.feedback.map(feedbackItem => feedbackItem.content));
            
//         let pythonOutput = '';
//         const python = spawn('python', ['./python//vectorizer.py'], {
//             stdio: [null, null, null, 'ipc']
//         });

//         python.stdin.write(JSON.stringify(content));
//         python.stdin.end();

//         python.stdout.on('data', (data) => {
//             pythonOutput += data.toString();
//         });

//         python.stderr.on('data', (data) => {
//             console.error(`stderr: ${data}`);
//         });

//         python.on('close', (code) => {
//             console.log(`child process exited with code ${code}`);
//             const { vectorizer, tfidfMatrix } = JSON.parse(pythonOutput);
            
//             // console.log(vectorizer);
//             // console.log(tfidfMatrix);
            
//             // Convert the arrays to strings
//             const vectorizer_string = JSON.stringify(vectorizer);
//             const tfidfMatrix_string = JSON.stringify(tfidfMatrix);

//             // Write the data to files
//             fs.writeFileSync('vectorizer', vectorizer_string);
//             fs.writeFileSync('tfidfMatrix', tfidfMatrix_string);

//             // Read the files into Buffer objects
//             const vectorizerBuffer = fs.readFileSync('vectorizer');
//             const tfidfMatrixBuffer = fs.readFileSync('tfidfMatrix');

//             // Remove and upload the vectorizer file
//             supabase
//                 .storage
//                 .from('feedback-generation')
//                 .remove([`${assign_id}_vectorizer`])
//                 .then(({ data, error }) => {
//                     if (error) console.error('Error removing vectorizer:', error.message);

//                     supabase
//                         .storage
//                         .from('feedback-generation')
//                         .upload(`${assign_id}_vectorizer`, vectorizerBuffer)
//                         .then(({ data, error }) => {
//                             if (error) {
//                                 console.error('Error uploading vectorizer:', error.message);
//                                 return res.status(500).json({ error: 'Error uploading vectorizer' });
//                             }

//                             // console.log('Vectorizer uploaded successfully');
//                         });
//                 });

//             // Remove and upload the tfidfMatrix file
//             supabase
//                 .storage
//                 .from('feedback-generation')
//                 .remove([`${assign_id}_tfidfMatrix`])
//                 .then(({ data, error }) => {
//                     if (error) console.error('Error removing tfidfMatrix:', error.message);

//                     supabase
//                         .storage
//                         .from('feedback-generation')
//                         .upload(`${assign_id}_tfidfMatrix`, tfidfMatrixBuffer)
//                         .then(({ data, error }) => {
//                             if (error) {
//                                 console.error('Error uploading tfidfMatrix:', error.message);
//                                 return res.status(500).json({ error: 'Error uploading tfidfMatrix' });
//                             }

//                             // console.log('TfidfMatrix uploaded successfully');
//                         });
//                 });

//                 // store the filepath of vectorizer, tfidfMatrix and documents in the database
//                 const asyncFunction = async () => {
//                     const { data: updateData, error: updateError } = await supabase
//                         .from('vectorizers')
//                         .select('*')
//                         .eq('assign_id', assign_id);

//                     if (updateData.length === 0) {
//                         const { data: insertData, error: insertError } = await supabase
//                             .from('vectorizers')
//                             .insert({
//                                 assign_id: assign_id,
//                                 vectorizer: `${assign_id}_vectorizer`,
//                                 tfidfvector: `${assign_id}_tfidfMatrix`,
//                                 documents: content,
//                                 feedbacks: feedback
//                             });

//                             if (insertError) {
//                                 console.error('Error inserting vectorizer and tfidfMatrix:', insertError.message);
//                                 return res.status(500).json({ error: 'Error inserting vectorizer and tfidfMatrix' });
//                             }
//                         }else{
//                             const { data: updateData, error: updateError } = await supabase
//                             .from('vectorizers')
//                             .update({
//                                 vectorizer: `${assign_id}_vectorizer`,
//                                 tfidfvector: `${assign_id}_tfidfMatrix`,
//                                 documents: content,
//                                 feedbacks: feedback
//                             })
//                             .eq('assign_id', assign_id);

//                             if (updateError) {
//                                 console.error('Error updating vectorizer and tfidfMatrix:', updateError.message);
//                                 return res.status(500).json({ error: 'Error updating vectorizer and tfidfMatrix' });
//                             }
//                         }

//                     if (updateError) {
//                         console.error('Error updating vectorizer and tfidfMatrix:', updateError.message);
//                         return res.status(500).json({ error: 'Error updating vectorizer and tfidfMatrix' });
//                     }

//                     return res.status(200).json({updateData});
//                 };

//                 asyncFunction();

//         });

//     }
// });

// // Generate feedback
// router.post('/generate/', async (req, res) => {
//     const {assign_id, sentence} = req.body;


//     // Read the vectorizer and tfidfMatrix files
//     const { data: vectorizer, error: vectorizerError } = await supabase
//         .storage
//         .from('feedback-generation')
//         .download(`${assign_id}_vectorizer`);

//     if (vectorizerError) {
//         console.error('Error downloading vectorizer:', vectorizerError.message);
//         return res.status(500).json({ error: 'Error downloading vectorizer' });
//     }

//     const { data: tfidfMatrix, error: tfidfMatrixError } = await supabase
//         .storage
//         .from('feedback-generation')
//         .download(`${assign_id}_tfidfMatrix`);

//     if (tfidfMatrixError) {
//         console.error('Error downloading tfidfMatrix:', tfidfMatrixError.message);
//         return res.status(500).json({ error: 'Error downloading tfidfMatrix' });
//     }

//     const { data: documents, error: documentsError } = await supabase
//         .from('vectorizers')
//         .select('documents, feedbacks')
//         .eq('assign_id', assign_id);

//     if (documentsError) {
//         console.error('Error:', documentsError.message);
//         return res.status(500).json({ error: 'Error' });
//     }

//     // store documents and feedbacks in an array
//     const documentsArray = documents.map(doc => doc.documents).flat();
//     const feedbacksArray = documents.map(doc => doc.feedbacks).flat();


//     // Convert the Blob objects to strings
//     const vectorizerString = await vectorizer.text();
//     const tfidfMatrixString = await tfidfMatrix.text();

//     // console.log(vectorizerArray);

//     let pythonOutput = '';

//     const python = spawn('python', ['./python/cosine-similarity.py'], {
//         stdio: [null, null, null, 'ipc']
//     });

//     python.stdin.write(JSON.stringify({ 
//         vectorizer: vectorizerString, 
//         tfidfMatrix: tfidfMatrixString, 
//         sentence: sentence, 
//         documents: documentsArray, 
//         feedbacks: feedbacksArray
//     }));

//     python.stdin.end();

//     python.stdout.on('data', (data) => {
//         pythonOutput += data.toString();
//     });

//     python.stderr.on('data', (data) => {
//         console.error(`stderr: ${data}`);
//     });

//     python.on('close', (code) => {
//         console.log(`child process exited with code ${code}`);
//         const feedback = JSON.parse(pythonOutput);

//         // console.log(feedback);
//         return res.status(200).json(feedback);
//     });

//     // return res.status(200).json({ message: 'Feedback generated' });

    
// });

module.exports = router;

// router.get('/', async (req, res) => {
//     const {assign_id} = req.body;  

//     // Get the ids from the submission table that match the assign_id
//     const { data: submissionData, error: submissionError } = await supabase
//         .from('submission')
//         .select('sub_id')
//         .eq('assign_id', assign_id);

//     if (submissionError) {
//         console.error('Error:', submissionError.message);
//         return res.status(500).json({ error: 'Error' });
//     }

//     // Get the feedback from the feedbacktext table that match the ids
//     const { data: feedbackData, error: feedbackError } = await supabase
//         .from('feedbacktext')
//         .select('feedback')
//         .in('sub_id', submissionData.map(submission => submission.sub_id));

//     if (feedbackError) {
//         console.error('Error:', feedbackError.message);
//         return res.status(500).json({ error: 'Error' });
//     }

//     console.log(feedbackData);
//     return res.status(200).json(feedbackData);
// });