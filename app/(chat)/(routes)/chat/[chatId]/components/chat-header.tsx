import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, EllipsisVertical, MessageSquare } from 'lucide-react'
import React from 'react'

function ChatHeader() {
  return (
    <div className='flex flex-row items-center border-4'>
        <div>
            <ChevronLeft />
        </div>
        {/* avatar and name container */}
        <div className='flex-1 flex flex-row gap-2'>
            <div className="flex items-center">
                <Avatar>
                    <AvatarImage sizes="30" src="https://www.shutterstock.com/image-illustration/may-28-2020-caricature-leonardo-260nw-1742839220.jpg"/>
                    <AvatarFallback>character image</AvatarFallback>
                </Avatar>
            </div>
            <div>
                <div className="flex flex-row gap-2 items-center">
                    <div className="font-bold text-md">Leonardo Da Vinci</div>
                    <div className="flex flex-row gap-1 items-center text-xs"><MessageSquare size={"10"}/>6</div>
                </div>
                <div className="text-sm font-thin">created by viswa</div>
            </div>
        </div>
        <div>
            <EllipsisVertical />
        </div>
    </div>
  )
}

export default ChatHeader