import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates a comprehensive PDF report of the analysis.
 */
export const generateFullPdfReport = async (documents) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPos = 20;

  // Helper for adding footer
  const addFooter = (pageNum) => {
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    pdf.text("DKA Analyzer | Diplomatic Knowledge Analysis", 20, pageHeight - 10);
  };

  // Title Page
  pdf.setFillColor(243, 244, 246); // slate-100
  pdf.rect(0, 0, pageWidth, 60, 'F');
  
  yPos = 30;
  pdf.setFontSize(28);
  pdf.setTextColor(30, 41, 59); // slate-800
  pdf.setFont('helvetica', 'bold');
  pdf.text("DKA Analyzer Report", 20, yPos);
  
  yPos += 12;
  pdf.setFontSize(10);
  pdf.setTextColor(100, 116, 139); // slate-500
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Project Integrity Export | ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, yPos);

  yPos = 80;
  pdf.setFontSize(18);
  pdf.setTextColor(79, 70, 229); // indigo-600
  pdf.setFont('helvetica', 'bold');
  pdf.text("1. Project Summary", 20, yPos);

  yPos += 12;
  pdf.setFontSize(11);
  pdf.setTextColor(71, 85, 105); // slate-600
  pdf.setFont('helvetica', 'normal');
  
  const summaryText = `This document provides a comprehensive audit trail of diplomatic discourse analyzed between UN General Assembly Speeches and G20 Declarations. The study utilizes frequency analysis and thematic clustering to identify shifts in global priorities, specifically focusing on multilateral reform and Global South representation.`;
  const splitText = pdf.splitTextToSize(summaryText, pageWidth - 40);
  pdf.text(splitText, 20, yPos);

  yPos += 35;
  pdf.setFontSize(16);
  pdf.setTextColor(30, 41, 59);
  pdf.setFont('helvetica', 'bold');
  pdf.text("2. Analytical Composition", 20, yPos); yPos += 10;
  
  pdf.setFontSize(10);
  pdf.setTextColor(71, 85, 105);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`• Total Documents Analyzed: ${documents.length}`, 25, yPos); yPos += 7;
  pdf.text(`• Temporal Horizon: ${Math.min(...documents.map(d => d.year))} - ${Math.max(...documents.map(d => d.year))}`, 25, yPos); yPos += 7;
  pdf.text(`• UN Speeches included: ${documents.filter(d => d.type === "UN Speech").length}`, 25, yPos); yPos += 7;
  pdf.text(`• G20 Declarations included: ${documents.filter(d => d.type === "G20 Declaration").length}`, 25, yPos); yPos += 7;

  addFooter(1);

  // Next Page: DOCUMENT INVENTORY
  pdf.addPage();
  yPos = 20;
  pdf.setFontSize(18);
  pdf.setTextColor(30, 41, 59);
  pdf.setFont('helvetica', 'bold');
  pdf.text("3. Document Inventory", 20, yPos);
  
  yPos += 15;
  // Table Header
  pdf.setFillColor(79, 70, 229); // indigo-600
  pdf.rect(20, yPos, pageWidth - 40, 10, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Year", 25, yPos + 6.5);
  pdf.text("Type", 45, yPos + 6.5);
  pdf.text("Document Name", 85, yPos + 6.5);
  pdf.text("Words", 175, yPos + 6.5);

  yPos += 15;
  pdf.setTextColor(71, 85, 105);
  pdf.setFont('helvetica', 'normal');
  
  let pageNum = 2;
  documents.forEach((doc, idx) => {
    if (yPos > 270) {
      addFooter(pageNum);
      pdf.addPage();
      pageNum++;
      yPos = 25;
      // Repeat header
      pdf.setFillColor(79, 70, 229);
      pdf.rect(20, yPos - 5, pageWidth - 40, 10, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Year", 25, yPos + 1.5);
      pdf.text("Type", 45, yPos + 1.5);
      pdf.text("Document Name", 85, yPos + 1.5);
      pdf.text("Words", 175, yPos + 1.5);
      yPos += 10;
      pdf.setTextColor(71, 85, 105);
      pdf.setFont('helvetica', 'normal');
    }
    
    // Alternating rows
    if (idx % 2 === 0) {
       pdf.setFillColor(248, 250, 252);
       pdf.rect(22, yPos - 4.5, pageWidth - 44, 7, 'F');
    }

    pdf.text(doc.year.toString(), 25, yPos);
    pdf.text(doc.type === "UN Speech" ? "UN" : "G20", 45, yPos);
    pdf.text(doc.name.length > 50 ? doc.name.substring(0, 48) + "..." : doc.name, 85, yPos);
    pdf.text(doc.wordCount.toLocaleString(), 175, yPos);
    yPos += 7;
  });

  addFooter(pageNum);

  // Final Page: THEME EXPLORATION
  pdf.addPage();
  pageNum++;
  yPos = 20;
  pdf.setFontSize(18);
  pdf.setTextColor(30, 41, 59);
  pdf.setFont('helvetica', 'bold');
  pdf.text("4. Thematic Saturation Index", 20, yPos);
  
  yPos += 15;
  pdf.setFontSize(11);
  pdf.setTextColor(71, 85, 105);
  pdf.setFont('helvetica', 'normal');
  pdf.text("The following keywords were prioritized during the automated frequency crawl:", 20, yPos);
  
  yPos += 12;
  const keywords = [...new Set(documents.flatMap(d => Object.keys(d.keywordFrequencies)))];
  const kwString = keywords.join(", ");
  const kwSplit = pdf.splitTextToSize(kwString, pageWidth - 40);
  pdf.text(kwSplit, 20, yPos);

  addFooter(pageNum);
  pdf.save("dka_comprehensive_analysis.pdf");
};
