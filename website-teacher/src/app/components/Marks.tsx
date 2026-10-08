import { useState } from "react";
import { Search, Save, Download, Plus, TrendingUp, FileSpreadsheet, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { toast } from "sonner";

interface StudentMark {
  id: number;
  name: string;
  rollNumber: string;
  marks: number | null;
  grade: string;
}

export default function Marks() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [students, setStudents] = useState<StudentMark[]>([
    { id: 1, name: "Alice Johnson", rollNumber: "MT101", marks: 95, grade: "A+" },
    { id: 2, name: "Bob Smith", rollNumber: "MT102", marks: 88, grade: "A" },
    { id: 3, name: "Charlie Brown", rollNumber: "MT103", marks: 76, grade: "B" },
    { id: 4, name: "Diana Prince", rollNumber: "MT104", marks: 92, grade: "A+" },
    { id: 5, name: "Edward Norton", rollNumber: "MT105", marks: 84, grade: "A" },
    { id: 6, name: "Fiona Green", rollNumber: "MT106", marks: 71, grade: "B" },
    { id: 7, name: "George Wilson", rollNumber: "MT107", marks: 89, grade: "A" },
    { id: 8, name: "Hannah Lee", rollNumber: "MT108", marks: 94, grade: "A+" },
    { id: 9, name: "Ian Wright", rollNumber: "MT109", marks: 78, grade: "B" },
    { id: 10, name: "Julia Roberts", rollNumber: "MT110", marks: 86, grade: "A" },
  ]);

  const classes = [
    "Advanced Mathematics - Grade 10",
    "Physics Fundamentals - Grade 11",
    "Organic Chemistry - Grade 12",
    "English Literature - Grade 10",
    "World History - Grade 11",
    "Computer Science - Grade 12",
  ];

  const examTypes = [
    "Mid-term Exam",
    "Final Exam",
    "Unit Test 1",
    "Unit Test 2",
    "Assignment 1",
    "Assignment 2",
    "Quiz 1",
    "Quiz 2",
  ];

  const calculateGrade = (marks: number): string => {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B";
    if (marks >= 60) return "C";
    if (marks >= 50) return "D";
    return "F";
  };

  const updateMarks = (id: number, value: string) => {
    const marks = value === "" ? null : parseFloat(value);
    setStudents(
      students.map((student) =>
        student.id === id
          ? {
              ...student,
              marks,
              grade: marks !== null ? calculateGrade(marks) : "-",
            }
          : student
      )
    );
  };

  const handleSaveMarks = () => {
    if (!selectedClass || !selectedExam) {
      toast.error("Please select class and exam type");
      return;
    }
    toast.success("Marks saved successfully!");
  };

  const handleExportMarks = () => {
    if (!selectedClass || !selectedExam) {
      toast.error("Please select class and exam type");
      return;
    }
    toast.success("Marks exported successfully!");
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validMarks = students.filter((s) => s.marks !== null).map((s) => s.marks!);
  const averageMarks = validMarks.length > 0
    ? (validMarks.reduce((a, b) => a + b, 0) / validMarks.length).toFixed(1)
    : "0";
  const highestMarks = validMarks.length > 0 ? Math.max(...validMarks) : 0;
  const lowestMarks = validMarks.length > 0 ? Math.min(...validMarks) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Marks Entry</h2>
        <p className="text-gray-600 mt-1">Enter and manage student marks</p>
      </div>

      {/* Selection Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Select Class and Exam</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="class-select">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class-select">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exam-select">Exam Type</Label>
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger id="exam-select">
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  {examTypes.map((exam) => (
                    <SelectItem key={exam} value={exam}>
                      {exam}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {selectedClass && selectedExam && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Average</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{averageMarks}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Highest</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{highestMarks}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Lowest</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{lowestMarks}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{students.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Marks Entry */}
      {selectedClass && selectedExam && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Enter Marks</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={handleSaveMarks} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Marks
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleExportMarks()}>
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Export as Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExportMarks()}>
                      <FileText className="w-4 h-4 mr-2" />
                      Export as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="entry" className="space-y-4">
              <TabsList>
                <TabsTrigger value="entry">Marks Entry</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="entry" className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or roll number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Student Marks Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Roll No.</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Student Name</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Marks (Out of 100)</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student) => (
                          <tr key={student.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-900">{student.rollNumber}</td>
                            <td className="py-3 px-4 text-gray-900">{student.name}</td>
                            <td className="py-3 px-4">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={student.marks ?? ""}
                                onChange={(e) => updateMarks(student.id, e.target.value)}
                                className="max-w-[120px] mx-auto text-center"
                                placeholder="Enter marks"
                              />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                  student.grade === "A+" || student.grade === "A"
                                    ? "bg-green-100 text-green-700"
                                    : student.grade === "B" || student.grade === "C"
                                    ? "bg-blue-100 text-blue-700"
                                    : student.grade === "D"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : student.grade === "F"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {student.grade}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Grade Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Grade Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {["A+", "A", "B", "C", "D", "F"].map((grade) => {
                          const count = students.filter((s) => s.grade === grade).length;
                          const percentage = ((count / students.length) * 100).toFixed(0);
                          return (
                            <div key={grade} className="flex items-center gap-3">
                              <div className="w-12 font-medium text-gray-700">{grade}</div>
                              <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                                <div
                                  className={`h-full flex items-center justify-end px-2 text-xs text-white ${
                                    grade === "A+" || grade === "A"
                                      ? "bg-green-500"
                                      : grade === "B" || grade === "C"
                                      ? "bg-blue-500"
                                      : grade === "D"
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                >
                                  {count > 0 && `${count}`}
                                </div>
                              </div>
                              <div className="w-16 text-right text-sm text-gray-600">
                                {percentage}%
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-green-600 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {students.filter((s) => (s.marks ?? 0) >= 90).length} students scored above 90%
                            </p>
                            <p className="text-sm text-gray-600 mt-1">Excellent performance</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-blue-600 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {students.filter((s) => (s.marks ?? 0) >= 60 && (s.marks ?? 0) < 90).length} students in average range
                            </p>
                            <p className="text-sm text-gray-600 mt-1">Good performance</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-red-600 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {students.filter((s) => (s.marks ?? 0) < 60 && s.marks !== null).length} students need attention
                            </p>
                            <p className="text-sm text-gray-600 mt-1">Below 60%</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}