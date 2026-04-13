import JSZip from 'jszip';

/**
 * Bundles extracted text as TXT files into a ZIP.
 */
export const bundleAsZip = async (documents) => {
  const zip = new JSZip();
  
  documents.forEach(doc => {
    zip.file(`${doc.name}.txt`, doc.plainText);
  });
  
  const content = await zip.generateAsync({ type: "blob" });
  
  const url = URL.createObjectURL(content);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "extracted_texts.zip");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
