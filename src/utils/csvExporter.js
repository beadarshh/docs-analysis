import Papa from 'papaparse';
import { ALL_KEYWORDS } from './keywordGroups';

/**
 * Generates CSV 1: Document Summary
 */
export const exportDocumentSummary = (documents) => {
  const data = documents.map(doc => {
    const row = {
      "Year": doc.year,
      "Document Name": doc.name,
      "Document Type": doc.type,
      "Word Count": doc.wordCount
    };
    
    ALL_KEYWORDS.forEach(kw => {
      row[kw] = doc.keywordFrequencies[kw] || 0;
    });
    
    return row;
  });

  const csv = Papa.unparse(data);
  downloadFile(csv, "document_summary.csv", "text/csv");
};

/**
 * Generates CSV 2: Keyword in Context
 */
export const exportKeywordContext = (documents) => {
  const data = [];
  
  documents.forEach(doc => {
    ALL_KEYWORDS.forEach(kw => {
      const sentences = doc.keywordSentences[kw] || [];
      sentences.forEach(sentence => {
        data.push({
          "Year": doc.year,
          "Document Name": doc.name,
          "Keyword": kw,
          "Sentence": sentence.trim()
        });
      });
    });
  });

  const csv = Papa.unparse(data);
  downloadFile(csv, "keyword_context.csv", "text/csv");
};

/**
 * Trigger file download in browser.
 */
export const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
};
