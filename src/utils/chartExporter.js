import html2canvas from 'html2canvas';

/**
 * Captures a DOM element as a PNG and downloads it.
 * 
 * @param {React.RefObject} ref 
 * @param {string} filename 
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
