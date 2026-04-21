import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Papa from 'papaparse';

/**
 * Captures a DOM element as a PNG and downloads it.
 */
export const downloadChartAsPng = async (ref, filename) => {
  if (!ref.current) return;
  
  // Briefly remove any transition classes if they exist (hack for Recharts animations)
  const originalTransition = ref.current.style.transition;
  ref.current.style.transition = 'none';

  try {
    const canvas = await html2canvas(ref.current, {
      backgroundColor: "#FFFFFF",
      scale: 3, // Even higher quality for printing
      logging: false,
      useCORS: true,
      allowTaint: true,
      onclone: (clonedDoc) => {
        // Ensure all elements are visible in the clone
        const el = clonedDoc.querySelector(`[data-html2canvas-ignore]`);
        if (el) el.style.display = 'none';
      }
    });
    
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Chart export failed:", error);
  } finally {
    ref.current.style.transition = originalTransition;
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
      scale: 3,
      logging: false,
      useCORS: true,
      allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
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
  
  // Format data keys for better CSV headers (Sentence Case with spaces, preserve UN/G20)
  const formattedData = data.map(item => {
    const newItem = {};
    Object.entries(item).forEach(([key, value]) => {
      const formattedKey = key
        .replace(/_/g, ' ')
        .replace(/UN/g, 'UN') // Keep UN as is
        .replace(/G20/g, 'G20') // Keep G20 as is
        .replace(/\b([a-z])/g, l => l.toUpperCase()); // Capitalize other words
      newItem[formattedKey] = value;
    });
    return newItem;
  });

  const csv = Papa.unparse(formattedData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
};
