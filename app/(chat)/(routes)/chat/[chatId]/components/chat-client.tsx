"use client";

import { Companion, Message } from "@prisma/client"
import ChatHeader from "./chat-header";
import { ChatForm } from "./chat-form";
import {useCompletion} from "ai/react"
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ChatMessages } from "@/components/chat-messages";
import { ChatMessageProps } from "@/components/chat-message";

export interface ChatClientProps{
    companion: (Companion & {
        messages: Message[]
    })
}

export function ChatClient({companion}: ChatClientProps){
    const router = useRouter();
    const [messages, setMessages] = useState<ChatMessageProps[]>(companion.messages);
    const { input, isLoading, handleInputChange, handleSubmit, setInput} = useCompletion({
        api: `/api/chat/${companion.id}`,
        onFinish(prompt, completion) {
            const systemMessage: ChatMessageProps = {
                role: "system",
                content: completion
            }

            setMessages((current)=> [...current, systemMessage]);
            setInput("");
            router.refresh();
        },
        onError(error) {
            console.log(error);
        },
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        const userMessage: ChatMessageProps = {
            role: "user",
            content: input
        }
        setMessages((current)=> [...current, userMessage]);
        handleSubmit(e);
    }

    return (
        <div className="flex h-screen flex-col space-y-2 p-4">
            <ChatHeader companion={companion}/>
            <ChatMessages 
                companion={companion} 
                messages={messages} 
                isLoading={isLoading}
            />
            <ChatForm 
                isLoading = {isLoading}
                input={input}
                handleInputChange = {handleInputChange}
                onSubmit = {onSubmit}
            />
        </div>
    )
}