"use client";

import { useEffect, useState } from "react";
import {CldUploadButton} from "next-cloudinary";
import Image from "next/image";

interface ImageUploadProps{
    value: string;
    onChange: (src: string) => void;
    disabled?: boolean;
}

export function ImageUpload({value, onChange, disabled}: ImageUploadProps){
    const [isMounted, setIsMounted] = useState(false);

    useEffect(()=>{
        setIsMounted(true);
    }, []);

    if (!isMounted){
        return null;
    }

    return(
        <div className="space-y-4 w-full flex flex-col justify-center items-center">
            <CldUploadButton
                onSuccess={(result: any) => onChange(result.info.secure_url)}
                options={{
                    maxFiles: 1
                }}
                uploadPreset="timelesstalks"
                >
                <div
                    className="
                        flex 
                        flex-col 
                        items-center
                        justify-center 
                        space-y-2 
                        rounded-lg 
                        border-4 
                        border-dashed 
                        border-primary/10 
                        p-4 
                        transition 
                        hover:opacity-75
                    "
                    >
                    <div className="relative h-40 w-40">
                        <Image
                            fill
                            alt="upload"
                            src={value || "/placeholder.svg"} 
                            className="rounded-lg object-cover"/>
                    </div>

                </div>
            </CldUploadButton>
        </div>
    )
}