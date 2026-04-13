import { parseFilename } from './filenameParser';

export const KEYWORDS = [
  "Global South",
  "equity",
  "reform",
  "representation",
  "multilateralism",
  "developing countries",
  "inclusivity",
  "climate justice",
  "CBDR",
  "UNSC reform",
  "reformed multilateralism",
  "Voice of Global South"
];

/**
 * Normalizes text for analysis.
 */
const normalizeText = (text) => text.replace(/\s+/g, ' ');

/**
 * Analyzes document text for keywords.
 * 
 * @param {string} text 
 * @param {string} filename 
 * @param {object} metadata Manual overrides if any
 * @returns {object}
 */
export const analyzeDocument = (text, filename, metadata = {}) => {
  const parsed = parseFilename(filename);
  const year = metadata.year || parsed.year;
  const type = metadata.type || parsed.type;
  
  const normalizedText = normalizeText(text);
  const wordCount = text.trim().split(/\s+/).length;
  
  const keywordFrequencies = {};
  const keywordSentences = {};

  // Sentence splitting regex as requested
  const sentences = normalizedText.split(/(?<=[.!?])\s+(?=[A-Z])/).filter(s => s.length > 20);

  KEYWORDS.forEach(keyword => {
    // Exact phrase match regex as requested
    const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    
    // Calculate frequency
    const matches = normalizedText.match(regex);
    keywordFrequencies[keyword] = matches ? matches.length : 0;
    
    // Extract context sentences
    keywordSentences[keyword] = sentences.filter(sentence => {
      const sentenceRegex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      return sentenceRegex.test(sentence);
    });
  });

  return {
    name: filename,
    year,
    type,
    wordCount,
    keywordFrequencies,
    keywordSentences,
    plainText: text
  };
};

/**
 * Removes stopwords and generates word frequency for word clouds.
 */
export const getFilteredWordCount = (text) => {
  const stopwords = ["the", "a", "an", "is", "are", "was", "were", "in", "on", "at", "to", "for", "of", "and", "or", "but", "with", "that", "this", "it", "be", "as", "by", "from", "not", "we", "our", "have", "has", "will", "all", "their", "which", "also", "been", "more", "its", "they", "them"];
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopwords.includes(word));

  const freq = {};
  words.forEach(w => freq[w] = (freq[w] || 0) + 1);

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([text, value]) => ({ text, value }));
};
