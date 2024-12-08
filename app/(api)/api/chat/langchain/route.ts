import { NextRequest, NextResponse } from 'next/server';
import { Message as VercelChatMessage } from 'ai';

import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BaseOutputParser, FormatInstructionsOptions } from 'langchain/schema/output_parser';
import { ChatPromptTemplate } from 'langchain/prompts';

export const runtime = 'edge';

const formatMessage = (message: VercelChatMessage) => {
    return `${message.role}: ${message.content}`;
};

class OutputParser extends BaseOutputParser<any[]> {
    async parse(text: string): Promise<any[]> {
        let finalQas: any[] = [];
        const qas = text.split(";").map((item) => item.trim());
        qas.map((text) => {
            if (text !== "") {
                let qa = text.split("&").map((item) => item.trim());
                finalQas.push({
                    question: qa[0],
                    answer: qa[1],
                });
            }
        });
        return finalQas;
    }

    getFormatInstructions(options?: FormatInstructionsOptions | undefined): string {
        return "return value from getFormatInstructions";
    }

    lc_namespace: string[] = [];
}

const triviaQuestionPrompt = `You are a trivia master who generates a list of question/answer pairs. The formatting of the output is of the utmost importance. A single question and answer pair must be separated by an ampersand. Separate each question/answer pair from the next using a semicolon.

The questions are to be used primarily for trivia bar games, so the value of the answer should be limited to the relevant phrase and not a complete sentence.

A valid examples looks like: Who is considered the "Father of Rap"? & Gil Scott-Heron; What year did the first rap single, "Rapper's Delight," release? & 1979;
Which rap group released the album "Straight Outta Compton" in 1988? & N.W.A

A user will provide a topic that they want to ask a trivia question about. As an optional parameter, they will specify the difficulty of the question. If no difficulty is provided, assume a difficulty of 8th grade education level.

You will then generate three question/answer pairs about that topic. Only returned the question/answer pairs and nothing more.`

const humanTemplate = "Generate questions about related to the topic of {topic}.";

/*
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    // const currentMessageRound = messages[messages.length - 1].round;

    const chatPrompt = ChatPromptTemplate.fromMessages([
        ["system", triviaQuestionPrompt],
        ["human", humanTemplate],
    ]);

    const model = new ChatOpenAI({});
    const parser = new OutputParser();

    const chain = chatPrompt.pipe(model).pipe(parser);

    const result = await chain.invoke({
        topic: currentMessageContent,
    });

    return NextResponse.json({ message: result }, { status: 200 })
}