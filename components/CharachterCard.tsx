"use client"
import { MessagesSquare } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

function CharachterCard() {
  const router = useRouter();
  return (
    <div className="grid bg-primary/10 hover:bg-primary/5 rounded-md p-4 gap-3" onClick={()=>router.push('/chat/23234')}>
      {/* Hero container */}
      <div className="flex flex-col justify-center items-center gap-1">
        <Image
          src="https://www.shutterstock.com/image-illustration/may-28-2020-caricature-leonardo-260nw-1742839220.jpg"
          alt="Character image"
          height={"100"}
          width={"100"}
        ></Image>
        <h4 className="font-bold">Leonardo Da Vinci</h4>
        <h4>PolyMath</h4>
      </div>
      {/* Footer Container */}
      <div className="flex flex-row justify-between">
        <p>@viswa</p>
        <p className="flex flex-row justify-between gap-1">
          <MessagesSquare />6
        </p>
      </div>
    </div>
  );
}

export default CharachterCard;
