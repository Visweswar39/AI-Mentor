import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";
import { FormEvent } from "react";
import { ChatRequestOptions } from "ai";

interface chatFormProps {
    input: string;
    handleInputChange: (e : React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
    isLoading: boolean;
    onSubmit: (e: FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions | undefined,) => void;
}

export const ChatForm = ({input, handleInputChange, isLoading, onSubmit}: chatFormProps) => {
    return(
        <form
            onSubmit={onSubmit}
            className="flex items-center gap-x-2 border-t border-primary/10 py-4 "
        >
            <Input
                disabled={isLoading}
                value={input}
                onChange={handleInputChange}
                placeholder="Type a message"
                className="rounded-lg bg-primary/10"
            />
            <Button disabled={isLoading} variant="ghost">
                <SendHorizonal className="h-6 w-6" />
            </Button>
        </form>
    )
}