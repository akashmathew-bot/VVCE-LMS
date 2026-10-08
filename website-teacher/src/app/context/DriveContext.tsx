import { createContext, useContext, useState, ReactNode } from "react";

export interface DriveFile {
  id: number;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  tags: string[];
  file: File;
  folderId: number | null;
}

export interface DriveFolder {
  id: number;
  name: string;
  createdDate: Date;
  parentId: number | null;
}

interface DriveContextType {
  files: DriveFile[];
  folders: DriveFolder[];
  addFiles: (newFiles: DriveFile[]) => void;
  addFolder: (folder: DriveFolder) => void;
  deleteFile: (id: number) => void;
  deleteFolder: (id: number) => void;
  updateFile: (id: number, updates: Partial<DriveFile>) => void;
  updateFolder: (id: number, updates: Partial<DriveFolder>) => void;
}

const DriveContext = createContext<DriveContextType | undefined>(undefined);

export function DriveProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [folders, setFolders] = useState<DriveFolder[]>([]);

  const addFiles = (newFiles: DriveFile[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const addFolder = (folder: DriveFolder) => {
    setFolders((prev) => [...prev, folder]);
  };

  const deleteFile = (id: number) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const deleteFolder = (id: number) => {
    // Delete all files in this folder
    setFiles((prev) => prev.filter((f) => f.folderId !== id));
    // Delete all subfolders
    const foldersToDelete = folders.filter((f) => f.parentId === id);
    foldersToDelete.forEach((folder) => deleteFolder(folder.id));
    setFolders((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFile = (id: number, updates: Partial<DriveFile>) => {
    setFiles((prev) =>
      prev.map((file) => (file.id === id ? { ...file, ...updates } : file))
    );
  };

  const updateFolder = (id: number, updates: Partial<DriveFolder>) => {
    setFolders((prev) =>
      prev.map((folder) => (folder.id === id ? { ...folder, ...updates } : folder))
    );
  };

  return (
    <DriveContext.Provider
      value={{
        files,
        folders,
        addFiles,
        addFolder,
        deleteFile,
        deleteFolder,
        updateFile,
        updateFolder,
      }}
    >
      {children}
    </DriveContext.Provider>
  );
}

export function useDrive() {
  const context = useContext(DriveContext);
  if (context === undefined) {
    throw new Error("useDrive must be used within a DriveProvider");
  }
  return context;
}
