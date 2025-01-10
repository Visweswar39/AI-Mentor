import { auth } from "@clerk/nextjs/server";
// import ChatHeader from "./components/chat-header";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { ChatClient } from "./components/chat-client";

interface ChatIdPageProps{
    params: {
        chatId: string
    }
}

export default async function ChatPage({params}: ChatIdPageProps){
    const {userId, redirectToSignIn} = auth();

    if (!userId){
        return redirectToSignIn();
    }

    const companion = await prismadb.companion.findUnique({
        where: {
            id: params.chatId
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc",
                },
                where: {
                    userId: userId
                }
            }
        }
    });

    
    if(!companion){
        return redirect("/");
    }

    return(
        // <div className="p-2">
        //     <div className="bg-green-50">
        //         <ChatHeader />
        //     </div>
        //     <div className="bg-white">
        //         chat
        //     </div>
        //     <div className="bg-red-100">
        //         chat footer
        //     </div>
        // </div>
        <ChatClient companion={companion}/>
    )
}