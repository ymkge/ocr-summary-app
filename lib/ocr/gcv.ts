import { ImageAnnotatorClient } from '@google-cloud/vision';

let client: ImageAnnotatorClient | null = null;

function getClient(): ImageAnnotatorClient {
    if (client) {
        return client;
    }

    const gcpSaKeyJson = process.env.GCP_SA_KEY_JSON;
    if (!gcpSaKeyJson) {
        throw new Error('Google Cloud service account key is not configured.');
    }

    try {
        const credentials = JSON.parse(gcpSaKeyJson);
        client = new ImageAnnotatorClient({ credentials });
        return client;
    } catch (error) {
        console.error("Failed to parse GCP Service Account JSON:", error);
        throw new Error("Invalid Google Cloud service account key format.");
    }
}

export async function runGcvOcr(imageBuffer: Buffer): Promise<string> {
    const visionClient = getClient();

    const request = {
        image: {
            content: imageBuffer.toString('base64'),
        },
        features: [{ type: 'TEXT_DETECTION' as const }],
    };

    try {
        const [result] = await visionClient.textDetection(request);
        const detections = result.textAnnotations;
        return detections && detections.length > 0 ? detections[0].description ?? '' : '';
    } catch (error) {
        console.error('Google Cloud Vision API Error:', error);
        throw new Error('Google Cloud Vision API request failed.');
    }
}
