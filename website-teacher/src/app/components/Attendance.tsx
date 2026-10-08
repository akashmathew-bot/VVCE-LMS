import { useState } from "react";
import { Calendar as CalendarIcon, Search, Save, Download, FileSpreadsheet, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { toast } from "sonner";
import { format } from "date-fns";

interface Student {
  id: number;
  name: string;
  rollNumber: string;
  present: boolean;
}

export default function Attendance() {
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Aarav Kumar", rollNumber: "4VP21CS001", present: true },
    { id: 2, name: "Ananya Sharma", rollNumber: "4VP21CS002", present: true },
    { id: 3, name: "Arjun Rao", rollNumber: "4VP21CS003", present: false },
    { id: 4, name: "Diya Patel", rollNumber: "4VP21CS004", present: true },
    { id: 5, name: "Ishaan Singh", rollNumber: "4VP21CS005", present: true },
    { id: 6, name: "Kavya Reddy", rollNumber: "4VP21CS006", present: false },
    { id: 7, name: "Krishna Murthy", rollNumber: "4VP21CS007", present: true },
    { id: 8, name: "Meera Desai", rollNumber: "4VP21CS008", present: true },
    { id: 9, name: "Rohan Gupta", rollNumber: "4VP21CS009", present: true },
    { id: 10, name: "Sanya Iyer", rollNumber: "4VP21CS010", present: false },
  ]);

  const classes = [
    "Data Structures - 3rd Sem CSE",
    "Digital Electronics - 3rd Sem ECE",
    "Engineering Mechanics - 3rd Sem ME",
    "Database Management Systems - 5th Sem CSE",
    "Microprocessor & Microcontroller - 5th Sem ECE",
    "Fluid Mechanics - 4th Sem CE",
    "Web Technologies - 5th Sem ISE",
    "Power Systems - 6th Sem EEE",
    "Object Oriented Programming - 3rd Sem CSE",
    "Control Systems - 5th Sem EEE",
    "Thermodynamics - 3rd Sem ME",
    "Structural Analysis - 4th Sem CE",
  ];

  const toggleAttendance = (id: number) => {
    setStudents(
      students.map((student) =>
        student.id === id ? { ...student, present: !student.present } : student
      )
    );
  };

  const toggleAll = (present: boolean) => {
    setStudents(students.map((student) => ({ ...student, present })));
  };

  const handleSaveAttendance = () => {
    if (!selectedClass) {
      toast.error("Please select a class");
      return;
    }
    toast.success("Attendance saved successfully!");
  };

  const handleExport = (format: string) => {
    if (!selectedClass) {
      toast.error("Please select a class");
      return;
    }
    toast.success(`Attendance exported as ${format.toUpperCase()} successfully!`);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const presentCount = students.filter((s) => s.present).length;
  const absentCount = students.length - presentCount;
  const attendancePercentage = ((presentCount / students.length) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Attendance</h2>
        <p className="text-gray-600 mt-1">Mark and manage student attendance</p>
      </div>

      {/* Selection Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Select Class and Date</CardTitle>
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
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {selectedClass && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{presentCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{absentCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{attendancePercentage}%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Attendance Sheet */}
      {selectedClass && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Mark Attendance</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => toggleAll(true)}>
                  Mark All Present
                </Button>
                <Button variant="outline" size="sm" onClick={() => toggleAll(false)}>
                  Mark All Absent
                </Button>
                <Button onClick={handleSaveAttendance} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleExport("excel")}>
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Export as Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("pdf")}>
                      <FileText className="w-4 h-4 mr-2" />
                      Export as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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

              {/* Student List */}
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Roll No.</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Student Name</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900">{student.rollNumber}</td>
                          <td className="py-3 px-4 text-gray-900">{student.name}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                student.present
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {student.present ? "Present" : "Absent"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Button
                              size="sm"
                              variant={student.present ? "outline" : "default"}
                              onClick={() => toggleAttendance(student.id)}
                              className={
                                student.present
                                  ? ""
                                  : "bg-green-600 hover:bg-green-700"
                              }
                            >
                              {student.present ? "Mark Absent" : "Mark Present"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
