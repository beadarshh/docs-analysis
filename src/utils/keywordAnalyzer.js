import { parseFilename } from './filenameParser';
import { ALL_KEYWORDS } from './keywordGroups';

/**
 * Normalizes text for analysis.
 */
const normalizeText = (text) => text.toLowerCase().replace(/\s+/g, ' ');

/**
 * Analyzes document text for keywords.
 */
export const analyzeDocument = (text, filename, metadata = {}) => {
  const parsed = parseFilename(filename);
  const year = metadata.year || parsed.year;
  const type = metadata.type || parsed.type;
  
  const normalizedText = normalizeText(text);
  const wordCount = text.trim().split(/\s+/).length;
  
  const keywordFrequencies = {};
  const keywordSentences = {};

  // Improved sentence splitting regex
  const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z])/).filter(s => s.length > 15);

  ALL_KEYWORDS.forEach(keyword => {
    // Escape keyword for regex and handle multi-word phrases correctly
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Word boundary check for smaller words, but allow phrases
    const regex = new RegExp(`(?<=\\s|^)${escapedKeyword}(?=\\s|$|[.,!?;])`, 'gi');
    
    // Calculate frequency
    const matches = normalizedText.match(regex);
    keywordFrequencies[keyword] = matches ? matches.length : 0;
    
    // Extract context sentences - search in original case but match case-insensitive
    keywordSentences[keyword] = sentences.filter(sentence => {
      const sentenceRegex = new RegExp(`(?<=\\s|^)${escapedKeyword}(?=\\s|$|[.,!?;])`, 'i');
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
  const stopwords = [
    "the", "a", "an", "is", "are", "was", "were", "in", "on", "at", "to", "for", "of", "and", "or", "but", "with", 
    "that", "this", "it", "be", "as", "by", "from", "not", "we", "our", "have", "has", "will", "all", "their", 
    "which", "also", "been", "more", "its", "they", "them", "these", "those", "can", "should", "would", "must",
    "such", "than", "very", "been", "being", "very", "must", "many", "most", "some", "only", "other"
  ];
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopwords.includes(word));

  const freq = {};
  words.forEach(w => freq[w] = (freq[w] || 0) + 1);

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 80)
    .map(([text, value]) => ({ text, value }));
};
