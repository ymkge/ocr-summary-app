const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`;

const DEFAULT_SUMMARY_LANG = process.env.DEFAULT_SUMMARY_LANG || 'ja';

const getPrompt = (text: string, lang: string) => {
  const langMap: { [key: string]: string } = {
    ja: '日本語',
    en: 'English',
  };

  const targetLang = langMap[lang] || '日本語';

  return `以下のテキストを${targetLang}で3〜5行の箇条書きで要約してください。要点のみを簡潔にまとめてください。

---
${text}
---
`;
};

export async function summarizeWithGemini(text: string, lang: string = DEFAULT_SUMMARY_LANG): Promise<string> {
  if (!GOOGLE_API_KEY) {
    throw new Error('Google API Key for Gemini is not configured.');
  }
  if (!text || text.trim().length < 10) {
    return "要約するのに十分なテキストがありません。";
  }

  const prompt = getPrompt(text, lang);

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Gemini API Error:', errorBody);
    throw new Error(`Gemini API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  
  try {
    return data.candidates[0].content.parts[0].text;
  } catch (e) {
    console.error("Error parsing Gemini response:", data);
    throw new Error("Failed to parse summary from Gemini API response.");
  }
}