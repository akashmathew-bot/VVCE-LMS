import { useState, useRef } from "react";
import { Plus, Upload, Calendar, Users, CheckCircle, XCircle, Clock, FileText, Eye, Download, Trash2, FolderOpen, HardDrive, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import DriveFilePicker from "./DriveFilePicker";
import { DriveFile } from "../context/DriveContext";

interface Assignment {
  id: number;
  title: string;
  description: string;
  className: string;
  deadline: Date;
  materials: MaterialFile[];
  createdDate: Date;
  totalStudents: number;
}

interface MaterialFile {
  id: number;
  name: string;
  size: number;
  source: "local" | "drive";
  file?: File;
  driveFile?: DriveFile;
}

interface Submission {
  id: number;
  assignmentId: number;
  studentName: string;
  rollNumber: string;
  submittedDate: Date;
  files: File[];
  status: "submitted" | "late" | "pending";
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date: Date): string => {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([
    // Mock data for demonstration
    {
      id: 1,
      assignmentId: 1,
      studentName: "Rahul Kumar",
      rollNumber: "4VK21CS001",
      submittedDate: new Date(2025, 3, 15, 14, 30),
      files: [],
      status: "submitted",
    },
    {
      id: 2,
      assignmentId: 1,
      studentName: "Priya Sharma",
      rollNumber: "4VK21CS002",
      submittedDate: new Date(2025, 3, 16, 10, 15),
      files: [],
      status: "submitted",
    },
    {
      id: 3,
      assignmentId: 1,
      studentName: "Amit Patel",
      rollNumber: "4VK21CS003",
      submittedDate: new Date(2025, 3, 18, 16, 45),
      files: [],
      status: "late",
    },
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewSubmissionsOpen, setIsViewSubmissionsOpen] = useState(false);
  const [isAddMaterialDialogOpen, setIsAddMaterialDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState<string>("All Classes");

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [deadline, setDeadline] = useState("");
  const [materials, setMaterials] = useState<MaterialFile[]>([]);
  const [materialSource, setMaterialSource] = useState<"local" | "drive">("local");
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Available classes
  const classes = [
    "Data Structures & Algorithms (4VK21CS)",
    "Operating Systems (4VK21CS)",
    "Computer Networks (4VK21CS)",
    "Database Management Systems (4VK21CS)",
    "Machine Learning (4VK21CS)",
    "Web Technologies (4VK21CS)",
    "Software Engineering (4VK21CS)",
    "Artificial Intelligence (4VK21CS)",
  ];

  // Mock students per class
  const studentsPerClass: { [key: string]: number } = {
    "Data Structures & Algorithms (4VK21CS)": 65,
    "Operating Systems (4VK21CS)": 62,
    "Computer Networks (4VK21CS)": 68,
    "Database Management Systems (4VK21CS)": 60,
    "Machine Learning (4VK21CS)": 55,
    "Web Technologies (4VK21CS)": 58,
    "Software Engineering (4VK21CS)": 63,
    "Artificial Intelligence (4VK21CS)": 57,
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const newMaterials: MaterialFile[] = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: file.size,
      source: "local",
      file: file,
    }));

    setMaterials([...materials, ...newMaterials]);
    toast.success(`${newMaterials.length} file(s) added!`);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleRemoveMaterial = (id: number) => {
    setMaterials(materials.filter((m) => m.id !== id));
  };

  const handleCreateAssignment = () => {
    if (!title.trim() || !description.trim() || !selectedClass || !deadline) {
      toast.error("Please fill all required fields!");
      return;
    }

    const newAssignment: Assignment = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      className: selectedClass,
      deadline: new Date(deadline),
      materials: materials,
      createdDate: new Date(),
      totalStudents: studentsPerClass[selectedClass] || 60,
    };

    setAssignments([newAssignment, ...assignments]);
    
    // Reset form
    setTitle("");
    setDescription("");
    setSelectedClass("");
    setDeadline("");
    setMaterials([]);
    setIsCreateDialogOpen(false);
    
    toast.success("Assignment created successfully!");
  };

  const handleDeleteAssignment = (id: number) => {
    setAssignments(assignments.filter((a) => a.id !== id));
    setSubmissions(submissions.filter((s) => s.assignmentId !== id));
    toast.success("Assignment deleted successfully!");
  };

  const handleViewSubmissions = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsViewSubmissionsOpen(true);
  };

  const getSubmissionStats = (assignmentId: number, totalStudents: number) => {
    const assignmentSubmissions = submissions.filter((s) => s.assignmentId === assignmentId);
    const submitted = assignmentSubmissions.filter((s) => s.status === "submitted").length;
    const late = assignmentSubmissions.filter((s) => s.status === "late").length;
    const pending = totalStudents - assignmentSubmissions.length;

    return { submitted, late, pending, total: assignmentSubmissions.length };
  };

  const isDeadlinePassed = (deadline: Date): boolean => {
    return new Date() > deadline;
  };

  // Filter assignments
  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === "All Classes" || assignment.className === filterClass;

    return matchesSearch && matchesClass;
  });

  const selectedAssignmentSubmissions = selectedAssignment
    ? submissions.filter((s) => s.assignmentId === selectedAssignment.id)
    : [];

  const allClasses = ["All Classes", ...classes];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Assignments</h2>
          <p className="text-gray-600 mt-1">Create and manage course assignments</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <FileText className="w-8 h-8 text-blue-500 opacity-20" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{assignments.length}</p>
              <p className="text-xs text-gray-500 mt-1">Assignments</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <CheckCircle className="w-8 h-8 text-green-500 opacity-20" />
              </div>
              <p className="text-3xl font-bold text-green-600">
                {assignments.filter((a) => !isDeadlinePassed(a.deadline)).length}
              </p>
              <p className="text-xs text-gray-500 mt-1">In progress</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <Clock className="w-8 h-8 text-purple-500 opacity-20" />
              </div>
              <p className="text-3xl font-bold text-purple-600">
                {assignments.filter((a) => isDeadlinePassed(a.deadline)).length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Past deadline</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Classes</p>
                <Users className="w-8 h-8 text-orange-500 opacity-20" />
              </div>
              <p className="text-3xl font-bold text-orange-600">{classes.length}</p>
              <p className="text-xs text-gray-500 mt-1">Total classes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-64">
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {allClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {assignments.length === 0 ? "No assignments yet" : "No assignments found"}
              </h3>
              <p className="text-gray-600 mb-4">
                {assignments.length === 0
                  ? "Create your first assignment to get started"
                  : "Try adjusting your search or filters"}
              </p>
              {assignments.length === 0 && (
                <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assignment
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredAssignments.map((assignment) => {
            const stats = getSubmissionStats(assignment.id, assignment.totalStudents);
            const deadlinePassed = isDeadlinePassed(assignment.deadline);

            return (
              <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{assignment.title}</h3>
                        {deadlinePassed ? (
                          <Badge variant="secondary" className="bg-gray-200">
                            <Clock className="w-3 h-3 mr-1" />
                            Closed
                          </Badge>
                        ) : (
                          <Badge className="bg-green-500">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{assignment.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span className="font-medium">{assignment.className}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Deadline: {formatDate(assignment.deadline)}</span>
                        </div>
                        {assignment.materials.length > 0 && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{assignment.materials.length} material(s)</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewSubmissions(assignment)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Submissions
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Submission Stats */}
                  <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{assignment.totalStudents}</p>
                      <p className="text-xs text-gray-600 mt-1">Total Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{stats.submitted}</p>
                      <p className="text-xs text-gray-600 mt-1">Submitted</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{stats.late}</p>
                      <p className="text-xs text-gray-600 mt-1">Late</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{stats.pending}</p>
                      <p className="text-xs text-gray-600 mt-1">Pending</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Submission Progress</span>
                      <span className="font-semibold text-gray-900">
                        {Math.round((stats.total / assignment.totalStudents) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${(stats.total / assignment.totalStudents) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Assignment Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>Fill in the details to create a new assignment</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-base font-semibold">
                Assignment Title *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Binary Search Tree Implementation"
                className="mt-2"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-base font-semibold">
                Description *
              </Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the assignment requirements, learning objectives, and any special instructions..."
                className="w-full mt-2 min-h-[120px] px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Class Selection */}
            <div>
              <Label htmlFor="class" className="text-base font-semibold">
                Assign to Class *
              </Label>
              <select
                id="class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full mt-2 h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a class</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
              {selectedClass && (
                <p className="text-sm text-gray-600 mt-1">
                  This assignment will be sent to {studentsPerClass[selectedClass]} students
                </p>
              )}
            </div>

            {/* Deadline */}
            <div>
              <Label htmlFor="deadline" className="text-base font-semibold">
                Deadline *
              </Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Materials */}
            <div>
              <Label className="text-base font-semibold">Add Materials</Label>
              <p className="text-sm text-gray-600 mb-3">
                Upload reference materials, instructions, or resources for students
              </p>

              {/* Material Source Selection */}
              <div className="flex gap-2 mb-4">
                <Button
                  type="button"
                  variant={materialSource === "local" ? "default" : "outline"}
                  onClick={() => setMaterialSource("local")}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload from Device
                </Button>
                <Button
                  type="button"
                  variant={materialSource === "drive" ? "default" : "outline"}
                  onClick={() => setMaterialSource("drive")}
                  className="flex-1"
                >
                  <HardDrive className="w-4 h-4 mr-2" />
                  Select from Drive
                </Button>
              </div>

              {/* Conditional Content Based on Source */}
              {materialSource === "local" ? (
                <>
                  {/* Drag and Drop Area */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-700 font-medium mb-1">
                      Drag and drop files here, or click to browse
                    </p>
                    <p className="text-sm text-gray-500 mb-4">Supports all file types</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Browse Files
                    </Button>
                  </div>
                </>
              ) : (
                <DriveFilePicker
                  onSelectFiles={(driveFiles) => {
                    const newMaterials: MaterialFile[] = driveFiles.map((driveFile) => ({
                      id: driveFile.id,
                      name: driveFile.name,
                      size: driveFile.size,
                      source: "drive",
                      driveFile: driveFile,
                    }));
                    setMaterials([...materials, ...newMaterials]);
                    toast.success(`${newMaterials.length} file(s) added from Drive!`);
                  }}
                  selectedFileIds={materials.filter((m) => m.source === "drive").map((m) => m.id)}
                />
              )}

              {/* Materials List */}
              {materials.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label className="text-sm font-semibold">Added Materials ({materials.length})</Label>
                  {materials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-3 bg-white border rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="w-8 h-8 text-blue-500" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 truncate">{material.name}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(material.size)}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMaterial(material.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setTitle("");
                  setDescription("");
                  setSelectedClass("");
                  setDeadline("");
                  setMaterials([]);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreateAssignment}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Submissions Dialog */}
      <Dialog open={isViewSubmissionsOpen} onOpenChange={setIsViewSubmissionsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAssignment?.title} - Submissions</DialogTitle>
            <DialogDescription>
              {selectedAssignment?.className} • Deadline: {selectedAssignment && formatDate(selectedAssignment.deadline)}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {/* Stats Summary */}
            {selectedAssignment && (
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedAssignment.totalStudents}</p>
                    <p className="text-xs text-gray-600 mt-1">Total</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {getSubmissionStats(selectedAssignment.id, selectedAssignment.totalStudents).submitted}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Submitted</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {getSubmissionStats(selectedAssignment.id, selectedAssignment.totalStudents).late}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Late</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {getSubmissionStats(selectedAssignment.id, selectedAssignment.totalStudents).pending}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Pending</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Submissions List */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Submissions</h4>
              {selectedAssignmentSubmissions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <XCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No submissions yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedAssignmentSubmissions.map((submission) => (
                    <Card key={submission.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {submission.studentName.charAt(0)}
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900">{submission.studentName}</h5>
                                <p className="text-sm text-gray-600">{submission.rollNumber}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Submitted</p>
                              <p className="text-sm font-medium text-gray-900">
                                {formatDateTime(submission.submittedDate)}
                              </p>
                            </div>
                            <Badge
                              variant={submission.status === "submitted" ? "default" : "secondary"}
                              className={
                                submission.status === "submitted"
                                  ? "bg-green-500"
                                  : submission.status === "late"
                                  ? "bg-orange-500"
                                  : "bg-gray-500"
                              }
                            >
                              {submission.status === "submitted" && <CheckCircle className="w-3 h-3 mr-1" />}
                              {submission.status === "late" && <Clock className="w-3 h-3 mr-1" />}
                              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}