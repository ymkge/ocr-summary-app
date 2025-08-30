import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import { formidable } from 'formidable';
import { LRUCache } from 'lru-cache';
import { runGcvOcr } from '@/lib/ocr/gcv';
import { summarizeWithGemini } from '@/lib/summarize/gemini';

export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_UPLOAD_MB = parseInt(process.env.MAX_UPLOAD_MB || '10', 10);

// --- Rate Limiting ---
const rateLimit = new LRUCache<string, number>({
  max: 500,
  ttl: 1000 * 60, // 1 minute
});
const RATE_LIMIT_COUNT = 10;

const getIp = (req: NextApiRequest) => 
  req.ip || 
  req.headers['x-forwarded-for'] as string || 
  req.headers['x-real-ip'] as string || 
  req.socket.remoteAddress || 'unknown';

// --- Main Handler ---
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // IP-based rate limiting
  const ip = getIp(req);
  const tokenCount = rateLimit.get(ip) || 0;
  if (tokenCount >= RATE_LIMIT_COUNT) {
    return res.status(429).json({ error: 'Too many requests. Please try again in a minute.' });
  }
  rateLimit.set(ip, tokenCount + 1);

  const startTime = Date.now();
  
  try {
    const { files } = await parseForm(req);
    const imageFile = files.image?.[0];
    
    if (!imageFile) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }

    if (imageFile.size > MAX_UPLOAD_MB * 1024 * 1024) {
      return res.status(400).json({ error: `File size exceeds ${MAX_UPLOAD_MB}MB limit.` });
    }

    const imageBuffer = await fs.readFile(imageFile.filepath);

    // --- OCR Execution ---
    const ocrStartTime = Date.now();
    const extractedText = await runGcvOcr(imageBuffer);
    const ocrEndTime = Date.now();

    // --- Summarization ---
    const summaryStartTime = Date.now();
    const summary = await summarizeWithGemini(extractedText);
    const summaryEndTime = Date.now();

    // --- Response ---
    const totalTime = Date.now() - startTime;
    res.status(200).json({
      extractedText,
      summary,
      timings: {
        total: totalTime,
        ocr: ocrEndTime - ocrStartTime,
        summary: summaryEndTime - summaryStartTime,
      },
      meta: {
        fileName: imageFile.originalFilename,
        fileSize: imageFile.size,
        model: 'Google Cloud Vision',
      },
    });

  } catch (e: any) {
    console.error('[API Error]', e);
    const userMessage = e.message.includes('API') || e.message.includes('configured') 
      ? 'An external service failed. Please check the server configuration.'
      : 'An unexpected error occurred.';
    res.status(500).json({ error: userMessage, details: e.message });
  }
}

// --- Form Parsing Utility ---
async function parseForm(req: NextApiRequest): Promise<{ files: formidable.Files; fields: formidable.Fields }> {
  const form = formidable({
    maxFileSize: MAX_UPLOAD_MB * 1024 * 1024,
    filter: ({ mimetype }) => mimetype?.startsWith('image/') || false,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ files, fields });
      }
    });
  });
}