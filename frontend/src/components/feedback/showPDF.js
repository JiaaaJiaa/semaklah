import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import {defaultLayoutPlugin} from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';


// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';

const ShowPDF = ({fileURL}) => {

    const newplugin = defaultLayoutPlugin();  

    return ( 
        <div className="pt-6 relative">   
            {/* <div className="mb-5 bg-white shadow overflow-hidden sm:rounded-lg p-10">
                {fileURL && <embed src={fileURL} type="application/pdf" width="100%" height="1000px" />}
            </div> */}

            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">                
                {fileURL && 
                        <Viewer fileUrl={fileURL} plugins={[newplugin]} />
                }
            </Worker>
        </div>
     );
}
 
export default ShowPDF;