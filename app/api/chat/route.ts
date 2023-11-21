import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate, ChatPromptTemplate } from "langchain/prompts";
import { BaseOutputParser } from "langchain/schema/output_parser";

export const runtime = "edge";

const TEMPLATE = `You are a trivia master who generates a list of question/answer pairs. The formatting of the output is of the utmost importance. A single question and answer pair must be separated by an ampersand. Separate each question/answer pair from the next using a semicolon.

The questions are to be used primarily for trivia bar games, so the value of the answer should be limited to the relevant phrase and not a complete sentence.

A valid examples looks like: Who is considered the "Father of Rap"? & Gil Scott-Heron; What year did the first rap single, "Rapper's Delight," release? & 1979;
Which rap group released the album "Straight Outta Compton" in 1988? & N.W.A

A user will provide a topic that they want to ask a trivia question about. As an optional parameter, they will specify the difficulty of the question. If no difficulty is provided, assume a difficulty of 8th grade education level.

You will then generate three question/answer pairs about that topic. Only returned the question/answer pairs and nothing more.`

class TriviaOutputParser extends BaseOutputParser<any[]> {
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
}

/**
 * This handler initializes and calls an OpenAI Functions powered
 * structured output chain. See the docs for more information:
 *
 * https://js.langchain.com/docs/modules/chains/popular/structured_output
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const messages = body.messages ?? [];
        const currentMessageContent = messages[messages.length - 1].content;

        const prompt = PromptTemplate.fromTemplate(TEMPLATE);

        /**
         * Function calling is currently only supported with ChatOpenAI models
         */
        const model = new ChatOpenAI({
            temperature: 0.8,
            openAIApiKey: process.env.OPENAI_API_KEY
        });

        const formattedPrompt = await prompt.format({});

        const humanTemplate =
            "Questions about {topic} that are {difficulty} difficulty.";

        const chatPrompt = ChatPromptTemplate.fromMessages([
            ["system", formattedPrompt],
            ["human", humanTemplate],
        ]);

        const parser = new TriviaOutputParser();

        const chain = chatPrompt.pipe(model).pipe(parser);

        const result = await chain.invoke({
            topic: currentMessageContent,
            difficulty: "hard",
        });

        return NextResponse.json(result, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}