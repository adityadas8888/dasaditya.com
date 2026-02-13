import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type UIMessage, convertToModelMessages } from "ai";
import { DATA } from "@/data/resume";

// Use Groq as an OpenAI-compatible provider
const groq = createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
    const { messages } = (await req.json()) as { messages: UIMessage[] };

    const result = await streamText({
        model: groq("llama3-8b-8192"),
        system: `You are Aditya's AI Representative. Use the following data about Aditya Das to answer questions. 
Be professional, high-energy, and helpful. 
If you don't know something, or if the user asks for personal contact info not provided, ask them to contact Aditya directly via LinkedIn or email.

ADITYA DAS DATA:
${JSON.stringify(DATA, null, 2)}

Instructions:
- Keep responses concise and engaging.
- Highlight Aditya's expertise in Senior Software Engineering and AI.
- If asked about availability, suggest they reach out for a formal discussion.`,
        messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
}
