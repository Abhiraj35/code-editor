"use client"

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { usePlayground } from '@/modules/playground/hooks/usePlayground';
import { Tooltip, TooltipProvider } from '@/components/ui/tooltip';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { TemplateFileTree } from '@/modules/playground/components/playground-explorer';

const MainPlaygroundPage = () => {
  const { id } = useParams<{ id: string }>();

  const { playgroundData, templateData, isLoading, error, saveTemplateData } = usePlayground(id);

  useEffect(() => {
    console.log("Playground Data:", playgroundData);
    console.log("Template Data:", templateData);
    console.log("Loading:", isLoading);
    console.log("Error:", error);
  }, [playgroundData, templateData, isLoading, error]);

  const activeFile = "Sample.txt"; // Placeholder for selected file state

  return (
    <TooltipProvider>
      <>
        <TemplateFileTree
          data={templateData!}
          onFileSelect={() => {}}    //handleFileSelect
          selectedFile={activeFile}
          title="File Explorer"
          onAddFile={() => {}}      
          onAddFolder={() => {}}
          onDeleteFile={() => {}}
          onDeleteFolder={() => {}}
          onRenameFile={() => {}}
          onRenameFolder={() => {}}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <div className="flex flex-1 items-center gap-2">
              <div className="flex flex-col flex-1">
                <h1 className="text-sm font-medium">
                  {playgroundData?.title || "Code Playground"}
                </h1>
              </div>
            </div>
          </header>
        </SidebarInset>
      </>
    </TooltipProvider>
  )
}

export default MainPlaygroundPage;