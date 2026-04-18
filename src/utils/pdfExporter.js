import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates a comprehensive PDF report of the analysis.
 */
export const generateFullPdfReport = async (documents) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPos = 20;

  // Title Page
  pdf.setFontSize(28);
  pdf.setTextColor(30, 41, 59); // slate-800
  pdf.text("DKA Analyzer Report", 20, yPos);
  
  yPos += 10;
  pdf.setFontSize(10);
  pdf.setTextColor(148, 163, 184); // slate-400
  pdf.text(`Generated on ${new Date().toLocaleDateString()} | ${documents.length} Documents Analyzed`, 20, yPos);

  yPos += 20;
  pdf.setFontSize(16);
  pdf.setTextColor(79, 70, 229); // indigo-600
  pdf.text("Project Summary", 20, yPos);

  yPos += 10;
  pdf.setFontSize(11);
  pdf.setTextColor(71, 85, 105); // slate-600
  
  const summaryText = `This report contains an analysis of diplomatic discourse across UN Speeches and G20 Declarations. The study focuses on keyword saturation, temporal trends, and thematic clusters of the Global South and multilateral reform.`;
  const splitText = pdf.splitTextToSize(summaryText, pageWidth - 40);
  pdf.text(splitText, 20, yPos);

  yPos += 25;
  pdf.setFontSize(14);
  pdf.setTextColor(30, 41, 59);
  pdf.text("Document Inventory", 20, yPos);
  
  yPos += 10;
  // Simple table header
  pdf.setFillColor(248, 250, 252);
  pdf.rect(20, yPos, pageWidth - 40, 8, 'F');
  pdf.setFontSize(9);
  pdf.text("Year", 25, yPos + 5);
  pdf.text("Type", 45, yPos + 5);
  pdf.text("Document Name", 85, yPos + 5);
  pdf.text("Word Count", 160, yPos + 5);

  yPos += 12;
  documents.slice(0, 15).forEach((doc, idx) => {
    if (yPos > 270) {
      pdf.addPage();
      yPos = 20;
    }
    pdf.text(doc.year.toString(), 25, yPos);
    pdf.text(doc.type, 45, yPos);
    pdf.text(doc.name.substring(0, 30), 85, yPos);
    pdf.text(doc.wordCount.toString(), 160, yPos);
    yPos += 7;
  });

  if (documents.length > 15) {
    pdf.text(`... and ${documents.length - 15} more documents.`, 25, yPos);
  }

  // Next Page: Thematic Analysis
  pdf.addPage();
  yPos = 20;
  pdf.setFontSize(20);
  pdf.text("Thematic Clustering", 20, yPos);
  
  const keywords = [...new Set(documents.flatMap(d => Object.keys(d.keywordFrequencies)))];
  yPos += 15;
  pdf.setFontSize(11);
  pdf.text("Keywords track prioritized including:", 20, yPos);
  
  yPos += 10;
  const kwString = keywords.slice(0, 20).join(", ") + (keywords.length > 20 ? "..." : "");
  const kwSplit = pdf.splitTextToSize(kwString, pageWidth - 40);
  pdf.text(kwSplit, 20, yPos);

  pdf.save("dka_analysis_report.pdf");
};
