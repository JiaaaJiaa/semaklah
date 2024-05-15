import { useEffect, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist';
pdfjs.GlobalWorkerOptions.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.js';

const DisplayPDF = ({ fileURL }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    pdfjs.getDocument(fileURL).promise.then(pdfDoc => {
      pdfDoc.getPage(1).then(page => {
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        page.render({ canvasContext: context, viewport: viewport });
      });
    });
  }, [fileURL]);

  return <canvas ref={canvasRef} />;
};

export default DisplayPDF;