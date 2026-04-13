import * as pdfjsLib from 'pdfjs-dist';

// Setting the worker URL from CDN as requested
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

/**
 * Extracts plain text from a PDF file.
 * 
 * @param {File} file 
 * @param {Function} onProgress Optional callback for progress updates
 * @returns {Promise<string>}
 */
export const extractTextFromPDF = async (file, onProgress) => {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  let fullText = "";

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(" ");
    fullText += pageText + "\n";
    
    if (onProgress) {
      onProgress(Math.round((i / numPages) * 100));
    }
  }

  return fullText;
};
