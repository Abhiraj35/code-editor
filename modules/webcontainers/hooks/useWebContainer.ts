import { useState, useEffect, useCallback, useRef } from "react";
import { WebContainer } from "@webcontainer/api";
import { TemplateFolder } from "@/modules/playground/lib/path-to-json";

interface useWebContainerProps {
    templateData?: TemplateFolder | null;
}

interface UseWebContainerReturn {
    serverUrl: string | null;
    isLoading: boolean;
    error: string | null;
    instance: WebContainer | null;
    writeFileSync: (path: string, content: string) => Promise<void>;
    destroy: () => Promise<void>;
}

export const useWebContainer = ({ templateData }: useWebContainerProps): UseWebContainerReturn => {
    const [serverUrl, setServerUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [instance, setInstance] = useState<WebContainer | null>(null);
    const serverUrlRef = useRef<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const initWebContainer = async () => {
            try {
                const webContainer = await WebContainer.boot();

                if (!mounted) return;

                setInstance(webContainer);
                
                // Listen for server-ready event to capture the server URL
                webContainer.on("server-ready", (port: number, url: string) => {
                    if (mounted) {
                        setServerUrl(url);
                        serverUrlRef.current = url;
                    }
                });
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                setError(errorMessage);
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };
        initWebContainer();

        return () => {
            mounted = false;
        }
    }, []);

    const writeFileSync = useCallback(async (path: string, content: string): Promise<void> => {
        if (!instance) {
            throw new Error("WebContainer is not initialized");
        }
        try {
            const pathParts = path.split("/");
            const folderPath = pathParts.slice(0, -1).join("/");

            if (folderPath) {
                await instance.fs.mkdir(folderPath, { recursive: true });   //create folder structure recursively
            }

            await instance.fs.writeFile(path, content);
        } catch (error) {
            console.error("Error writing file:", error);
            throw error;
        }
    }, [instance]);

    const destroy = useCallback(async () => {
        if (instance) {
            instance.teardown();
            setInstance(null);
            setServerUrl(null);
            serverUrlRef.current = null;
        }
    }, [instance]);

    return {
        serverUrl,
        isLoading,
        error,
        instance,
        writeFileSync,
        destroy
    };
}