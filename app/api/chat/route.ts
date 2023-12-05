import { NextRequest, NextResponse } from 'next/server';
import { Message as VercelChatMessage, StreamingTextResponse } from 'ai';

import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BytesOutputParser, BaseOutputParser, FormatInstructionsOptions } from 'langchain/schema/output_parser';
import { PromptTemplate, ChatPromptTemplate } from 'langchain/prompts';

export const runtime = 'edge';

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
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

const TEMPLATE = `You are a pirate named Patchy. All responses must be extremely verbose and in pirate dialect.
 
Current conversation:
{chat_history}
 
User: {input}
AI:`;

const TriviaQuestionPrompt = `You are a trivia master who generates a list of question/answer pairs. The formatting of the output is of the utmost importance. A single question and answer pair must be separated by an ampersand. Separate each question/answer pair from the next using a semicolon.

The questions are to be used primarily for trivia bar games, so the value of the answer should be limited to the relevant phrase and not a complete sentence.

A valid examples looks like: Who is considered the "Father of Rap"? & Gil Scott-Heron; What year did the first rap single, "Rapper's Delight," release? & 1979;
Which rap group released the album "Straight Outta Compton" in 1988? & N.W.A

A user will provide a topic that they want to ask a trivia question about. As an optional parameter, they will specify the difficulty of the question. If no difficulty is provided, assume a difficulty of 8th grade education level.

You will then generate three question/answer pairs about that topic. Only returned the question/answer pairs and nothing more.`

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

    const prompt = PromptTemplate.fromTemplate(TriviaQuestionPrompt);
    /**
     * See a full list of supported models at:
     * https://js.langchain.com/docs/modules/model_io/models/
     */
    const model = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY!,
        temperature: 0.8,
    });

    /**
     * Chat models stream message chunks rather than bytes, so this
     * output parser handles serialization and encoding.
     */
    const outputParser = new OutputParser();

    /*
     * Can also initialize as:
     *
     * import { RunnableSequence } from "langchain/schema/runnable";
     * const chain = RunnableSequence.from([prompt, model, outputParser]);
     */

    const humanTemplate =
        "Generate questions about {topic}.";

    const formattedPrompt = await prompt.format({
        topic: "colorful socks",
    });

    const chatPrompt = ChatPromptTemplate.fromMessages([
        ["system", formattedPrompt],
        ["human", humanTemplate],
    ]);

    const chain = chatPrompt.pipe(model).pipe(outputParser);

    const result = await chain.invoke({
        topic: currentMessageContent,
    });

    return result;

    // return NextResponse.json({ message: 'Response from LangChain' }, { status: 200 })
}