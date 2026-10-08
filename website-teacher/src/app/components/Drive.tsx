import { useState, useRef } from "react";
import { Upload, File, FileText, Image, Video, Music, Archive, X, Tag, Plus, Search, Download, Trash2, Filter, Folder, FolderPlus, Home, ChevronRight, Edit2, FolderOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { useDrive, DriveFolder } from "../context/DriveContext";

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return <Image className="w-8 h-8 text-blue-500" />;
  if (type.startsWith("video/")) return <Video className="w-8 h-8 text-purple-500" />;
  if (type.startsWith("audio/")) return <Music className="w-8 h-8 text-pink-500" />;
  if (type.includes("pdf")) return <FileText className="w-8 h-8 text-red-500" />;
  if (type.includes("zip") || type.includes("rar")) return <Archive className="w-8 h-8 text-yellow-500" />;
  return <File className="w-8 h-8 text-gray-500" />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export default function Drive() {
  const driveContext = useDrive();
  const { files, folders, addFiles, addFolder, deleteFile, deleteFolder, updateFile, updateFolder } = driveContext;

  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAddTagDialogOpen, setIsAddTagDialogOpen] = useState(false);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [isRenameFolderDialogOpen, setIsRenameFolderDialogOpen] = useState(false);
  const [currentFileId, setCurrentFileId] = useState<number | null>(null);
  const [newTag, setNewTag] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [renameFolderId, setRenameFolderId] = useState<number | null>(null);
  const [renameFolderName, setRenameFolderName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Predefined tags
  const [availableTags] = useState<string[]>([
    "Lecture Notes",
    "Assignment",
    "Lab Material",
    "Question Papers",
    "Syllabus",
    "Reference Books",
    "Videos",
    "Projects",
    "Study Material",
    "Presentations",
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    const newFiles = Array.from(uploadedFiles).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date(),
      tags: [],
      file: file,
      folderId: currentFolderId,
    }));

    addFiles(newFiles);
    toast.success(`${newFiles.length} file(s) uploaded successfully!`);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddFilesClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteFileClick = (id: number) => {
    deleteFile(id);
    toast.success("File deleted successfully!");
  };

  const handleDownloadFile = (file: typeof files[0]) => {
    const url = URL.createObjectURL(file.file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  const openAddTagDialog = (fileId: number) => {
    setCurrentFileId(fileId);
    setIsAddTagDialogOpen(true);
  };

  const handleAddTagToFile = (tag: string) => {
    if (!currentFileId) return;

    const file = files.find((f) => f.id === currentFileId);
    if (file && !file.tags.includes(tag)) {
      updateFile(currentFileId, { tags: [...file.tags, tag] });
    }
  };

  const handleAddCustomTag = () => {
    if (!currentFileId || !newTag.trim()) return;

    const file = files.find((f) => f.id === currentFileId);
    if (file && !file.tags.includes(newTag.trim())) {
      updateFile(currentFileId, { tags: [...file.tags, newTag.trim()] });
    }

    setNewTag("");
    toast.success("Tag added successfully!");
  };

  const handleRemoveTagFromFile = (fileId: number, tag: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file) {
      updateFile(fileId, { tags: file.tags.filter((t) => t !== tag) });
    }
  };

  const toggleTagFilter = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSearchTerm("");
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast.error("Folder name cannot be empty!");
      return;
    }

    const newFolder: DriveFolder = {
      id: Date.now(),
      name: newFolderName.trim(),
      createdDate: new Date(),
      parentId: currentFolderId,
    };
    addFolder(newFolder);
    setNewFolderName("");
    setIsCreateFolderDialogOpen(false);
    toast.success("Folder created successfully!");
  };

  const handleDeleteFolderClick = (id: number) => {
    const filesToDelete = files.filter((f) => f.folderId === id);
    deleteFolder(id);
    toast.success(`Folder deleted! ${filesToDelete.length} file(s) removed.`);
  };

  const handleOpenFolder = (id: number) => {
    setCurrentFolderId(id);
  };

  const handleGoToRoot = () => {
    setCurrentFolderId(null);
  };

  const handleGoBack = () => {
    if (currentFolderId !== null) {
      const currentFolder = folders.find((f) => f.id === currentFolderId);
      if (currentFolder) {
        setCurrentFolderId(currentFolder.parentId);
      }
    }
  };

  const openRenameDialog = (folderId: number) => {
    const folder = folders.find((f) => f.id === folderId);
    if (folder) {
      setRenameFolderId(folderId);
      setRenameFolderName(folder.name);
      setIsRenameFolderDialogOpen(true);
    }
  };

  const handleRenameFolder = () => {
    if (!renameFolderName.trim() || renameFolderId === null) {
      toast.error("Folder name cannot be empty!");
      return;
    }

    updateFolder(renameFolderId, { name: renameFolderName.trim() });

    setIsRenameFolderDialogOpen(false);
    setRenameFolderId(null);
    setRenameFolderName("");
    toast.success("Folder renamed successfully!");
  };

  const getBreadcrumbs = () => {
    const breadcrumbs: DriveFolder[] = [];
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

  const allUsedTags = Array.from(new Set(files.flatMap((file) => file.tags)));

  const currentFolderFiles = files.filter((file) => {
    const inCurrentFolder = file.folderId === currentFolderId;
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((tag) => file.tags.includes(tag));

    return inCurrentFolder && matchesSearch && matchesTags;
  });

  const currentSubfolders = folders.filter((f) => f.parentId === currentFolderId);

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Teaching Materials Drive</h2>
          <p className="text-gray-600 mt-1">Store and organize your teaching materials</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateFolderDialogOpen(true)} variant="outline" className="flex-1 sm:flex-none">
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <Button onClick={handleAddFilesClick} className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none">
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
        accept="*/*"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Total Files</p>
                <File className="w-8 h-8 text-blue-500 opacity-20" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{files.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Folders</p>
                <Folder className="w-8 h-8 text-orange-500 opacity-20" />
              </div>
              <p className="text-3xl font-bold text-orange-600">{folders.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Storage</p>
                <Archive className="w-8 h-8 text-purple-500 opacity-20" />
              </div>
              <p className="text-2xl font-bold text-purple-600">{formatFileSize(totalSize)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Tags</p>
                <Tag className="w-8 h-8 text-green-500 opacity-20" />
              </div>
              <p className="text-3xl font-bold text-green-600">{allUsedTags.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoToRoot}
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
                  onClick={() => handleOpenFolder(folder.id)}
                  className={index === breadcrumbs.length - 1 ? "text-blue-600" : ""}
                >
                  {folder.name}
                </Button>
              </div>
            ))}
            {currentFolderId !== null && (
              <Button variant="outline" size="sm" onClick={handleGoBack} className="ml-auto">
                Go Back
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filter Files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search files by name or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {allUsedTags.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter by Tags
                </Label>
                {selectedTags.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {allUsedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      selectedTags.includes(tag)
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => toggleTagFilter(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {currentSubfolders.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Folders</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {currentSubfolders.map((folder) => {
              const filesInFolder = files.filter((f) => f.folderId === folder.id).length;
              return (
                <Card
                  key={folder.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => handleOpenFolder(folder.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center">
                      <FolderOpen className="w-16 h-16 text-yellow-500 mb-2" />
                      <p className="font-semibold text-sm text-center truncate w-full" title={folder.name}>
                        {folder.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{filesInFolder} file(s)</p>
                      <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            openRenameDialog(folder.id);
                          }}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-600 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFolderClick(folder.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {currentFolderFiles.length === 0 && currentSubfolders.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {files.length === 0 ? "No files yet" : "This folder is empty"}
              </h3>
              <p className="text-gray-600 mb-4">Upload your teaching materials to get started</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setIsCreateFolderDialogOpen(true)} variant="outline">
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Create Folder
                </Button>
                <Button onClick={handleAddFilesClick} className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : currentFolderFiles.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Files</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentFolderFiles.map((file) => (
              <Card key={file.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    {getFileIcon(file.type)}
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownloadFile(file)}
                        className="h-8 w-8"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteFileClick(file.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1 truncate" title={file.name}>
                    {file.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{formatFileSize(file.size)}</p>

                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {file.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                          <X
                            className="w-3 h-3 ml-1 cursor-pointer hover:text-red-600"
                            onClick={() => handleRemoveTagFromFile(file.id, tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openAddTagDialog(file.id)}
                      className="w-full"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      Add Tags
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500">
                    Uploaded: {file.uploadDate.toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : null}

      <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>Enter a name for your new folder</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleCreateFolder();
                  }
                }}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => {
                setIsCreateFolderDialogOpen(false);
                setNewFolderName("");
              }}>
                Cancel
              </Button>
              <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                <FolderPlus className="w-4 h-4 mr-2" />
                Create Folder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isRenameFolderDialogOpen} onOpenChange={setIsRenameFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
            <DialogDescription>Enter a new name for this folder</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="rename-folder">Folder Name</Label>
              <Input
                id="rename-folder"
                value={renameFolderName}
                onChange={(e) => setRenameFolderName(e.target.value)}
                placeholder="Enter new folder name"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleRenameFolder();
                  }
                }}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => {
                setIsRenameFolderDialogOpen(false);
                setRenameFolderId(null);
                setRenameFolderName("");
              }}>
                Cancel
              </Button>
              <Button onClick={handleRenameFolder} disabled={!renameFolderName.trim()}>
                <Edit2 className="w-4 h-4 mr-2" />
                Rename
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddTagDialogOpen} onOpenChange={setIsAddTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tags</DialogTitle>
            <DialogDescription>Select from predefined tags or create a custom one</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="mb-2 block">Predefined Tags</Label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => handleAddTagToFile(tag)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <Label htmlFor="custom-tag" className="mb-2 block">
                Custom Tag
              </Label>
              <div className="flex gap-2">
                <Input
                  id="custom-tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter custom tag name"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddCustomTag();
                    }
                  }}
                />
                <Button onClick={handleAddCustomTag} disabled={!newTag.trim()}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button
              onClick={() => {
                setIsAddTagDialogOpen(false);
                setNewTag("");
              }}
              className="w-full"
              variant="outline"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}