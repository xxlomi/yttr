import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface TranscriptionResult {
  id: string;
  title: string;
  transcript: { timestamp: string; text: string }[];
  wordCount: number;
  accuracy: string;
  timeSaved: string;
}

export async function transcribeVideo(url: string): Promise<TranscriptionResult> {
  // In a real app, we'd extract the video ID and fetch metadata.
  // Here we use Gemini to generate a mock transcript based on the URL context.
  
  const prompt = `Act as a high-end 8-bit themed transcription service. 
  Generate a realistic but mock transcription for a YouTube video with this URL: ${url}.
  If the URL looks like it's about a specific topic, tailor the transcript to that.
  Otherwise, make it about "The Future of 8-Bit Computing".
  
  Return the response in JSON format with the following structure:
  {
    "title": "A catchy title for the video",
    "transcript": [
      {"timestamp": "00:00:05", "text": "First sentence..."},
      {"timestamp": "00:00:42", "text": "Second sentence..."}
    ],
    "wordCount": 842,
    "accuracy": "99.2%",
    "timeSaved": "42m"
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text || "{}");
    
    return {
      id: `YT-${Math.floor(Math.random() * 100000)}-X`,
      title: data.title || "Untitled Transmission",
      transcript: data.transcript || [],
      wordCount: data.wordCount || 0,
      accuracy: data.accuracy || "0%",
      timeSaved: data.timeSaved || "0m",
    };
  } catch (error) {
    console.error("Transcription failed:", error);
    throw error;
  }
}
