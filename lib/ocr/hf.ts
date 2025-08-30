const HF_API_TOKEN = process.env.HF_API_TOKEN;
const OCR_MODEL_ID = process.env.OCR_MODEL_ID || 'microsoft/trocr-base-printed';
const API_URL = `https://api-inference.huggingface.co/models/${OCR_MODEL_ID}`;

interface HfResponse {
  generated_text: string;
}

export async function runHfOcr(imageBuffer: Buffer): Promise<string> {
  if (!HF_API_TOKEN) {
    throw new Error('HuggingFace API token is not configured.');
  }

  const response = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${HF_API_TOKEN}` },
    method: 'POST',
    body: imageBuffer,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('HuggingFace API Error:', errorBody);
    throw new Error(`HuggingFace API request failed: ${response.statusText}`);
  }

  const result: HfResponse[] = await response.json();
  
  if (result && result.length > 0 && result[0].generated_text) {
    return result[0].generated_text;
  }

  return '';
}
