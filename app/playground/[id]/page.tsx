"use client"

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { usePlayground } from '@/modules/playground/hooks/usePlayground';

const MainPlaygroundPage = () => {
    const { id } = useParams<{id: string}>();

    const { playgroundData, templateData, isLoading, error, saveTemplateData } = usePlayground(id);

    useEffect(() => {
        console.log("Playground Data:", playgroundData);
        console.log("Template Data:", templateData);
        console.log("Loading:", isLoading);
        console.log("Error:", error);
    }, [playgroundData, templateData, isLoading, error]);

  return (
    <div>param: {id}</div>
  )
}

export default MainPlaygroundPage;