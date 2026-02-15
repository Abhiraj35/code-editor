"use client";

import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useState } from "react"
import { toast } from "sonner";
import TemplateSelectingModal from "./template-selecting-modal";
import { Data } from "../types";
import { createPlayground } from "../actions";

const AddNewButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<Data | null>(null)
    const router = useRouter()

    const handleSubmit = async (data: Data) => {
        setSelectedTemplate(data)

        const res = await createPlayground(data);
        if (res && "id" in res) {
            toast.success("Playground Created successfully");
            setIsModalOpen(false);
            router.push(`/playground/${res.id}`);
        } else {
            toast.error("Failed to create playground");
        }  
    }

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className="group relative overflow-hidden rounded-xl border border-border bg-card 
                cursor-pointer transition-all duration-300 ease-out
                hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5
                active:scale-[0.98]"
            >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Left content */}
                    <div className="flex flex-row items-start gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="shrink-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 
                            flex items-center justify-center
                            group-hover:bg-primary/20 group-hover:scale-110
                            transition-all duration-300">
                                <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-primary 
                                transition-transform duration-300 group-hover:rotate-90" />
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-foreground 
                            group-hover:text-primary transition-colors duration-300">
                                Add New
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                Create a new playground to start coding
                            </p>
                        </div>
                    </div>

                    {/* Right image - hidden on mobile, visible on tablet+ */}
                    <div className="hidden sm:block shrink-0 relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
                        <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent 
                        rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Image
                            src={"/add-new.svg"}
                            alt="Create new playground"
                            width={112}
                            height={112}
                            className="relative transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                        />
                    </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r 
                from-transparent via-primary to-transparent
                scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>

            <TemplateSelectingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
            />
        </>
    )
}

export default AddNewButton