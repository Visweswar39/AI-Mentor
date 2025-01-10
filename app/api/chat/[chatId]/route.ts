import { MemoryManager } from "@/lib/memory";
import prismadb from "@/lib/prismadb";
import { rateLimit } from "@/lib/rate-limit";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { LangChainStream } from "ai";
import { CallbackManager } from "@langchain/core/callbacks/manager";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export async function POST(
    request: Request,
    { params }: { params: { chatId: string } }
) {
    try{
        const { prompt } = await request.json();
        const user = await currentUser();

        if(!user || !user.id || !user.firstName ){
            return new NextResponse("Unauthorized", {status: 401});
        }

        const identifier = request.url + "-" + user.id;
        const {success} = await rateLimit(identifier)

        if(!success){
            return new NextResponse("Rate Limit exceeded", {status: 429});
        }

        const companion = await prismadb.companion.update({
            where: {
                id: params.chatId,
            },
            data: {
                messages: {
                    create: {
                        content: prompt,
                        role: "user",
                        userId: user.id,
                    }
                }
            }
        });

        if(!companion){
            return new NextResponse("Companion not found", { status: 404});
        }

        const name = companion.id;
        const companion_file_name = name + ".txt";

        const companionKey = {
            companionId: companion.id,
            userId: user.id,
            modelName: "gpt-3.5-turbo"
        }
        const memoryManager = await MemoryManager.getInstance();

        const records = await memoryManager.readLatestHistory(companionKey);
        if(records.length === 0){
            await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey);
        }
        await memoryManager.writeToChatHistory("User: " + prompt + "\n", companionKey);
        
        const recentChatHistory = await memoryManager.readLatestHistory(companionKey);
        // Querying pinecone
        
        const similarDocs = await memoryManager.vectorSearch(
            recentChatHistory,
            companion_file_name
        );


        let releventHistory = "";
        if(!!similarDocs && similarDocs.length !== 0){
            releventHistory = similarDocs.map((doc)=> doc.pageContent).join("\n");
        }

        const {handlers} = LangChainStream();

        const openai = new ChatGoogleGenerativeAI({
            model: "gemini-1.5-pro",
            temperature: 0,
            maxRetries: 2,
            apiKey: process.env.OPENAI_API_KEY,
            callbacks: CallbackManager.fromHandlers(handlers)
        });

        openai.verbose = true;
        const resp = await openai
        .invoke(
            `
            ${companion.instructions}

            Try to give responses that are straight to the point. 
            Below are relevant details about ${companion.name}'s past and the conversation you are in.
            ${releventHistory}

            ${recentChatHistory}\n${companion.name}:`,
        )
        .catch(console.error);

        const content = resp?.content as string;
        if (!content && content?.length < 1) {
        return new NextResponse("content not found", { status: 404 });
        }

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const Readable = require("stream").Readable;
        const s = new Readable();
        s.push(content);
        s.push(null);

        memoryManager.writeToChatHistory("" + content, companionKey);
        await prismadb.companion.update({
            where: {
                id: params.chatId,
            },
            data: {
                messages: {
                    create: {
                        content: content,
                        role: "system",
                        userId: user.id
                    }
                }
            }
        })
        return new NextResponse(s);
    }catch( error ){
        console.log("Error while posting in chatId: ", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}