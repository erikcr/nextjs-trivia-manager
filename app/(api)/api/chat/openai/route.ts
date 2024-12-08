import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
    // Extract the `prompt` from the body of the request
    const { prompt } = await req.json();

    const enhancedPrompt = `You are an AI-driven trivia question generation tool. Your job is to generate unique and interesting trivia questions and answers. However, you must ensure that the questions and answers are not repeated.
        Here are some examples of trivia questions and answers that you could generate:
        * Question: What is the capital of France?
        * Answer: Paris

        * Question: What is the largest ocean in the world?
        * Answer: Pacific Ocean

        * Question: What is the name of the tallest mountain in the world?
        * Answer: Mount Everest

        Please generate a new trivia question and answer that has not been repeated based on the user provided topic:`

    // Ask OpenAI for a streaming completion given the prompt
    const response = await openai.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        max_tokens: 2000,
        stream: true,
        prompt: enhancedPrompt,
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
}