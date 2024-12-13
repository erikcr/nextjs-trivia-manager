import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

const result = await generateObject({
    model: openai('gpt-4o-mini'),
    system: 'You generate exactly 4 trivia questions with clear, unambiguous answers. Assign points (1-5) based on question complexity, where 1 point is for basic knowledge and 5 points for expert-level questions. Ensure answers are concise and factually correct.',
    prompt,
    schema: z.object({
        trivia: z.array(
            z.object({
                question_text: z.string().describe('A clear, well-formed trivia question'),
                correct_answer: z.string().describe('A concise, unambiguous answer'),
                points: z.number().min(1).max(5).describe('Points based on complexity: 1=basic, 5=expert'),
            })
        ).length(4).describe('Exactly 4 trivia questions'),
    }),
});

  return result.toJsonResponse();
}