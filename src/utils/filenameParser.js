/**
 * Robust filename parser for UN and G20 documents.
 * 
 * G20 files: "2015_G20.pdf", "2022_G20.pdf"
 * UN files: "UN GD 22.pdf" (2022), "UN GD 2018.pdf", "UNGA GD 2015.pdf"
 * 
 * @param {string} filename 
 * @returns {object} { year, type, name }
 */
export const parseFilename = (filename) => {
  const cleanName = filename.replace(/\.[^/.]+$/, ""); // remove extension
  let year = null;
  let type = "Other";

  // Check for G20 pattern (e.g., "2015_G20")
  if (/G20/i.test(cleanName)) {
    type = "G20 Declaration";
    const yearMatch = cleanName.match(/^\d{4}/);
    if (yearMatch) year = parseInt(yearMatch[0]);
  } 
  // Check for UN pattern (e.g., "UN GD 22", "UN GD 2018")
  else if (/UN/i.test(cleanName)) {
    type = "UN Speech";
    
    // Check for 4-digit year
    const year4Match = cleanName.match(/\d{4}/);
    if (year4Match) {
      year = parseInt(year4Match[0]);
    } else {
      // Check for 2-digit year (e.g., "UN GD 22")
      const year2Match = cleanName.match(/\s(\d{2})$/);
      if (year2Match) {
        year = 2000 + parseInt(year2Match[1]);
      }
    }
  }

  return {
    year,
    type,
    name: cleanName
  };
};
