import { Redis } from "@upstash/redis";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export type CompanionKey = {
    companionId: string;
    modelName: string;
    userId: string;
}

export class MemoryManager {
    private static instance: MemoryManager;
    private history: Redis;
    private vectorDBClient: Pinecone;

    public constructor() {
        this.history = Redis.fromEnv();
        this.vectorDBClient = new Pinecone({
            apiKey: process.env.PINE_CONE_API_KEY!
        })
    }

    public static async getInstance(): Promise<MemoryManager>{
        if(!MemoryManager.instance){
            MemoryManager.instance = new MemoryManager();
        }
        return MemoryManager.instance;
    }

    public generateRedisCompanionKey(companionKey: CompanionKey){
        return `${companionKey.companionId}-${companionKey.modelName}-${companionKey.userId}`
    }

    public async readLatestHistory(companionKey: CompanionKey): Promise<string>{
        if(!companionKey || typeof companionKey.userId === "undefined"){
            console.log("Companion Key set incorrectly");
            return "";
        }

        const key = this.generateRedisCompanionKey(companionKey);

        let result = await this.history.zrange(key, 0, Date.now(), {
            byScore: true,
        });

        result = result.slice(-30).reverse();
        const recentChats = result.reverse().join("\n");

        return recentChats;
    }

    public async seedChatHistory(
        seedContent: string,
        delimiter: string = "\n",
        companionKey: CompanionKey
    ){
        const key = this.generateRedisCompanionKey(companionKey);
        if (await this.history.exists(key)){
            console.log("User already has chat history");
            return;
        }

        const content = seedContent.split(delimiter);
        let counter = 0;
        for (const line of content){
            await this.history.zadd(key, {score: counter, member: line});
            counter += 1;
        }
    }

    public async writeToChatHistory(text: string, companionKey: CompanionKey){
        if (!companionKey || typeof companionKey.userId == "undefined") {
            console.log("Companion key set incorrectly");
            return "";
        }
        const key = this.generateRedisCompanionKey(companionKey);
        const result = await this.history.zadd(key, {
            score: Date.now(),
            member: text,
        });
        return result;
    }

    public async vectorSearch(recentChatHistory: string, companion_file_name: string){
        const pinecone = <Pinecone>this.vectorDBClient;
        const pineconeIndex = pinecone.Index(
            process.env.PINECONE_INDEX! || "",
        );

        const vectorStore = await PineconeStore.fromExistingIndex(
            new GoogleGenerativeAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY}),
            {pineconeIndex},
        );

        const similarDocs= await vectorStore
            .similaritySearch(recentChatHistory, 3, {fileName : companion_file_name})
            .catch((err)=>{
                console.log("WARNING: failed to get vector search results.", err)
            });
        return similarDocs;
    }

    public async clearHistory(companionKey: CompanionKey){
        if (!companionKey || typeof companionKey.userId === "undefined"){
            console.log("Companion key is set incorrectly.");
            return ""
        }
        const key = this.generateRedisCompanionKey(companionKey);
        this.history.del(key);
    }
}