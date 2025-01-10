"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, Edit, History, MessageSquare, MoreVertical, Trash } from 'lucide-react'
import React from 'react'
import { ChatClientProps } from "./chat-client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

function ChatHeader({companion}: ChatClientProps) {

  const {user} = useUser();
  const router = useRouter();

  const onDelete = async () => {
    try{
        await axios.delete(`/api/companion/${companion.id}`);
        toast({
            description: "Successfylly deleted"
        });
        router.refresh();
        router.push("/");
    }catch(error){
        toast({
            description:  "Something went wrong!",
            variant: "destructive"
        });
        console.log("Error while deleting companion", error);
    }
  }

  const onClearMessageHistory = async () => {
    try {
      await axios.delete(`/api/companion/${companion.id}/history`);

      toast({ description: "Success." });

      router.refresh();
    } catch (error) {
      toast({
        description: "Something went wrong.",
        variant: "destructive",
      });
      console.log("Error while deleting companion: ", error);
    }
  };

  return (
    // <div className="flex w-full items-center justify-between border-b border-primary/10 pb-4">
    <div className='flex flex-row items-center '>
        <Button size="icon" variant="ghost" onClick={() => router.back()}>
          <ChevronLeft className="h-8 w-8" />
        </Button>
        {/* avatar and name container */}
        <div className='flex-1 flex flex-row gap-2'>
            <div className="flex items-center">
                <Avatar>
                    <AvatarImage sizes="30" src={companion.src}/>
                    <AvatarFallback>character image</AvatarFallback>
                </Avatar>
            </div>
            <div>
                <div className="flex flex-row gap-2 items-center">
                    <div className="font-bold text-md">{companion.name}</div>
                    <div className="flex flex-row gap-1 items-center text-xs"><MessageSquare size={"10"}/>{companion.messages.length}</div>
                </div>
                <div className="text-sm font-thin">created by {companion.userName}</div>
            </div>
        </div>
        <div>
        <DropdownMenu>
            <DropdownMenuTrigger>
                <MoreVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={onClearMessageHistory}>
                    <History className="mr-2 h-4 w-4" />
                    Clear Message History
                </DropdownMenuItem>
                {
                    user?.id === companion.userId && (
                        <>
                            <DropdownMenuItem onClick={()=> router.push(`/companion/${companion.id}`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onDelete}>
                                <Trash className="mr-2 h-4 w-4" /> 
                                Delete
                            </DropdownMenuItem>
                        </>
                    )
                }                
            </DropdownMenuContent>
        </DropdownMenu>
        </div>
    </div>
    // </div>
  )
}

export default ChatHeader;