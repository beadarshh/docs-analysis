export const KEYWORD_GROUPS = {
  "Multilateralism & Reform": [
    "multilateralism",
    "UNSC reform",
    "reformed multilateralism",
    "UN Charter",
    "sovereignty"
  ],
  "Global South Identity": [
    "Global South",
    "Voice of Global South",
    "developing countries",
    "Third World",
    "emerging economies"
  ],
  "Equity & Justice": [
    "equity",
    "representation",
    "inclusivity",
    "climate justice",
    "CBDR",
    "historical responsibility"
  ],
  "Economic Development": [
    "sustainable development",
    "debt distress",
    "digital public infrastructure",
    "DPI",
    "financial architecture",
    "SDGs"
  ],
  "Global Challenges": [
    "climate change",
    "pandemic",
    "health security",
    "energy transition",
    "food security"
  ]
};

export const ALL_KEYWORDS = Object.values(KEYWORD_GROUPS).flat();

/**
 * Gets keywords for a specific group or multiple groups.
 */
export const getKeywordsByGroups = (groupNames) => {
  if (!groupNames || groupNames.length === 0) return ALL_KEYWORDS;
  return groupNames.flatMap(group => KEYWORD_GROUPS[group] || []);
};
