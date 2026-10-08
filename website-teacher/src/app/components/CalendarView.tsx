import { useState, useRef } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays } from "date-fns";
import {
  Plus, Users, Clock, MapPin, X, Save, Search, Download,
  FileSpreadsheet, FileText, CheckCircle, Send, Check,
  BookOpen, GraduationCap, CalendarDays, TrendingUp, AlertCircle, Bell, Megaphone, Info
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarPicker } from "./ui/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { toast } from "sonner";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": undefined };

const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

interface ClassInfo {
  id: number;
  title: string;
  subject: string;
  semester: string;
  room: string;
  students: number;
  start: Date;
  end: Date;
  instructor?: string;
  isExtra?: boolean;
}

interface Student {
  id: number;
  name: string;
  rollNumber: string;
  present: boolean;
}

interface StudentMark {
  id: number;
  name: string;
  rollNumber: string;
  midterm1: number;
  midterm2: number;
  assignment: number;
  final: number;
  total: number;
  grade: string;
}

const calculateGrade = (total: number): string => {
  if (total >= 90) return "A+";
  if (total >= 85) return "A";
  if (total >= 80) return "B+";
  if (total >= 75) return "B";
  if (total >= 70) return "C+";
  if (total >= 60) return "C";
  return "D";
};

const calculateTotal = (m1: number, m2: number, assignment: number, final: number): number =>
  (m1 + m2 + assignment + final) / 4;

const gradeColorMap: Record<string, string> = {
  "A+": "bg-emerald-100 text-emerald-700 ring-emerald-600/20",
  "A":  "bg-green-100 text-green-700 ring-green-600/20",
  "B+": "bg-blue-100 text-blue-700 ring-blue-600/20",
  "B":  "bg-sky-100 text-sky-700 ring-sky-600/20",
  "C+": "bg-amber-100 text-amber-700 ring-amber-600/20",
  "C":  "bg-orange-100 text-orange-700 ring-orange-600/20",
  "D":  "bg-red-100 text-red-700 ring-red-600/20",
};

const classTemplates = [
  { title: "Data Structures",      subject: "Computer Science",    semester: "3rd Sem CSE", room: "CSE 301", students: 68, days: [1, 3, 5], time: 9  },
  { title: "Digital Electronics",  subject: "Electronics",          semester: "3rd Sem ECE", room: "ECE 205", students: 62, days: [2, 4],    time: 10 },
  { title: "Engineering Mechanics",subject: "Mechanical",           semester: "3rd Sem ME",  room: "ME 101",  students: 58, days: [1, 3],    time: 11 },
  { title: "Database Management",  subject: "Computer Science",    semester: "5th Sem CSE", room: "CSE 402", students: 65, days: [2, 4, 5], time: 14 },
  { title: "Microprocessor",       subject: "Electronics",          semester: "5th Sem ECE", room: "ECE 304", students: 60, days: [1, 3, 5], time: 15 },
  { title: "Fluid Mechanics",      subject: "Civil Engineering",    semester: "4th Sem CE",  room: "CE 201",  students: 55, days: [2, 4],    time: 9  },
  { title: "Web Technologies",     subject: "Information Science",  semester: "5th Sem ISE", room: "ISE 501", students: 70, days: [1, 2, 3], time: 13 },
  { title: "Power Systems",        subject: "Electrical",           semester: "6th Sem EEE", room: "EEE 302", students: 52, days: [4, 5],    time: 16 },
];

const uniqueSubjects = [...new Set(classTemplates.map((t) => t.subject))];

export default function CalendarView() {
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [isAddClassDialogOpen, setIsAddClassDialogOpen] = useState(false);
  const [isAbsenteeDialogOpen, setIsAbsenteeDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [absentMessage, setAbsentMessage] = useState(
    "Dear Parent,\n\nYour ward was absent from today's class. Please ensure regular attendance.\n\nThank you,\nVidyavardhaka College of Engineering"
  );
  const attendanceRef = useRef<HTMLDivElement>(null);

  const generateWeeklyClasses = (): ClassInfo[] => {
    const today = new Date();
    const classes: ClassInfo[] = [];
    let id = 1;
    for (let weekOffset = 0; weekOffset < 2; weekOffset++) {
      classTemplates.forEach((template) => {
        template.days.forEach((day) => {
          const classDate = addDays(startOfWeek(today), day + weekOffset * 7);
          const start = new Date(classDate);
          start.setHours(template.time, 0, 0, 0);
          const end = new Date(start);
          end.setHours(template.time + 1, 0, 0, 0);
          classes.push({ id: id++, title: template.title, subject: template.subject, semester: template.semester, room: template.room, students: template.students, start, end, instructor: "You" });
        });
      });
    }
    return classes;
  };

  const [events, setEvents] = useState<ClassInfo[]>(generateWeeklyClasses());
  const [newClassForm, setNewClassForm] = useState({ title: "", subject: "", semester: "", room: "", time: "", date: "" });
  const [pickedDate, setPickedDate] = useState<Date | undefined>(undefined);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const [students, setStudents] = useState<Student[]>([
    { id: 1,  name: "Aarav Kumar",    rollNumber: "4VP21CS001", present: true },
    { id: 2,  name: "Ananya Sharma",  rollNumber: "4VP21CS002", present: true },
    { id: 3,  name: "Arjun Rao",      rollNumber: "4VP21CS003", present: true },
    { id: 4,  name: "Diya Patel",     rollNumber: "4VP21CS004", present: true },
    { id: 5,  name: "Ishaan Singh",   rollNumber: "4VP21CS005", present: true },
    { id: 6,  name: "Kavya Reddy",    rollNumber: "4VP21CS006", present: true },
    { id: 7,  name: "Krishna Murthy", rollNumber: "4VP21CS007", present: true },
    { id: 8,  name: "Meera Desai",    rollNumber: "4VP21CS008", present: true },
    { id: 9,  name: "Rohan Gupta",    rollNumber: "4VP21CS009", present: true },
    { id: 10, name: "Sanya Iyer",     rollNumber: "4VP21CS010", present: true },
  ]);

  const [studentMarks, setStudentMarks] = useState<StudentMark[]>([
    { id: 1, name: "Aarav Kumar",   rollNumber: "4VP21CS001", midterm1: 85, midterm2: 88, assignment: 90, final: 87, total: 87.5,  grade: "A"  },
    { id: 2, name: "Ananya Sharma", rollNumber: "4VP21CS002", midterm1: 92, midterm2: 90, assignment: 95, final: 91, total: 92,    grade: "A+" },
    { id: 3, name: "Arjun Rao",     rollNumber: "4VP21CS003", midterm1: 78, midterm2: 82, assignment: 80, final: 79, total: 79.75, grade: "B+" },
    { id: 4, name: "Diya Patel",    rollNumber: "4VP21CS004", midterm1: 88, midterm2: 86, assignment: 92, final: 89, total: 88.75, grade: "A"  },
    { id: 5, name: "Ishaan Singh",  rollNumber: "4VP21CS005", midterm1: 75, midterm2: 78, assignment: 82, final: 76, total: 77.75, grade: "B+" },
  ]);

  const handleSelectEvent = (event: ClassInfo) => {
    setSelectedClass(event);
    setTimeout(() => attendanceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
  };
  
  const handleOpenAddClassDialog = () => {
    setIsAddClassDialogOpen(true);
  };

  const handleAddExtraClass = () => {
    if (!newClassForm.title || !newClassForm.semester || !newClassForm.date || !newClassForm.time) {
      toast.error("Please fill in all required fields");
      return;
    }
    const [hours] = newClassForm.time.split(":").map(Number);
    const start = new Date(newClassForm.date);
    start.setHours(hours, 0, 0, 0);
    const end = new Date(start);
    end.setHours(hours + 1, 0, 0, 0);
    const conflict = events.some(
      (e) => e.start < end && e.end > start
    );
    if (conflict) {
      toast.error("A class is already scheduled in this time slot.");
      return;
    }
    setEvents([...events, {
      id: events.length + 1, 
      title: newClassForm.title, 
      subject: newClassForm.subject, 
      semester: newClassForm.semester, 
      room: newClassForm.room, 
      students: 0, 
      start, 
      end, 
      instructor: "You", 
      isExtra: true 
    }]);
    setIsAddClassDialogOpen(false);
    setNewClassForm({ title: "", subject: "", semester: "", room: "", time: "", date: "" });
    setPickedDate(undefined);
    toast.success("Extra class added successfully!");
  };

  const toggleAttendance = (id: number) => setStudents(students.map((s) => s.id === id ? { ...s, present: !s.present } : s));
  const toggleAll = (present: boolean) => setStudents(students.map((s) => ({ ...s, present })));

  const handleCheckAttendance = () => {
    const absentStudents = students.filter((s) => !s.present);
    if (absentStudents.length === 0) {
      toast.success("All students are present!");
    }
    setIsAbsenteeDialogOpen(true);
  };

  const handleSaveAttendanceFromDialog = () => { 
    toast.success("Attendance saved successfully!"); 
    setIsAbsenteeDialogOpen(false); 
  };

  const handleSendAbsentMessages = () => {
    const absentStudents = students.filter((s) => !s.present);
    toast.success(`Absence notifications sent to ${absentStudents.length} student(s)`);
    setTimeout(() => { 
      toast.success("Attendance saved successfully!"); 
      setIsAbsenteeDialogOpen(false); 
    }, 500);
  };

  const handleExportAttendance = (fmt: string) => toast.success(`Attendance exported as ${fmt.toUpperCase()}`);

  const handleUpdateMark = (id: number, field: keyof StudentMark, value: number) => {
    setStudentMarks(studentMarks.map((student) => {
      if (student.id === id) {
        const updated = { ...student, [field]: value };
        const total = calculateTotal(updated.midterm1, updated.midterm2, updated.assignment, updated.final);
        return { ...updated, total, grade: calculateGrade(total) };
      }
      return student;
    }));
  };

  const handleSaveMarks = () => toast.success("Marks saved successfully!");
  const handleExportMarks = (fmt: string) => toast.success(`Marks exported as ${fmt.toUpperCase()}`);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const absentStudents = students.filter((s) => !s.present);
  const presentCount = students.filter((s) => s.present).length;
  const absentCount = students.length - presentCount;
  const attendancePercentage = ((presentCount / students.length) * 100).toFixed(1);

  const eventStyleGetter = (event: ClassInfo) => {
    return {
      style: {
        background: event.isExtra
          ? "linear-gradient(135deg, #f59e0b, #d97706)"
          : "linear-gradient(135deg, #3b82f6, #7c3aed)",
        borderRadius: "6px",
        border: "none",
        color: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        opacity: 0.95,
      },
    };
  };

  const EventComponent = ({ event }: { event: ClassInfo }) => (
    <div className="p-1">
      <div className="font-semibold text-xs leading-tight truncate">
        {event.title}
      </div>
      <div className="text-[10px] opacity-90 truncate mt-0.5">
        {event.room}
      </div>
    </div>
  );

  const notifications = [
    {
      id: 1,
      sender: "Principal",
      message: "All faculty must submit internal marks by Friday 5 PM.",
      time: "2 hours ago",
      icon: Megaphone,
      color: "bg-purple-100 text-purple-700",
      iconColor: "text-purple-600"
    },
    {
      id: 2,
      sender: "System Admin",
      message: "Server maintenance scheduled for this weekend. Drive access may be intermittent.",
      time: "5 hours ago",
      icon: Info,
      color: "bg-blue-100 text-blue-700",
      iconColor: "text-blue-600"
    }
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* ── Page Header ── */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Calendar</h2>
        <p className="text-gray-500 mt-1 text-sm">Manage class schedules, attendance & marks</p>
      </div>

      {/* ── Notifications Section ── */}
      <div className="flex flex-col gap-3">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100"
          >
            <div className={`p-2 rounded-lg ${notification.color}`}>
              <notification.icon className={`w-5 h-5 ${notification.iconColor}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-900 text-sm">{notification.sender}</h4>
                <span className="text-xs text-gray-500">{notification.time}</span>
              </div>
              <p className="text-gray-600 text-sm">{notification.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Calendar Card ── */}
      <Card className="shadow-lg border-none overflow-hidden bg-white">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 p-5 sm:p-6 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Weekly Class Schedule</h3>
              <p className="text-sm text-gray-500">Click on any class to view details, manage attendance & marks</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-blue-100/50 text-blue-700 hover:bg-blue-100 border-none font-semibold px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" /> Regular
            </Badge>
            <Badge variant="secondary" className="bg-amber-100/50 text-amber-700 hover:bg-amber-100 border-none font-semibold px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-amber-500 mr-2" /> Extra
            </Badge>
            <Button
              onClick={handleOpenAddClassDialog}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all hover:shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Extra Class
            </Button>
          </div>
        </div>

        {/* Calendar */}
        <div className="p-4 sm:p-6 bg-slate-50/30">
          <div className="h-[750px] sm:h-[800px] rounded-2xl overflow-hidden bg-white shadow-md border border-slate-200/60 ring-1 ring-black/[0.03] transition-all hover:shadow-lg">
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              defaultView="week"
              views={["week", "day", "agenda"]}
              step={60}
              timeslots={1}
              min={new Date(0, 0, 0, 8, 0, 0)}
              max={new Date(0, 0, 0, 17, 0, 0)}
              showMultiDayTimes={false}
              eventPropGetter={eventStyleGetter}
              components={{ event: EventComponent }}
              formats={{ eventTimeRangeFormat: () => "" }}
              className="h-full !font-sans [&_.rbc-header]:py-3 [&_.rbc-header]:font-semibold [&_.rbc-header]:text-slate-700 [&_.rbc-header]:bg-slate-50/80 [&_.rbc-header]:border-b-slate-200 [&_.rbc-today]:bg-blue-50/40 [&_.rbc-time-view]:border-none [&_.rbc-time-header]:border-slate-200 [&_.rbc-time-content]:border-t-0 [&_.rbc-timeslot-group]:border-slate-100 [&_.rbc-day-bg]:border-slate-100 [&_.rbc-time-column]:border-slate-100 [&_.rbc-time-gutter_.rbc-timeslot-group]:border-transparent [&_.rbc-label]:text-slate-500 [&_.rbc-label]:text-xs [&_.rbc-label]:font-medium"
            />
          </div>
        </div>
      </Card>

      {/* ── Selected Class Panel ── */}
      {selectedClass && (
        <div ref={attendanceRef} className="flex flex-col gap-6 scroll-mt-24">
          {/* Class Info Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <BookOpen className="w-7 h-7 text-blue-200" />
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">{selectedClass.title}</h3>
                    {selectedClass.isExtra && (
                      <Badge className="bg-amber-500 hover:bg-amber-600 text-white ml-2 border-none font-bold">Extra Class</Badge>
                    )}
                  </div>
                  <p className="text-blue-100 text-sm sm:text-base font-medium">
                    {selectedClass.subject} &bull; {format(selectedClass.start, "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
              </div>
              
              {/* Info Pills */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-sm font-medium">
                  <Clock className="w-4 h-4 text-blue-200" />
                  {format(selectedClass.start, "h:mm a")} - {format(selectedClass.end, "h:mm a")}
                </div>
                <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-blue-200" />
                  {selectedClass.room}
                </div>
                <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-sm font-medium">
                  <Users className="w-4 h-4 text-blue-200" />
                  {selectedClass.students} Students
                </div>
                <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-sm font-medium">
                  <GraduationCap className="w-4 h-4 text-blue-200" />
                  {selectedClass.semester}
                </div>
              </div>
            </div>
          </div>

          {/* Attendance & Marks Tabs */}
          <Card className="shadow-lg border-none overflow-hidden bg-white">
            <Tabs defaultValue="attendance" className="w-full">
              {/* Tab Header */}
              <div className="px-4 sm:px-6 pt-4 sm:pt-6 border-b bg-gray-50/50">
                <TabsList className="bg-gray-100/80 p-1.5 rounded-xl mb-[-1px]">
                  <TabsTrigger value="attendance" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 font-semibold transition-all">
                    <Users className="w-4 h-4 mr-2" /> Attendance
                  </TabsTrigger>
                  <TabsTrigger value="marks" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-700 font-semibold transition-all">
                    <TrendingUp className="w-4 h-4 mr-2" /> Marks
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-4 sm:p-6">
                {/* ── Attendance Tab ── */}
                <TabsContent value="attendance" className="m-0 space-y-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
                      <div>
                        <div className="text-sm font-semibold text-emerald-600 mb-1">Present</div>
                        <div className="text-3xl font-bold text-emerald-700 leading-none">{presentCount}</div>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
                      <div>
                        <div className="text-sm font-semibold text-red-600 mb-1">Absent</div>
                        <div className="text-3xl font-bold text-red-700 leading-none">{absentCount}</div>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
                      <div>
                        <div className="text-sm font-semibold text-blue-600 mb-1">Attendance Rate</div>
                        <div className="text-3xl font-bold text-blue-700 leading-none">{attendancePercentage}%</div>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* Search & Bulk Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="relative flex-1 w-full">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search by name or roll number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-gray-50/50 border-gray-200 focus-visible:ring-blue-500 rounded-xl w-full"
                      />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        onClick={() => toggleAll(true)}
                        className="flex-1 sm:flex-none border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 rounded-xl"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        All Present
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => toggleAll(false)}
                        className="flex-1 sm:flex-none border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 rounded-xl"
                      >
                        <X className="w-4 h-4 mr-2" />
                        All Absent
                      </Button>
                    </div>
                  </div>

                  {/* Student Attendance Table */}
                  <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 sm:px-6 sm:py-4 w-[140px]">Roll No.</th>
                            <th className="px-4 py-3 sm:px-6 sm:py-4">Student Name</th>
                            <th className="px-4 py-3 sm:px-6 sm:py-4 text-center w-[120px]">Status</th>
                            <th className="px-4 py-3 sm:px-6 sm:py-4 text-center w-[140px]">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredStudents.map((student, index) => (
                            <tr
                              key={student.id}
                              className={`transition-colors hover:bg-gray-50/50 ${
                                !student.present ? "bg-red-50/30" : index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                              }`}
                            >
                              <td className="px-4 py-3 sm:px-6 sm:py-4">
                                <code className="bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium text-xs">
                                  {student.rollNumber}
                                </code>
                              </td>
                              <td className="px-4 py-3 sm:px-6 sm:py-4 font-medium text-gray-900">
                                {student.name}
                              </td>
                              <td className="px-4 py-3 sm:px-6 sm:py-4 text-center">
                                {student.present ? (
                                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 ring-1 ring-inset ring-emerald-600/10">
                                    <CheckCircle className="w-3 h-3 mr-1" /> Present
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border border-red-200 ring-1 ring-inset ring-red-600/10">
                                    <X className="w-3 h-3 mr-1" /> Absent
                                  </Badge>
                                )}
                              </td>
                              <td className="px-4 py-3 sm:px-6 sm:py-4 text-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleAttendance(student.id)}
                                  className={`rounded-lg h-8 text-xs font-semibold w-full ${
                                    student.present 
                                      ? "text-gray-600 border-gray-200 hover:bg-gray-100" 
                                      : "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 hover:text-white"
                                  }`}
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

                  {/* Attendance Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                    <Button
                      onClick={handleCheckAttendance}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md rounded-xl py-6"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Attendance
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex-1 sm:flex-none sm:w-[160px] rounded-xl py-6 border-gray-200 shadow-sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px] rounded-xl">
                        <DropdownMenuItem onClick={() => handleExportAttendance("excel")} className="py-2 cursor-pointer">
                          <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
                          <span>Export as Excel</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExportAttendance("pdf")} className="py-2 cursor-pointer">
                          <FileText className="w-4 h-4 mr-2 text-red-500" />
                          <span>Export as PDF</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TabsContent>

                {/* ── Marks Tab ── */}
                <TabsContent value="marks" className="m-0 space-y-6">
                  {/* Marks Table */}
                  <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left min-w-[800px]">
                        <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 sm:px-6 sm:py-4 w-[130px]">Roll No.</th>
                            <th className="px-4 py-3 sm:px-6 sm:py-4">Student Name</th>
                            <th className="px-2 py-3 sm:px-4 sm:py-4 text-center w-[110px]">Midterm 1</th>
                            <th className="px-2 py-3 sm:px-4 sm:py-4 text-center w-[110px]">Midterm 2</th>
                            <th className="px-2 py-3 sm:px-4 sm:py-4 text-center w-[110px]">Assignment</th>
                            <th className="px-2 py-3 sm:px-4 sm:py-4 text-center w-[110px]">Final</th>
                            <th className="px-3 py-3 sm:px-4 sm:py-4 text-center w-[90px] bg-blue-50/50 text-blue-700">Total</th>
                            <th className="px-3 py-3 sm:px-4 sm:py-4 text-center w-[90px] bg-blue-50/50 text-blue-700">Grade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {studentMarks.map((student, index) => (
                            <tr key={student.id} className={`hover:bg-gray-50/50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                              <td className="px-4 py-3 sm:px-6 sm:py-4">
                                <code className="bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium text-xs">
                                  {student.rollNumber}
                                </code>
                              </td>
                              <td className="px-4 py-3 sm:px-6 sm:py-4 font-medium text-gray-900">
                                {student.name}
                              </td>
                              {(["midterm1", "midterm2", "assignment", "final"] as const).map((field) => (
                                <td key={field} className="px-2 py-2 sm:px-4 sm:py-3 text-center">
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={student[field] as number}
                                    onChange={(e) => handleUpdateMark(student.id, field, Number(e.target.value))}
                                    className="w-[70px] mx-auto text-center h-9 px-2 bg-gray-50/50 border-gray-200 focus-visible:ring-blue-500 rounded-lg text-sm"
                                  />
                                </td>
                              ))}
                              <td className="px-3 py-3 sm:px-4 sm:py-4 text-center bg-blue-50/30 font-bold text-blue-700">
                                {student.total.toFixed(1)}
                              </td>
                              <td className="px-3 py-3 sm:px-4 sm:py-4 text-center bg-blue-50/30">
                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ring-1 ring-inset ${gradeColorMap[student.grade] || "bg-gray-100 text-gray-800 ring-gray-500/20"}`}>
                                  {student.grade}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Marks Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                    <Button
                      onClick={handleSaveMarks}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md rounded-xl py-6"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Marks
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex-1 sm:flex-none sm:w-[160px] rounded-xl py-6 border-gray-200 shadow-sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px] rounded-xl">
                        <DropdownMenuItem onClick={() => handleExportMarks("excel")} className="py-2 cursor-pointer">
                          <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
                          <span>Export as Excel</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExportMarks("pdf")} className="py-2 cursor-pointer">
                          <FileText className="w-4 h-4 mr-2 text-red-500" />
                          <span>Export as PDF</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </div>
      )}

      {/* ── Add Extra Class Dialog ── */}
      <Dialog open={isAddClassDialogOpen} onOpenChange={setIsAddClassDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-none">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white">Add Extra Class</DialogTitle>
                  <DialogDescription className="text-blue-100 mt-1">
                    {newClassForm.date ? `Scheduling for ${format(new Date(newClassForm.date), "EEEE, MMMM d, yyyy")}` : "Schedule a new extra class"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-5">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Class Name <span className="text-red-500">*</span></Label>
                <Select
                  value={newClassForm.title}
                  onValueChange={(value) => {
                    const tpl = classTemplates.find((t) => t.title === value);
                    setNewClassForm({
                      ...newClassForm,
                      title: value,
                      subject: tpl ? tpl.subject : newClassForm.subject,
                    });
                  }}
                >
                  <SelectTrigger id="title" className="bg-gray-50/50 border-gray-200 focus-visible:ring-blue-500 rounded-xl">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {classTemplates.map((t) => (
                      <SelectItem key={t.title} value={t.title} className="rounded-lg">{t.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="subject" className="text-sm font-semibold text-gray-700">Subject</Label>
                  <Select
                    value={newClassForm.subject}
                    onValueChange={(value) => setNewClassForm({ ...newClassForm, subject: value })}
                  >
                    <SelectTrigger id="subject" className="bg-gray-50/50 border-gray-200 focus-visible:ring-blue-500 rounded-xl">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {uniqueSubjects.map((s) => (
                        <SelectItem key={s} value={s} className="rounded-lg">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="room" className="text-sm font-semibold text-gray-700">Room</Label>
                  <Input
                    id="room"
                    placeholder="e.g., CSE 301"
                    value={newClassForm.room}
                    onChange={(e) => setNewClassForm({ ...newClassForm, room: e.target.value })}
                    className="bg-gray-50/50 border-gray-200 focus-visible:ring-blue-500 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="semester" className="text-sm font-semibold text-gray-700">Semester & Branch <span className="text-red-500">*</span></Label>
                <Select value={newClassForm.semester} onValueChange={(value) => setNewClassForm({ ...newClassForm, semester: value })}>
                  <SelectTrigger id="semester" className="bg-gray-50/50 border-gray-200 focus-visible:ring-blue-500 rounded-xl">
                    <SelectValue placeholder="Select semester & branch" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {["3rd Semester CSE", "5th Semester CSE", "3rd Semester ECE", "5th Semester ECE", "3rd Semester ME", "4th Semester CE", "5th Semester ISE", "6th Semester EEE"].map((s) => (
                      <SelectItem key={s} value={s} className="rounded-lg">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold text-gray-700">Date <span className="text-red-500">*</span></Label>
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-gray-50/50 border-gray-200 rounded-xl hover:bg-gray-100"
                      >
                        <CalendarDays className="mr-2 h-4 w-4 text-gray-400 shrink-0" />
                        {pickedDate ? format(pickedDate, "MMM d, yyyy") : <span className="text-gray-400">Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-xl shadow-xl border-gray-200" align="start">
                      <CalendarPicker
                        mode="single"
                        selected={pickedDate}
                        onSelect={(day) => {
                          setPickedDate(day);
                          setNewClassForm({ ...newClassForm, date: day ? format(day, "yyyy-MM-dd") : "" });
                          setDatePickerOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time" className="text-sm font-semibold text-gray-700">Time <span className="text-red-500">*</span></Label>
                  <Input
                    id="time"
                    type="time"
                    value={newClassForm.time}
                    onChange={(e) => setNewClassForm({ ...newClassForm, time: e.target.value })}
                    className="bg-gray-50/50 border-gray-200 focus-visible:ring-blue-500 rounded-xl w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 pt-0 flex gap-3">
            <Button
              variant="outline"
              onClick={() => { setIsAddClassDialogOpen(false); setPickedDate(undefined); setNewClassForm({ title: "", subject: "", semester: "", room: "", time: "", date: "" }); }}
              className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddExtraClass}
              className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Absentee / Attendance Summary Dialog ── */}
      <Dialog open={isAbsenteeDialogOpen} onOpenChange={setIsAbsenteeDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-2xl border-none">
          <div className={`p-6 text-white ${absentStudents.length === 0 ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : "bg-gradient-to-r from-red-500 to-red-600"}`}>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  {absentStudents.length === 0 ? <CheckCircle className="w-6 h-6 text-white" /> : <AlertCircle className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white">Attendance Summary</DialogTitle>
                  <DialogDescription className="text-white/80 mt-1">
                    {absentStudents.length === 0
                      ? "All students are present today — great attendance! 🎉"
                      : `${absentStudents.length} student${absentStudents.length > 1 ? "s are" : " is"} absent from this class`}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
            {absentStudents.length > 0 && (
              <>
                <div className="border border-red-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-red-50 px-4 py-3 border-b border-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Absent Students</span>
                  </div>
                  <table className="w-full text-sm text-left">
                    <thead className="bg-white text-gray-600 border-b border-gray-100 text-xs">
                      <tr>
                        <th className="px-4 py-2.5 font-medium">Roll Number</th>
                        <th className="px-4 py-2.5 font-medium">Student Name</th>
                        <th className="px-4 py-2.5 font-medium text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {absentStudents.map((student, index) => (
                        <tr key={student.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                          <td className="px-4 py-3">
                            <code className="bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium text-xs">
                              {student.rollNumber}
                            </code>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                          <td className="px-4 py-3 text-center">
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border border-red-200 ring-1 ring-inset ring-red-600/10">
                              <X className="w-3 h-3 mr-1" /> Absent
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">Notification Message to Parents</Label>
                  <Textarea
                    value={absentMessage}
                    onChange={(e) => setAbsentMessage(e.target.value)}
                    rows={5}
                    className="bg-gray-50/50 border-gray-200 focus-visible:ring-blue-500 rounded-xl resize-none text-sm"
                  />
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Send className="w-3 h-3" />
                    This message will be sent to the parents of all {absentStudents.length} absent student(s)
                  </p>
                </div>

                <Button
                  onClick={handleSendAbsentMessages}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md py-6"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Notifications to Parents ({absentStudents.length})
                </Button>
              </>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsAbsenteeDialogOpen(false)}
                className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50"
              >
                {absentStudents.length > 0 ? "Cancel" : "Close"}
              </Button>
              {absentStudents.length === 0 && (
                <Button
                  onClick={handleSaveAttendanceFromDialog}
                  className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Attendance
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}