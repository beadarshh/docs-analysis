const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const callGroqAI = async (messages, apiKey) => {
  if (!apiKey) throw new Error("API Key is missing. Please provide a Groq API Key.");

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to connect to Groq AI");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
};

export const generateSystemPrompt = (documents) => {
  const summary = documents.map(doc => ({
    name: doc.name,
    year: doc.year,
    type: doc.type,
    freq: doc.keywordFrequencies
  }));

  return `You are a specialized Dissertation AI Analyst for Multilateral Forums. 
You are analyzing a dataset of UN Speeches and G20 Declarations.
Dataset Summary: ${JSON.stringify(summary)}

Your goal is to help the researcher:
1. Interpret keyword trends over time.
2. Compare Global South representation between UN and G20 contexts.
3. Identify shifts in terminology and diplomatic focus.
4. Provide qualitative context for quantitative data.

Format Guidelines:
- Always present your analysis in clear, concise bullet points.
- Use bold text for years and document types.
- Ensure the most significant findings are highlighted at the top.

Be professional, academic, and insightful. Reference specific years and document types in your analysis.`;
};
