const express = require('express');
const supabase = require('../config/supabaseClient');

const router = express.Router();
const { spawn } = require('child_process');

// Update spelling and grammar error
router.post('/', async (req, res) => {
    const { sub_id, file } = req.body;

    // console.log('submission_ID:', sub_id);
    // console.log('File:', file);

    const { data, error } = await supabase.storage.from('assignment').download(file);

    if (error) {
        console.error('Error downloading file:', error.message);
    }else{
        const python = spawn('python', ['./python/pdflexical.py']);

        // Convert the Blob to a Buffer and write it to the Python script's stdin
        const buffer = Buffer.from(await data.arrayBuffer());
        // Write the file data to the Python script's stdin
        python.stdin.write(buffer);
        python.stdin.end();

        let pythonData = '';
        python.stdout.on('data', (data) => {
            pythonData += data.toString();
        });
        
        //
        // This is the error handling for the Python script
        //
        python.on('error', (error) => {
            console.error(`Error spawning Python process: ${error.message}`);
            return res.status(500).json({ error: `Error spawning Python process: ${error.message}` });
        });

        python.stderr.on('data', (data) => {
            console.error(`Python stderr: ${data}`);
        });

        // This is the exit code handling for the Python script
        python.on('close', (code) => {
            if (code !== 0) {
                return res.status(500).json({ error: 'Error running Python script' });
            } else {
                // Parse the Python script output
                const analysisResult = JSON.parse(pythonData);
        
                // Extract the spelling and grammar results
                const spelling = analysisResult.spelling;
                const grammar = analysisResult.grammar;
        
                console.log(`Spelling: ${spelling}, Grammar: ${grammar}`);
                
                // console.log(`Spelling: ${spelling}, Type: ${typeof spelling}`);
                // console.log(`Grammar: ${grammar}, Type: ${typeof grammar}`);
                
                // Update the spelling and grammar in database

                const updateSpellingAndGrammar = async () => {

                    const { data: subdata, error } = await supabase
                        .from('submission')
                        .update({ spelling, grammar })
                        .eq('sub_id', sub_id);

                    if (error) {
                        console.error('Error updating spelling and grammar:', error.message);
                        return res.status(500).json({ error: 'Error updating spelling and grammar' });
                    }else{
                        console.log('Spelling and grammar updated successfully');
                        return res.status(200).json(subdata);
                    }
                };

                updateSpellingAndGrammar();
               
            }
        });
    }

});

module.exports = router;