import { useState } from "react";
import { File, FileText, Image, Video, Music, Archive, Folder, FolderOpen, Home, ChevronRight, Check } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useDrive, DriveFile as DriveFileType } from "../context/DriveContext";

interface DriveFilePickerProps {
  onSelectFiles: (files: DriveFileType[]) => void;
  selectedFileIds?: number[];
}

const getFileIcon = (type: string, size: string = "w-6 h-6") => {
  const className = size;
  if (type.startsWith("image/")) return <Image className={`${className} text-blue-500`} />;
  if (type.startsWith("video/")) return <Video className={`${className} text-purple-500`} />;
  if (type.startsWith("audio/")) return <Music className={`${className} text-pink-500`} />;
  if (type.includes("pdf")) return <FileText className={`${className} text-red-500`} />;
  if (type.includes("zip") || type.includes("rar")) return <Archive className={`${className} text-yellow-500`} />;
  return <File className={`${className} text-gray-500`} />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export default function DriveFilePicker({ onSelectFiles, selectedFileIds = [] }: DriveFilePickerProps) {
  const { files, folders } = useDrive();
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [localSelectedIds, setLocalSelectedIds] = useState<number[]>(selectedFileIds);

  const getBreadcrumbs = () => {
    const breadcrumbs: typeof folders = [];
    let folderId = currentFolderId;

    while (folderId !== null) {
      const folder = folders.find((f) => f.id === folderId);
      if (folder) {
        breadcrumbs.unshift(folder);
        folderId = folder.parentId;
      } else {
        break;
      }
    }

    return breadcrumbs;
  };

  const currentFolderFiles = files.filter((file) => {
    const inCurrentFolder = file.folderId === currentFolderId;
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    return inCurrentFolder && matchesSearch;
  });

  const currentSubfolders = folders.filter((f) => f.parentId === currentFolderId);

  const toggleFileSelection = (fileId: number) => {
    if (localSelectedIds.includes(fileId)) {
      setLocalSelectedIds(localSelectedIds.filter((id) => id !== fileId));
    } else {
      setLocalSelectedIds([...localSelectedIds, fileId]);
    }
  };

  const handleConfirmSelection = () => {
    const selectedFiles = files.filter((f) => localSelectedIds.includes(f.id));
    onSelectFiles(selectedFiles);
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 flex-wrap pb-3 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentFolderId(null)}
          className={currentFolderId === null ? "text-blue-600" : ""}
        >
          <Home className="w-4 h-4 mr-1" />
          Root
        </Button>
        {breadcrumbs.map((folder, index) => (
          <div key={folder.id} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentFolderId(folder.id)}
              className={index === breadcrumbs.length - 1 ? "text-blue-600" : ""}
            >
              {folder.name}
            </Button>
          </div>
        ))}
      </div>

      {/* Search */}
      <Input
        placeholder="Search files..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Selection Info */}
      {localSelectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-900">
            <strong>{localSelectedIds.length}</strong> file(s) selected
          </p>
        </div>
      )}

      {/* Content Area */}
      <div className="max-h-[400px] overflow-y-auto space-y-4">
        {/* Folders */}
        {currentSubfolders.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Folders</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {currentSubfolders.map((folder) => (
                <Card
                  key={folder.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setCurrentFolderId(folder.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{folder.name}</p>
                        <p className="text-xs text-gray-500">
                          {files.filter((f) => f.folderId === folder.id).length} file(s)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Files */}
        {currentFolderFiles.length > 0 ? (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Files</h4>
            <div className="space-y-2">
              {currentFolderFiles.map((file) => {
                const isSelected = localSelectedIds.includes(file.id);
                return (
                  <Card
                    key={file.id}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50 border-blue-500 border-2"
                        : "hover:bg-gray-50 border"
                    }`}
                    onClick={() => toggleFileSelection(file.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{file.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            {file.tags.length > 0 && (
                              <div className="flex gap-1 flex-wrap">
                                {file.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                                    {tag}
                                  </Badge>
                                ))}
                                {file.tags.length > 2 && (
                                  <Badge variant="secondary" className="text-xs px-1 py-0">
                                    +{file.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : currentSubfolders.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Folder className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 text-sm">
              {files.length === 0 ? "No files in Drive yet" : "This folder is empty"}
            </p>
            {searchTerm && (
              <p className="text-gray-500 text-xs mt-1">Try adjusting your search</p>
            )}
          </div>
        ) : null}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button
          onClick={handleConfirmSelection}
          disabled={localSelectedIds.length === 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add {localSelectedIds.length > 0 && `(${localSelectedIds.length})`} File(s)
        </Button>
      </div>
    </div>
  );
}
