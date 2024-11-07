import ChatHeader from "./components/chat-header";

export default function ChatPage(){
    return(
        <div className="p-2">
            <div className="bg-green-50">
                <ChatHeader />
            </div>
            <div className="bg-white">
                chat
            </div>
            <div className="bg-red-100">
                chat footer
            </div>
        </div>
    )
}