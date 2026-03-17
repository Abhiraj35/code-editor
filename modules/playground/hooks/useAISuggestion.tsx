import { editor } from "monaco-editor";
import { useState, useCallback } from "react";


interface AISuggestionState {
    suggestion: string | null;
    isLoading: boolean;
    position: { line: number, column: number } | null;
    decoration: string[];
    isEnabled: boolean;
}

interface UseAISuggestionReturn extends AISuggestionState {
    toggleEnable: () => void;
    fetchSuggestion: (type: string, editor: any) => Promise<void>;
    acceptSuggestion: (editor: any, monaco: any) => void;
    rejectSuggestion: (editor: any) => void;
    clearSuggestion: (editor: any) => void;
}

export const useAISuggestion = (): UseAISuggestionReturn => {
    const [state, setState] = useState<AISuggestionState>({
        suggestion: null,
        isLoading: false,
        position: null,
        decoration: [],
        isEnabled: true,
    });

    const toggleEnable = useCallback(() => {
        setState(prev => ({
            ...prev,
            isEnabled: !prev.isEnabled,
        }));
    }, []);

    const fetchSuggestion = useCallback(async (type: string, editor: any) => {
        setState((currentState) => {
            if (!currentState.isEnabled) return currentState;

            if (!editor) {
                return currentState;
            }

            const model = editor.getModel();
            const cursorPosition = editor.getPosition();
            if (!model || !cursorPosition) return currentState;

            const newState = { ...currentState, isLoading: true };

            (async () => {
                try {
                    const payload = {
                        fileContent: model.getValue(),
                        cursorLine: cursorPosition.lineNumber - 1,
                        cursorColumn: cursorPosition.column - 1,
                        suggestiontype: type
                    };

                    const response = await fetch('/api/code-suggestions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch suggestion');
                    }

                    const data = await response.json();
                    if (data.suggestion) {
                        const suggestionText = data.suggestion.trim();
                        setState((prev) => ({
                            ...prev,
                            suggestion: suggestionText,
                            isLoading: false,
                            position: {
                                line: cursorPosition.lineNumber,
                                column: cursorPosition.column,
                            },
                        }))

                    } else {
                        console.log("No suggestion from AI.");
                        setState((prev) => ({
                            ...prev,
                            isLoading: false,
                        }))
                    }

                    setState({
                        suggestion: data.suggestion,
                        isLoading: false,
                        position: data.position,
                        decoration: data.decoration,
                        isEnabled: true,
                    });
                } catch (error) {
                    console.error('Error fetching suggestion:', error);
                    setState((prev) => ({
                        ...prev,
                        isLoading: false,
                    }))
                }
            })()

            return newState;  
        })

    }, []);

    const acceptSuggestion = useCallback((editor: any, monaco: any) => {
        (editor: any, monaco: any) => {
            setState((currentState) => {
                if(!currentState.suggestion || !currentState.position || !editor || !monaco) return currentState;

                const { line, column } = currentState.position;
                const sanitizedSuggestion = currentState.suggestion.replace(/^\d+:\s*/gm, "");
                

                editor.executeEdits("accept-ai-suggestion", [
                    {
                        range: new monaco.Range(line + 1, column + 1, line + 1, column + 1),
                        text: sanitizedSuggestion,
                        forceMoveMarkers: true,
                    }
                ])
                
                if(editor && currentState.decoration.length > 0){
                    editor.deltaDecorations(currentState.decoration, []);
                }

                return {
                    ...currentState,
                    suggestion: null,
                    position: null,
                    decoration: [],
                }
            })
        }
    }, []);

    const rejectSuggestion = useCallback((editor: any) => {
        setState((currentState) => {
            if(editor && currentState.decoration.length > 0){
                editor.deltaDecorations(currentState.decoration, []);
            }

            return {
                ...currentState,
                suggestion: null,
                position: null,
                decoration: [],
            }
        })
    }, []);

    const clearSuggestion = useCallback((editor: any) => {
        setState((currentState) => {
            if(editor && currentState.decoration.length > 0){
                editor.deltaDecorations(currentState.decoration, []);
            }

            return {
                ...currentState,
                suggestion: null,
                position: null,
                decoration: [],
            }
        })
    }, []);

    return {
        ...state,
        fetchSuggestion,
        acceptSuggestion,
        rejectSuggestion,
        clearSuggestion,
        toggleEnable,
    }
}