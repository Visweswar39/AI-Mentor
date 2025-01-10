import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { BotAvatar } from "./bot-avatar";
import { BeatLoader } from "react-spinners";
import { useTheme } from "next-themes";
import { UserAvatar } from "./user-avatar";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";

export interface ChatMessageProps {
    src?: string;
    role: string;
    content?: string;
    isLoading?: boolean
}

export const ChatMessage = ({src, role, content, isLoading}: ChatMessageProps) => {
    const { toast } = useToast();
    const { theme } = useTheme();

    const onCopy = () => {
        if(!content){
            return;
        }
        navigator.clipboard.writeText(content);
        toast({
            description: "Message copied to description",
        });
    }

    return(
        <div
            className={cn(
                "group flex w-full items-start gap-x-3 py-4",
                role === "user" && "justify-end",
            )}
        >
            {role !== "user" && src && <BotAvatar src={src} />}
            <div className="max-w-sm whitespace-pre-wrap rounded-md bg-primary/10 px-4 py-2 text-sm">
                {isLoading
                    ? <BeatLoader color={theme === "light" ? "black" : "white"} size={5} />
                    : content
                }
            </div>
            {role === "user" && <UserAvatar />}
            {role !== "user" && !isLoading && (
                <Button
                    onClick={onCopy}
                    className="opacity-0 transition group-hover:opacity-100"
                    size="icon"
                    variant="ghost"
                >
                    <Copy className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}