import { create, StateCreator } from 'zustand';
import { toast } from 'sonner';

import { TemplateFolder, TemplateFile } from '../lib/path-to-json';
import { generateFileId } from '../lib';

interface OpenFile extends TemplateFile {
    id: string;
    hasUnsavedChanges: boolean;
    content: string;
    originalContent: string;
}

interface FileExplorerState {
    playgroundId: string;
    templateData: TemplateFolder | null;
    openFiles: OpenFile[];
    activeFileId: string | null;
    editorContent: string;

    //   Setter Functions
    setPlaygroundId: (id: string) => void;
    setTemplateData: (data: TemplateFolder | null) => void;
    setEditorContent: (content: string) => void;
    setOpenFiles: (files: OpenFile[]) => void;
    setActiveFileId: (fileId: string | null) => void;

    //   Functions
    openFile: (file: TemplateFile) => void;
    closeFile: (fileId: string) => void;
    closeAllFiles: () => void;

    // File explorer methods
    handleAddFile: (
        newFile: TemplateFile,
        parentPath: string,
        writeFileSync: (filePath: string, content: string) => Promise<void>,
        instance: any,
        saveTemplateData: (data: TemplateFolder) => Promise<void>
    ) => Promise<void>;

    handleAddFolder: (
        newFolder: TemplateFolder,
        parentPath: string,
        instance: any,
        saveTemplateData: (data: TemplateFolder) => Promise<void>
    ) => Promise<void>;

    handleDeleteFile: (
        file: TemplateFile,
        parentPath: string,
        instance: any,
        saveTemplateData: (data: TemplateFolder) => Promise<void>
    ) => Promise<void>;

    handleDeleteFolder: (
        folder: TemplateFolder,
        parentPath: string,
        instance: any,
        saveTemplateData: (data: TemplateFolder) => Promise<void>
    ) => Promise<void>;

    handleRenameFile: (
        file: TemplateFile,
        newFilename: string,
        newExtension: string,
        parentPath: string,
        instance: any,
        saveTemplateData: (data: TemplateFolder) => Promise<void>
    ) => Promise<void>;

    handleRenameFolder: (
        folder: TemplateFolder,
        newFolderName: string,
        parentPath: string,
        instance: any,
        saveTemplateData: (data: TemplateFolder) => Promise<void>
    ) => Promise<void>;

    updateFileContent: (fileId: string, content: string) => void;
}

function deepClone<T>(data: T): T {
    return structuredClone(data);
}

function traverseToFolder(root: TemplateFolder, parentPath: string): TemplateFolder {
    const pathParts = parentPath.split("/");
    let currentFolder = root;

    for (const part of pathParts) {
        if (!part) continue;
        const nextFolder = currentFolder.items.find(
            (item) => "folderName" in item && item.folderName === part
        ) as TemplateFolder | undefined;

        if (!nextFolder) {
            throw new Error(`Path segment "${part}" not found in folder tree`);
        }
        currentFolder = nextFolder;
    }

    return currentFolder;
}

function collectFileIdsInFolder(folder: TemplateFolder, templateData: TemplateFolder): Set<string> {
    const ids = new Set<string>();

    const recurse = (f: TemplateFolder) => {
        f.items.forEach((item) => {
            if ("filename" in item) {
                ids.add(generateFileId(item, templateData));
            } else if ("folderName" in item) {
                recurse(item);
            }
        });
    };

    recurse(folder);
    return ids;
}

function sortFolderItems(items: (TemplateFolder | TemplateFile)[]) {
    return items.sort((a, b) => {
        const aIsFolder = "folderName" in a;
        const bIsFolder = "folderName" in b;

        if (aIsFolder && !bIsFolder) return -1;
        if (!aIsFolder && bIsFolder) return 1;

        const aName = aIsFolder ? a.folderName : a.filename;
        const bName = bIsFolder ? b.folderName : b.filename;

        return aName.localeCompare(bName, undefined, { sensitivity: "base" });
    });
}

const fileExplorerStore: StateCreator<FileExplorerState> = (set, get) => ({
    templateData: null,
    playgroundId: "",
    openFiles: [] as OpenFile[],
    activeFileId: null,
    editorContent: "",

    setTemplateData: (data) => set({ templateData: data }),
    setPlaygroundId: (id) => set({ playgroundId: id }),
    setEditorContent: (content) => set({ editorContent: content }),
    setOpenFiles: (files) => set({ openFiles: files }),
    setActiveFileId: (fileId) => set({ activeFileId: fileId }),

    openFile: (file) => {
        const fileId = generateFileId(file, get().templateData);
        const { openFiles } = get();
        const existingFile = openFiles.find(f => f.id === fileId);

        if (existingFile) {
            set({ activeFileId: fileId, editorContent: existingFile.content });
            return;
        }

        const newOpenFile: OpenFile = {
            ...file,
            id: fileId,
            hasUnsavedChanges: false,
            content: file.content || "",
            originalContent: file.content || "",
        };

        set((state) => ({
            openFiles: [...state.openFiles, newOpenFile],
            activeFileId: fileId,
            editorContent: file.content || "",
        }));
    },

    closeFile: (fileId) => {
        const { openFiles, activeFileId } = get();
        const newFiles = openFiles.filter((f) => f.id !== fileId);

        let newActiveFileId = activeFileId;
        let newEditorContent = get().editorContent;

        if (activeFileId === fileId) {
            if (newFiles.length > 0) {
                const lastFile = newFiles[newFiles.length - 1];
                newActiveFileId = lastFile.id;
                newEditorContent = lastFile.content;
            } else {
                newActiveFileId = null;
                newEditorContent = "";
            }
        }

        set({
            openFiles: newFiles,
            activeFileId: newActiveFileId,
            editorContent: newEditorContent,
        });
    },

    closeAllFiles: () => {
        set({
            openFiles: [],
            activeFileId: null,
            editorContent: "",
        });
    },

    handleAddFile: async (newFile, parentPath, writeFileSync, instance, saveTemplateData) => {
        const { templateData } = get();
        if (!templateData) return;

        try {
            const updatedTemplateData = deepClone(templateData);

            const currentFolder = traverseToFolder(updatedTemplateData, parentPath);

            currentFolder.items.push(newFile);
            currentFolder.items = sortFolderItems(currentFolder.items);
            set({ templateData: updatedTemplateData });
            toast.success(`Created file: ${newFile.filename}.${newFile.fileExtension}`);

            await saveTemplateData(updatedTemplateData);

            if (writeFileSync) {
                const filePath = parentPath
                    ? `${parentPath}/${newFile.filename}.${newFile.fileExtension}`
                    : `${newFile.filename}.${newFile.fileExtension}`;
                await writeFileSync(filePath, newFile.content || "");
            }

            get().openFile(newFile);
        } catch (error) {
            console.error("Error adding file:", error);
            toast.error("Failed to create file");
        }
    },

    handleAddFolder: async (newFolder, parentPath, instance, saveTemplateData) => {
        const { templateData } = get();
        if (!templateData) return;

        try {
            const updatedTemplateData = deepClone(templateData);

            const currentFolder = traverseToFolder(updatedTemplateData, parentPath);

            currentFolder.items.push(newFolder);
            currentFolder.items = sortFolderItems(currentFolder.items);
            console.log("hello");
            set({ templateData: updatedTemplateData });
            toast.success(`Created folder: ${newFolder.folderName}`);

            await saveTemplateData(updatedTemplateData);

            if (instance && instance.fs) {
                const folderPath = parentPath
                    ? `${parentPath}/${newFolder.folderName}`
                    : newFolder.folderName;
                await instance.fs.mkdir(folderPath, { recursive: true });
            }
        } catch (error) {
            console.error("Error adding folder:", error);
            toast.error("Failed to create folder");
        }
    },

    handleDeleteFile: async (
        file,
        parentPath,
        instance,
        saveTemplateData
    ) => {
        const { templateData } = get();
        if (!templateData) return;

        try {
            const updatedTemplateData = deepClone(templateData);

            const currentFolder = traverseToFolder(updatedTemplateData, parentPath);

            currentFolder.items = currentFolder.items.filter(
                (item) =>
                    !("filename" in item) ||
                    item.filename !== file.filename ||
                    item.fileExtension !== file.fileExtension
            );

            const fileId = generateFileId(file, templateData);
            set((state) => {
                const newOpenFiles = state.openFiles.filter((f) => f.id !== fileId);

                let newActiveFileId = state.activeFileId;
                let newEditorContent = state.editorContent;

                if (state.activeFileId === fileId) {
                    if (newOpenFiles.length > 0) {
                        const lastFile = newOpenFiles[newOpenFiles.length - 1];
                        newActiveFileId = lastFile.id;
                        newEditorContent = lastFile.content;
                    } else {
                        newActiveFileId = null;
                        newEditorContent = "";
                    }
                }

                return {
                    templateData: updatedTemplateData,
                    openFiles: newOpenFiles,
                    activeFileId: newActiveFileId,
                    editorContent: newEditorContent,
                };
            });

            await saveTemplateData(updatedTemplateData);

            if (instance && instance.fs) {
                const filePath = parentPath
                    ? `${parentPath}/${file.filename}.${file.fileExtension}`
                    : `${file.filename}.${file.fileExtension}`;
                await instance.fs.rm(filePath, { force: true });
            }

            toast.success(`Deleted file: ${file.filename}.${file.fileExtension}`);
        } catch (error) {
            console.error("Error deleting file:", error);
            toast.error("Failed to delete file");
        }
    },

    handleDeleteFolder: async (
        folder,
        parentPath,
        instance,
        saveTemplateData
    ) => {
        const { templateData } = get();
        if (!templateData) return;

        try {
            const updatedTemplateData = deepClone(templateData);

            const currentFolder = traverseToFolder(updatedTemplateData, parentPath);

            currentFolder.items = currentFolder.items.filter(
                (item) =>
                    !("folderName" in item) || item.folderName !== folder.folderName
            );

            const idsToClose = collectFileIdsInFolder(folder, templateData);

            set((state) => {
                const newOpenFiles = state.openFiles.filter((f) => !idsToClose.has(f.id));

                let newActiveFileId = state.activeFileId;
                let newEditorContent = state.editorContent;

                if (state.activeFileId && idsToClose.has(state.activeFileId)) {
                    if (newOpenFiles.length > 0) {
                        const lastFile = newOpenFiles[newOpenFiles.length - 1];
                        newActiveFileId = lastFile.id;
                        newEditorContent = lastFile.content;
                    } else {
                        newActiveFileId = null;
                        newEditorContent = "";
                    }
                }

                return {
                    templateData: updatedTemplateData,
                    openFiles: newOpenFiles,
                    activeFileId: newActiveFileId,
                    editorContent: newEditorContent,
                };
            });

            await saveTemplateData(updatedTemplateData);

            if (instance && instance.fs) {
                const folderPath = parentPath
                    ? `${parentPath}/${folder.folderName}`
                    : folder.folderName;
                await instance.fs.rm(folderPath, { recursive: true, force: true });
            }

            toast.success(`Deleted folder: ${folder.folderName}`);
        } catch (error) {
            console.error("Error deleting folder:", error);
            toast.error("Failed to delete folder");
        }
    },

    handleRenameFile: async (
        file,
        newFilename,
        newExtension,
        parentPath,
        instance,
        saveTemplateData
    ) => {
        const { templateData, openFiles, activeFileId } = get();
        if (!templateData) return;

        const oldFileId = generateFileId(file, templateData);

        try {
            const updatedTemplateData = deepClone(templateData);

            const currentFolder = traverseToFolder(updatedTemplateData, parentPath);

            const fileIndex = currentFolder.items.findIndex(
                (item) =>
                    "filename" in item &&
                    item.filename === file.filename &&
                    item.fileExtension === file.fileExtension
            );

            if (fileIndex === -1) return;

            const updatedFile = {
                ...currentFolder.items[fileIndex],
                filename: newFilename,
                fileExtension: newExtension,
            } as TemplateFile;

            currentFolder.items[fileIndex] = updatedFile;
            currentFolder.items = sortFolderItems(currentFolder.items);

            const newFileId = generateFileId(updatedFile, updatedTemplateData);

            if (instance && instance.fs) {
                const oldPath = parentPath
                    ? `${parentPath}/${file.filename}.${file.fileExtension}`
                    : `${file.filename}.${file.fileExtension}`;

                const newPath = parentPath
                    ? `${parentPath}/${newFilename}.${newExtension}`
                    : `${newFilename}.${newExtension}`;

                try {
                    await instance.fs.stat(oldPath);
                    await instance.fs.rename(oldPath, newPath);
                } catch (fsError) {
                    console.warn(
                        "File not found in WebContainer FS, skipping fs rename:",
                        fsError
                    );
                }
            }

            const updatedOpenFiles = openFiles.map((f) =>
                f.id === oldFileId
                    ? {
                        ...f,
                        id: newFileId,
                        filename: newFilename,
                        fileExtension: newExtension,
                    }
                    : f
            );

            let newEditorContent = get().editorContent;

            if (activeFileId === oldFileId) {
                const activeFile = updatedOpenFiles.find((f) => f.id === newFileId);
                newEditorContent = activeFile?.content || "";
            }

            set({
                templateData: updatedTemplateData,
                openFiles: updatedOpenFiles,
                activeFileId: activeFileId === oldFileId ? newFileId : activeFileId,
                editorContent: newEditorContent,
            });

            await saveTemplateData(updatedTemplateData);

            toast.success(`Renamed file to: ${newFilename}.${newExtension}`);
        } catch (error) {
            console.error("Error renaming file:", error);
            toast.error("Failed to rename file");
        }
    },

    handleRenameFolder: async (
        folder,
        newFolderName,
        parentPath,
        instance,
        saveTemplateData
    ) => {
        const { templateData } = get();
        if (!templateData) return;

        try {
            const updatedTemplateData = deepClone(templateData);

            const currentFolder = traverseToFolder(updatedTemplateData, parentPath);

            const folderIndex = currentFolder.items.findIndex(
                (item) => "folderName" in item && item.folderName === folder.folderName
            );

            if (folderIndex === -1) return;

            const updatedFolder = {
                ...currentFolder.items[folderIndex],
                folderName: newFolderName,
            } as TemplateFolder;

            currentFolder.items[folderIndex] = updatedFolder;
            currentFolder.items = sortFolderItems(currentFolder.items);

            if (instance && instance.fs) {
                const oldPath = parentPath
                    ? `${parentPath}/${folder.folderName}`
                    : folder.folderName;

                const newPath = parentPath
                    ? `${parentPath}/${newFolderName}`
                    : newFolderName;

                try {
                    await instance.fs.stat(oldPath);
                    await instance.fs.rename(oldPath, newPath);
                } catch (fsError) {
                    console.warn(
                        "Folder not found in WebContainer FS, skipping fs rename:",
                        fsError
                    );
                }
            }

            set({ templateData: updatedTemplateData });

            await saveTemplateData(updatedTemplateData);

            toast.success(`Renamed folder to: ${newFolderName}`);
        } catch (error) {
            console.error("Error renaming folder:", error);
            toast.error("Failed to rename folder");
        }
    },

    updateFileContent: (fileId, content) => {
        set((state) => ({
            openFiles: state.openFiles.map((file) =>
                file.id === fileId
                    ? {
                        ...file,
                        content,
                        hasUnsavedChanges: content !== file.originalContent,
                    }
                    : file
            ),
            editorContent:
                fileId === state.activeFileId ? content : state.editorContent,
        }));
    },
});

export const useFileExplorer = create<FileExplorerState>(fileExplorerStore);