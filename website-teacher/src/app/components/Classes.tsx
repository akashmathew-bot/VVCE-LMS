import { useState, useMemo } from "react";
import { Plus, Edit, Trash2, Users, Calendar, Clock, ChevronRight, ChevronDown, X, TrendingUp, CheckCircle, XCircle, MapPin, BookOpen, BarChart2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
import { format, subDays } from "date-fns";
import { useMarks, StudentMarksEntry } from "../context/MarksContext";

interface ClassType {
  id: number;
  name: string;
  subject: string;
  grade: string;
  students: number;
  schedule: string;
  room: string;
}

interface Student {
  id: number;
  name: string;
  rollNumber: string;
  attendance: number;
  cie1: number;
  cie2: number;
  cie3: number;
  cie4: number;
  see1: number;
  total: number;
  grade: string;
}

const STUDENT_NAMES = [
  "Aditya Kumar", "Bhavana Reddy", "Chetan Naik", "Divya Sharma", "Eshan Patel",
  "Fathima Begum", "Ganesh Rao", "Harini Menon", "Ishaan Singh", "Jyothi Nair",
  "Karthik Rajan", "Lavanya Iyer", "Manoj Hegde", "Nandini Kulkarni", "Omkar Patil",
  "Priya Venkat", "Qais Ahmed", "Riya Joshi", "Suresh Gowda", "Tanvi Bhat",
];

const GRADE_DAYS: Record<string, number[]> = {
  "Mon, Wed, Fri - 9:00 AM":  [1, 3, 5],
  "Tue, Thu - 10:00 AM":      [2, 4],
  "Mon, Wed - 11:00 AM":      [1, 3],
  "Tue, Thu, Fri - 2:00 PM":  [2, 4, 5],
  "Mon, Wed, Fri - 11:00 AM": [1, 3, 5],
  "Tue, Thu - 9:00 AM":       [2, 4],
  "Mon, Tue, Wed - 1:00 PM":  [1, 2, 3],
  "Thu, Fri - 10:00 AM":      [4, 5],
};

function seededRand(seed: number, min: number, max: number) {
  const x = Math.sin(seed) * 10000;
  return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
}

function calcGrade(total: number) {
  if (total >= 90) return "O";
  if (total >= 80) return "A+";
  if (total >= 70) return "A";
  if (total >= 60) return "B+";
  if (total >= 50) return "B";
  return "C";
}

function generateStudents(cls: ClassType): Student[] {
  return Array.from({ length: Math.min(cls.students, 20) }, (_, i) => {
    const seed = cls.id * 100 + i;
    const cie1 = seededRand(seed + 1, 20, 50);
    const cie2 = seededRand(seed + 2, 20, 50);
    const cie3 = seededRand(seed + 3, 20, 50);
    const cie4 = seededRand(seed + 4, 20, 50);
    const see1 = seededRand(seed + 5, 35, 100);
    const total = parseFloat(((cie1 + cie2 + cie3 + cie4) / 4 * 0.5 + see1 * 0.5).toFixed(1));
    return {
      id: i + 1,
      name: STUDENT_NAMES[i % STUDENT_NAMES.length],
      rollNumber: `4VP${22 + (cls.id % 3)}${cls.subject.slice(0, 2).toUpperCase()}${String(i + 1).padStart(3, "0")}`,
      attendance: seededRand(seed + 6, 60, 100),
      cie1, cie2, cie3, cie4, see1,
      total,
      grade: calcGrade(total),
    };
  });
}

function generateClassDays(cls: ClassType): Date[] {
  const weekdays = GRADE_DAYS[cls.schedule] ?? [1, 3];
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 56; i++) {
    const d = subDays(today, i);
    if (weekdays.includes(d.getDay())) days.push(d);
    if (days.length >= 20) break;
  }
  return days;
}

const GRADE_COLORS: Record<string, string> = {
  O: "bg-emerald-100 text-emerald-700",
  "A+": "bg-blue-100 text-blue-700",
  A: "bg-sky-100 text-sky-700",
  "B+": "bg-violet-100 text-violet-700",
  B: "bg-amber-100 text-amber-700",
  C: "bg-red-100 text-red-700",
};

function AttendanceDot({ pct }: { pct: number }) {
  const color = pct >= 75 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-400" : "bg-red-500";
  return <span className={`inline-block w-2 h-2 rounded-full ${color} mr-1.5`} />;
}

export default function Classes() {
  const [classes, setClasses] = useState<ClassType[]>([
    { id: 1, name: "Data Structures", subject: "Computer Science", grade: "3rd Semester CSE", students: 68, schedule: "Mon, Wed, Fri - 9:00 AM", room: "CSE Block 301" },
    { id: 2, name: "Digital Electronics", subject: "Electronics", grade: "3rd Semester ECE", students: 62, schedule: "Tue, Thu - 10:00 AM", room: "ECE Block 205" },
    { id: 3, name: "Engineering Mechanics", subject: "Mechanical", grade: "3rd Semester ME", students: 58, schedule: "Mon, Wed - 11:00 AM", room: "ME Block 101" },
    { id: 4, name: "Database Management Systems", subject: "Computer Science", grade: "5th Semester CSE", students: 65, schedule: "Tue, Thu, Fri - 2:00 PM", room: "CSE Block 402" },
    { id: 5, name: "Microprocessor & Microcontroller", subject: "Electronics", grade: "5th Semester ECE", students: 60, schedule: "Mon, Wed, Fri - 11:00 AM", room: "ECE Block 304" },
    { id: 6, name: "Fluid Mechanics", subject: "Civil Engineering", grade: "4th Semester CE", students: 55, schedule: "Tue, Thu - 9:00 AM", room: "CE Block 201" },
    { id: 7, name: "Web Technologies", subject: "Information Science", grade: "5th Semester ISE", students: 70, schedule: "Mon, Tue, Wed - 1:00 PM", room: "ISE Block 501" },
    { id: 8, name: "Power Systems", subject: "Electrical", grade: "6th Semester EEE", students: 52, schedule: "Thu, Fri - 10:00 AM", room: "EEE Block 302" },
  ]);

  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassType | null>(null);
  const [formData, setFormData] = useState({ name: "", subject: "", grade: "", students: "", schedule: "", room: "" });

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  // dailyAttendance[classId][dateKey][studentId] = present boolean
  const [dailyAttendance, setDailyAttendance] = useState<Record<number, Record<string, Record<number, boolean>>>>({});

  const students = useMemo(() => selectedClass ? generateStudents(selectedClass) : [], [selectedClass]);
  const classDays = useMemo(() => selectedClass ? generateClassDays(selectedClass) : [], [selectedClass]);

  const getDayAttendance = (classId: number, dateKey: string): Record<number, boolean> => {
    if (dailyAttendance[classId]?.[dateKey]) return dailyAttendance[classId][dateKey];
    const studs = generateStudents(classes.find((c) => c.id === classId)!);
    const init: Record<number, boolean> = {};
    studs.forEach((s) => { init[s.id] = s.attendance >= 75; });
    return init;
  };

  const toggleDayStudent = (classId: number, dateKey: string, studentId: number) => {
    const current = getDayAttendance(classId, dateKey);
    setDailyAttendance((prev) => ({
      ...prev,
      [classId]: { ...prev[classId], [dateKey]: { ...current, [studentId]: !current[studentId] } },
    }));
  };

  const saveDayAttendance = (dateKey: string) => {
    toast.success(`Attendance saved for ${dateKey}`);
  };

  const { marksData, getStudentMarks, updateStudentMark, saveMarks } = useMarks();

  // Merge entered marks into student records; default each field to 0 when not yet entered
  const studentsWithMarks = useMemo(() => students.map((s) => {
    const m = marksData[selectedClass?.id ?? -1]?.[s.id];
    const cie1 = m ? Number(m.cie1 === "" ? 0 : m.cie1) : 0;
    const cie2 = m ? Number(m.cie2 === "" ? 0 : m.cie2) : 0;
    const cie3 = m ? Number(m.cie3 === "" ? 0 : m.cie3) : 0;
    const cie4 = m ? Number(m.cie4 === "" ? 0 : m.cie4) : 0;
    const see1 = m ? Number(m.see1 === "" ? 0 : m.see1) : 0;
    const total = parseFloat(((cie1 + cie2 + cie3 + cie4) / 4 * 0.5 + see1 * 0.5).toFixed(1));
    return { ...s, cie1, cie2, cie3, cie4, see1, total, grade: calcGrade(total) };
  }), [students, marksData, selectedClass]);

  const avgAttendance = students.length ? Math.round(students.reduce((s, st) => s + st.attendance, 0) / students.length) : 0;
  const avgMarks = studentsWithMarks.length ? parseFloat((studentsWithMarks.reduce((s, st) => s + st.total, 0) / studentsWithMarks.length).toFixed(1)) : 0;
  const gradeDistribution = useMemo(() => {
    const dist: Record<string, number> = { O: 0, "A+": 0, A: 0, "B+": 0, B: 0, C: 0 };
    studentsWithMarks.forEach((s) => { dist[s.grade] = (dist[s.grade] ?? 0) + 1; });
    return dist;
  }, [studentsWithMarks]);

  const handleAddClass = () => {
    if (!formData.name || !formData.subject || !formData.grade) { toast.error("Please fill in all required fields"); return; }
    setClasses([...classes, { id: classes.length + 1, name: formData.name, subject: formData.subject, grade: formData.grade, students: 0, schedule: formData.schedule, room: formData.room }]);
    setIsAddDialogOpen(false);
    setFormData({ name: "", subject: "", grade: "", students: "", schedule: "", room: "" });
    toast.success("Class added successfully!");
  };

  const handleEditClass = () => {
    if (!editingClass) return;
    setClasses(classes.map((cls) => cls.id === editingClass.id ? { ...editingClass, name: formData.name, subject: formData.subject, grade: formData.grade, students: parseInt(formData.students) || cls.students, schedule: formData.schedule, room: formData.room } : cls));
    setIsEditDialogOpen(false);
    setEditingClass(null);
    setFormData({ name: "", subject: "", grade: "", students: "", schedule: "", room: "" });
    toast.success("Class updated successfully!");
  };

  const handleDeleteClass = (id: number) => {
    setClasses(classes.filter((cls) => cls.id !== id));
    if (selectedClass?.id === id) setSelectedClass(null);
    toast.success("Class deleted successfully!");
  };

  const openEditDialog = (classItem: ClassType) => {
    setEditingClass(classItem);
    setFormData({ name: classItem.name, subject: classItem.subject, grade: classItem.grade, students: classItem.students.toString(), schedule: classItem.schedule, room: classItem.room });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Classes</h2>
          <p className="text-gray-600 mt-1">Manage your teaching classes and schedules</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" />Add Class</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
              <DialogDescription>Fill in the class details below</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {[{ id: "name", label: "Class Name *", ph: "e.g., Data Structures" }, { id: "subject", label: "Subject *", ph: "e.g., Computer Science" }, { id: "grade", label: "Grade/Semester *", ph: "e.g., 3rd Semester CSE" }, { id: "schedule", label: "Schedule", ph: "e.g., Mon, Wed, Fri - 9:00 AM" }, { id: "room", label: "Room", ph: "e.g., CSE Block 301" }].map(({ id, label, ph }) => (
                <div key={id} className="space-y-2">
                  <Label htmlFor={id}>{label}</Label>
                  <Input id={id} placeholder={ph} value={(formData as any)[id]} onChange={(e) => setFormData({ ...formData, [id]: e.target.value })} />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleAddClass} className="flex-1 bg-blue-600 hover:bg-blue-700">Add Class</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Classes", value: classes.length, color: "blue", Icon: BookOpen },
          { label: "Total Students", value: classes.reduce((s, c) => s + c.students, 0), color: "green", Icon: Users },
          { label: "Departments", value: new Set(classes.map((c) => c.subject)).size, color: "purple", Icon: BarChart2 },
        ].map(({ label, value, color, Icon }) => (
          <Card key={label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{label}</p>
                  <p className={`text-3xl font-bold text-${color}-600 mt-2`}>{value}</p>
                </div>
                <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className={`grid gap-6 ${selectedClass ? "grid-cols-1 xl:grid-cols-[1fr_2fr]" : "grid-cols-1"}`}>
        {/* Classes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4 content-start">
          {classes.map((classItem) => {
            const isSelected = selectedClass?.id === classItem.id;
            return (
              <Card
                key={classItem.id}
                onClick={() => setSelectedClass(isSelected ? null : classItem)}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${isSelected ? "ring-2 ring-blue-500 shadow-lg bg-blue-50/30" : "hover:border-blue-200"}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base leading-snug">{classItem.name}</CardTitle>
                      <p className="text-sm text-gray-500 mt-0.5">{classItem.subject}</p>
                    </div>
                    <div className="flex gap-1 ml-2 shrink-0">
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openEditDialog(classItem); }} className="h-7 w-7"><Edit className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDeleteClass(classItem.id); }} className="h-7 w-7 text-red-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <div className="flex items-center gap-2 text-sm text-gray-600"><Users className="w-3.5 h-3.5 text-blue-400 shrink-0" /><span>{classItem.grade}</span></div>
                  <div className="flex items-center gap-2 text-sm text-gray-600"><Users className="w-3.5 h-3.5 text-green-400 shrink-0" /><span>{classItem.students} students</span></div>
                  <div className="flex items-center gap-2 text-sm text-gray-600"><Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" /><span>{classItem.schedule}</span></div>
                  <div className="flex items-center gap-2 text-sm text-gray-600"><MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" /><span>{classItem.room}</span></div>
                  {isSelected && (
                    <div className="pt-1 flex items-center gap-1 text-xs font-medium text-blue-600">
                      <ChevronRight className="w-3.5 h-3.5" /> Viewing details
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detail Panel */}
        {selectedClass && (
          <div className="space-y-4">
            {/* Detail Header */}
            <div className="flex items-start justify-between bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-5 text-white">
              <div>
                <h3 className="text-xl font-bold">{selectedClass.name}</h3>
                <p className="text-blue-100 text-sm mt-0.5">{selectedClass.grade} &bull; {selectedClass.room}</p>
                <p className="text-blue-200 text-xs mt-1">{selectedClass.schedule}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedClass(null)} className="text-white hover:bg-white/20 rounded-full -mt-1 -mr-1">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Avg Attendance", value: `${avgAttendance}%`, color: avgAttendance >= 75 ? "text-emerald-600" : "text-amber-600", bg: "bg-emerald-50" },
                { label: "Avg Marks", value: `${avgMarks}`, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Classes Held", value: classDays.length, color: "text-purple-600", bg: "bg-purple-50" },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`${bg} rounded-xl p-4 text-center`}>
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>

            <Tabs defaultValue="students">
              <TabsList className="w-full bg-gray-100 rounded-xl p-1 grid grid-cols-4">
                <TabsTrigger value="students" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-semibold">
                  <Users className="w-3.5 h-3.5 mr-1" /> Students
                </TabsTrigger>
                <TabsTrigger value="enter-marks" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-semibold">
                  <PenLine className="w-3.5 h-3.5 mr-1" /> Enter Marks
                </TabsTrigger>
                <TabsTrigger value="marks" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-semibold">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" /> Marks Stats
                </TabsTrigger>
                <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-semibold">
                  <Calendar className="w-3.5 h-3.5 mr-1" /> History
                </TabsTrigger>
              </TabsList>

              {/* Students Tab */}
              <TabsContent value="students" className="mt-3">
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto rounded-xl">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">Student</th>
                            <th className="text-center px-3 py-3 font-semibold text-gray-600">Attendance</th>
                            <th className="text-center px-3 py-3 font-semibold text-gray-600">CIE 1</th>
                            <th className="text-center px-3 py-3 font-semibold text-gray-600">CIE 2</th>
                            <th className="text-center px-3 py-3 font-semibold text-gray-600">CIE 3</th>
                            <th className="text-center px-3 py-3 font-semibold text-gray-600">CIE 4</th>
                            <th className="text-center px-3 py-3 font-semibold text-gray-600">SEE 1</th>
                            <th className="text-center px-3 py-3 font-semibold text-gray-600">Total</th>
                            <th className="text-center px-3 py-3 font-semibold text-gray-600">Grade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {studentsWithMarks.map((s) => (
                            <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                              <td className="px-4 py-3">
                                <p className="font-medium text-gray-800">{s.name}</p>
                                <p className="text-xs text-gray-400">{s.rollNumber}</p>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <span className={`text-xs font-semibold ${s.attendance >= 75 ? "text-emerald-600" : s.attendance >= 60 ? "text-amber-600" : "text-red-500"}`}>
                                  <AttendanceDot pct={s.attendance} />{s.attendance}%
                                </span>
                              </td>
                              <td className="px-3 py-3 text-center text-gray-700">{s.cie1}</td>
                              <td className="px-3 py-3 text-center text-gray-700">{s.cie2}</td>
                              <td className="px-3 py-3 text-center text-gray-700">{s.cie3}</td>
                              <td className="px-3 py-3 text-center text-gray-700">{s.cie4}</td>
                              <td className="px-3 py-3 text-center text-gray-700">{s.see1}</td>
                              <td className="px-3 py-3 text-center font-semibold text-gray-800">{s.total}</td>
                              <td className="px-3 py-3 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${GRADE_COLORS[s.grade] ?? "bg-gray-100 text-gray-600"}`}>{s.grade}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enter Marks Tab */}
              <TabsContent value="enter-marks" className="mt-3">
                <Card>
                  <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold text-gray-700">Enter Marks</CardTitle>
                      <p className="text-xs text-gray-400 mt-0.5">CIE max: 50 &nbsp;|&nbsp; SEE max: 100</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => saveMarks(selectedClass!.id, selectedClass!.name)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg gap-1.5 text-xs"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Marks
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-y border-gray-100">
                            <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Student</th>
                            {(["CIE 1", "CIE 2", "CIE 3", "CIE 4", "SEE 1"] as const).map((col) => (
                              <th key={col} className="text-center px-3 py-3 font-semibold text-gray-600 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded-md text-xs ${col.startsWith("SEE") ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>{col}</span>
                              </th>
                            ))}
                            <th className="text-center px-3 py-3 font-semibold text-gray-600">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {students.map((s) => {
                            const m = getStudentMarks(selectedClass!.id, s.id);
                            const fields: (keyof StudentMarksEntry)[] = ["cie1", "cie2", "cie3", "cie4", "see1"];
                            const maxMap: Record<keyof StudentMarksEntry, number> = { cie1: 50, cie2: 50, cie3: 50, cie4: 50, see1: 100 };
                            const total = fields.reduce((sum, f) => sum + (m[f] === "" ? 0 : Number(m[f])), 0);
                            return (
                              <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                                <td className="px-4 py-2.5">
                                  <p className="font-medium text-gray-800 text-sm">{s.name}</p>
                                  <p className="text-xs text-gray-400">{s.rollNumber}</p>
                                </td>
                                {fields.map((field) => (
                                  <td key={field} className="px-2 py-2.5 text-center">
                                    <input
                                      type="number"
                                      min={0}
                                      max={maxMap[field]}
                                      placeholder="—"
                                      value={m[field]}
                                      onChange={(e) => updateStudentMark(selectedClass!.id, s.id, field, e.target.value)}
                                      className="w-16 text-center border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 hover:bg-white transition-colors"
                                    />
                                  </td>
                                ))}
                                <td className="px-3 py-2.5 text-center">
                                  <span className="font-bold text-gray-800">{total > 0 ? total : "—"}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Marks Stats Tab */}
              <TabsContent value="marks" className="mt-3 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Highest", value: Math.max(...studentsWithMarks.map((s) => s.total)), color: "text-emerald-600 bg-emerald-50" },
                    { label: "Lowest", value: Math.min(...studentsWithMarks.map((s) => s.total)), color: "text-red-500 bg-red-50" },
                    { label: "Average", value: avgMarks, color: "text-blue-600 bg-blue-50" },
                    { label: "Pass Rate", value: `${Math.round((studentsWithMarks.filter((s) => s.total >= 50).length / studentsWithMarks.length) * 100)}%`, color: "text-purple-600 bg-purple-50" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className={`${color.split(" ")[1]} rounded-xl p-4 text-center`}>
                      <p className={`text-2xl font-bold ${color.split(" ")[0]}`}>{value}</p>
                      <p className="text-xs text-gray-500 mt-1">{label}</p>
                    </div>
                  ))}
                </div>

                <Card>
                  <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-sm font-semibold text-gray-700">Grade Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-2">
                    {Object.entries(gradeDistribution).map(([grade, count]) => {
                      const pct = studentsWithMarks.length ? Math.round((count / studentsWithMarks.length) * 100) : 0;
                      return (
                        <div key={grade} className="flex items-center gap-3">
                          <span className={`w-8 text-center text-xs font-bold px-1.5 py-0.5 rounded-full ${GRADE_COLORS[grade]}`}>{grade}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-500 w-14 text-right">{count} students</span>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-sm font-semibold text-gray-700">Component-wise Averages</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-2">
                    {[
                      { label: "CIE 1", key: "cie1" as const, max: 50 },
                      { label: "CIE 2", key: "cie2" as const, max: 50 },
                      { label: "CIE 3", key: "cie3" as const, max: 50 },
                      { label: "CIE 4", key: "cie4" as const, max: 50 },
                      { label: "SEE 1", key: "see1" as const, max: 100 },
                    ].map(({ label, key, max }) => {
                      const avg = studentsWithMarks.length ? Math.round(studentsWithMarks.reduce((s, st) => s + st[key], 0) / studentsWithMarks.length) : 0;
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-24 shrink-0">{label}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" style={{ width: `${(avg / max) * 100}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-gray-700 w-8 text-right">{avg}</span>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Class History Tab */}
              <TabsContent value="history" className="mt-3">
                <Card>
                  <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-sm font-semibold text-gray-700">Recent Class Sessions — click a row to manage attendance</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="space-y-1">
                      {classDays.map((day, i) => {
                        const dateKey = format(day, "yyyy-MM-dd");
                        const isOpen = selectedDay === dateKey;
                        const dayAtt = getDayAttendance(selectedClass!.id, dateKey);
                        const presentCount = Object.values(dayAtt).filter(Boolean).length;
                        const totalCount = Object.keys(dayAtt).length;

                        return (
                          <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
                            {/* Row header — clickable */}
                            <button
                              onClick={() => setSelectedDay(isOpen ? null : dateKey)}
                              className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50/40 transition-colors text-left"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isOpen ? "bg-blue-600" : "bg-blue-50"}`}>
                                  <span className={`text-sm font-bold ${isOpen ? "text-white" : "text-blue-600"}`}>{format(day, "dd")}</span>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-800">{format(day, "EEEE, MMMM d, yyyy")}</p>
                                  <p className="text-xs text-gray-400">{presentCount}/{totalCount} present</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${presentCount === totalCount ? "bg-emerald-100 text-emerald-700" : presentCount >= totalCount * 0.75 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>
                                  {Math.round((presentCount / totalCount) * 100)}%
                                </span>
                                {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                              </div>
                            </button>

                            {/* Expanded attendance sheet */}
                            {isOpen && (
                              <div className="border-t border-gray-100 bg-gray-50/50">
                                <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Attendance Sheet</p>
                                  <div className="flex gap-2">
                                    <button
                                      className="text-xs text-blue-600 font-medium hover:underline"
                                      onClick={() => {
                                        const all: Record<number, boolean> = {};
                                        students.forEach((s) => { all[s.id] = true; });
                                        setDailyAttendance((prev) => ({ ...prev, [selectedClass!.id]: { ...prev[selectedClass!.id], [dateKey]: all } }));
                                      }}
                                    >Mark All Present</button>
                                    <span className="text-gray-300">|</span>
                                    <button
                                      className="text-xs text-red-500 font-medium hover:underline"
                                      onClick={() => {
                                        const all: Record<number, boolean> = {};
                                        students.forEach((s) => { all[s.id] = false; });
                                        setDailyAttendance((prev) => ({ ...prev, [selectedClass!.id]: { ...prev[selectedClass!.id], [dateKey]: all } }));
                                      }}
                                    >Mark All Absent</button>
                                  </div>
                                </div>

                                <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                                  {students.map((s) => {
                                    const present = dayAtt[s.id] ?? true;
                                    return (
                                      <div key={s.id} className="flex items-center justify-between px-4 py-2.5">
                                        <div>
                                          <p className="text-sm font-medium text-gray-800">{s.name}</p>
                                          <p className="text-xs text-gray-400">{s.rollNumber}</p>
                                        </div>
                                        <button
                                          onClick={() => toggleDayStudent(selectedClass!.id, dateKey, s.id)}
                                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${present ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-red-100 text-red-600 hover:bg-red-200"}`}
                                        >
                                          {present
                                            ? <><CheckCircle className="w-3.5 h-3.5" /> Present</>
                                            : <><XCircle className="w-3.5 h-3.5" /> Absent</>}
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>

                                <div className="px-4 py-3 border-t border-gray-100 flex justify-end">
                                  <Button
                                    size="sm"
                                    onClick={() => saveDayAttendance(format(day, "MMMM d, yyyy"))}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg gap-1.5"
                                  >
                                    <Save className="w-3.5 h-3.5" /> Save Attendance
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>Update the class details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {[{ id: "name", label: "Class Name *", ph: "" }, { id: "subject", label: "Subject *", ph: "" }, { id: "grade", label: "Grade/Semester *", ph: "" }, { id: "students", label: "Students", ph: "Number of students", type: "number" }, { id: "schedule", label: "Schedule", ph: "" }, { id: "room", label: "Room", ph: "" }].map(({ id, label, ph, type }) => (
              <div key={id} className="space-y-2">
                <Label htmlFor={`edit-${id}`}>{label}</Label>
                <Input id={`edit-${id}`} type={type} placeholder={ph} value={(formData as any)[id]} onChange={(e) => setFormData({ ...formData, [id]: e.target.value })} />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleEditClass} className="flex-1 bg-blue-600 hover:bg-blue-700">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
