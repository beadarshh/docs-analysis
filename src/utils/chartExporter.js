import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Papa from 'papaparse';

/**
 * Captures a DOM element as a PNG and downloads it.
 */
export const downloadChartAsPng = async (ref, filename) => {
  if (!ref.current) return;
  
  try {
    const canvas = await html2canvas(ref.current, {
      backgroundColor: "#FFFFFF",
      scale: 2, // Higher quality
      logging: false,
      useCORS: true
    });
    
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${filename}.png`;
    link.click();
  } catch (error) {
    console.error("Chart export failed:", error);
  }
};

/**
 * Captures a DOM element as a PDF and downloads it.
 */
export const downloadChartAsPdf = async (ref, filename) => {
  if (!ref.current) return;
  
  try {
    const canvas = await html2canvas(ref.current, {
      backgroundColor: "#FFFFFF",
      scale: 2,
      logging: false,
      useCORS: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("PDF export failed:", error);
  }
};

/**
 * Downloads raw chart data as CSV.
 */
export const downloadDataAsCsv = (data, filename) => {
  if (!data || data.length === 0) return;
  
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
