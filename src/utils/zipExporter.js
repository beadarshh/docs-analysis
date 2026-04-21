import JSZip from 'jszip';

/**
 * Bundles extracted text as TXT files into a ZIP.
 */
export const bundleAsZip = async (documents) => {
  const zip = new JSZip();
  
  // Create a folder for texts
  const textFolder = zip.folder("extracted_texts");
  
  documents.forEach(doc => {
    textFolder.file(`${doc.name}.txt`, doc.plainText);
  });
  
  // Create a simple manifest/index
  const manifest = documents.map(d => `${d.year},${d.type},${d.name},${d.wordCount}`).join("\n");
  zip.file("index.csv", "Year,Type,Filename,WordCount\n" + manifest);
  
  const content = await zip.generateAsync({ type: "blob" });
  
  const url = URL.createObjectURL(content);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "dka_data_archive.zip");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
};
