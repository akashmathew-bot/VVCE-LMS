import { useState, useMemo, useRef } from "react";
import { CheckCircle, XCircle, Save, Upload, Download, ChevronDown, ChevronRight, Users, TrendingUp, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { format, subDays } from "date-fns";
import { useMarks, StudentMarksEntry } from "../context/MarksContext";

const CLASSES = [
  { id: 1, name: "Data Structures",                  subject: "Computer Science",   semester: "3rd Sem CSE", students: 68, schedule: "Mon, Wed, Fri", room: "CSE 301",  days: [1,3,5] },
  { id: 2, name: "Digital Electronics",               subject: "Electronics",        semester: "3rd Sem ECE", students: 62, schedule: "Tue, Thu",      room: "ECE 205",  days: [2,4]   },
  { id: 3, name: "Engineering Mechanics",             subject: "Mechanical",         semester: "3rd Sem ME",  students: 58, schedule: "Mon, Wed",      room: "ME 101",   days: [1,3]   },
  { id: 4, name: "Database Management Systems",       subject: "Computer Science",   semester: "5th Sem CSE", students: 65, schedule: "Tue, Thu, Fri", room: "CSE 402",  days: [2,4,5] },
  { id: 5, name: "Microprocessor & Microcontroller",  subject: "Electronics",        semester: "5th Sem ECE", students: 60, schedule: "Mon, Wed, Fri", room: "ECE 304",  days: [1,3,5] },
  { id: 6, name: "Fluid Mechanics",                   subject: "Civil Engineering",  semester: "4th Sem CE",  students: 55, schedule: "Tue, Thu",      room: "CE 201",   days: [2,4]   },
  { id: 7, name: "Web Technologies",                  subject: "Information Science",semester: "5th Sem ISE", students: 70, schedule: "Mon, Tue, Wed", room: "ISE 501",  days: [1,2,3] },
  { id: 8, name: "Power Systems",                     subject: "Electrical",         semester: "6th Sem EEE", students: 52, schedule: "Thu, Fri",      room: "EEE 302",  days: [4,5]   },
];

const STUDENT_NAMES = [
  "Aditya Kumar","Bhavana Reddy","Chetan Naik","Divya Sharma","Eshan Patel",
  "Fathima Begum","Ganesh Rao","Harini Menon","Ishaan Singh","Jyothi Nair",
  "Karthik Rajan","Lavanya Iyer","Manoj Hegde","Nandini Kulkarni","Omkar Patil",
  "Priya Venkat","Qais Ahmed","Riya Joshi","Suresh Gowda","Tanvi Bhat",
];

function seeded(seed: number, min: number, max: number) {
  const x = Math.sin(seed) * 10000;
  return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
}

function getStudents(classId: number, count: number) {
  return Array.from({ length: Math.min(count, 20) }, (_, i) => ({
    id: i + 1,
    name: STUDENT_NAMES[i % STUDENT_NAMES.length],
    rollNumber: `4VP${22 + (classId % 3)}CS${String(i + 1).padStart(3, "0")}`,
    defaultAttendance: seeded(classId * 100 + i + 6, 60, 100) >= 75,
  }));
}

function getClassDays(days: number[]): Date[] {
  const result: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 60 && result.length < 20; i++) {
    const d = subDays(today, i);
    if (days.includes(d.getDay())) result.push(d);
  }
  return result;
}

const FIELDS: (keyof StudentMarksEntry)[] = ["cie1", "cie2", "cie3", "cie4", "see1"];
const FIELD_MAX: Record<keyof StudentMarksEntry, number> = { cie1: 50, cie2: 50, cie3: 50, cie4: 50, see1: 100 };
const FIELD_LABELS = { cie1: "CIE 1", cie2: "CIE 2", cie3: "CIE 3", cie4: "CIE 4", see1: "SEE 1" };

export default function MarksAttendance() {
  const [selectedClassId, setSelectedClassId] = useState(CLASSES[0].id);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [dailyAtt, setDailyAtt] = useState<Record<string, Record<number, boolean>>>({});
  const marksFileRef = useRef<HTMLInputElement>(null);
  const { getStudentMarks, updateStudentMark, saveMarks } = useMarks();

  const cls = CLASSES.find((c) => c.id === selectedClassId)!;
  const students = useMemo(() => getStudents(cls.id, cls.students), [cls.id, cls.students]);
  const classDays = useMemo(() => getClassDays(cls.days), [cls.days]);

  const getDayAtt = (dateKey: string): Record<number, boolean> => {
    if (dailyAtt[dateKey]) return dailyAtt[dateKey];
    const init: Record<number, boolean> = {};
    students.forEach((s) => { init[s.id] = s.defaultAttendance; });
    return init;
  };

  const toggleStudent = (dateKey: string, studentId: number) => {
    const current = getDayAtt(dateKey);
    setDailyAtt((prev) => ({ ...prev, [dateKey]: { ...current, [studentId]: !current[studentId] } }));
  };

  const markAll = (dateKey: string, present: boolean) => {
    const all: Record<number, boolean> = {};
    students.forEach((s) => { all[s.id] = present; });
    setDailyAtt((prev) => ({ ...prev, [dateKey]: all }));
  };

  const handleSaveMarks = () => saveMarks(cls.id, cls.name);
  const handleSaveAtt = (dateKey: string) => toast.success(`Attendance saved for ${dateKey}`);

  const handleUploadAtt = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,.xlsx,.xls";
    input.onchange = () => toast.success("Attendance file uploaded successfully!");
    input.click();
  };

  // Download marks template — pre-filled with student names, blank CIE/SEE columns
  const handleDownloadTemplate = () => {
    const rows = [
      ["Roll Number", "Student Name", "CIE 1 (/50)", "CIE 2 (/50)", "CIE 3 (/50)", "CIE 4 (/50)", "SEE 1 (/100)"],
      ...students.map((s) => [s.rollNumber, s.name, "", "", "", "", ""]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = [{ wch: 18 }, { wch: 22 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 14 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Marks");
    XLSX.writeFile(wb, `${cls.name.replace(/\s+/g, "_")}_Marks.xlsx`);
    toast.success("Template downloaded");
  };

  // Parse uploaded Excel and push marks into context
  const handleMarksFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
        // rows[0] = headers, rows[1..] = student data
        let imported = 0;
        rows.slice(1).forEach((row) => {
          const rollNum = String(row[0] ?? "").trim();
          const student = students.find((s) => s.rollNumber === rollNum);
          if (!student) return;
          const clamp = (v: string, max: number) => {
            const n = parseFloat(v);
            if (isNaN(n)) return "";
            return String(Math.min(max, Math.max(0, n)));
          };
          updateStudentMark(cls.id, student.id, "cie1", clamp(String(row[2]), 50));
          updateStudentMark(cls.id, student.id, "cie2", clamp(String(row[3]), 50));
          updateStudentMark(cls.id, student.id, "cie3", clamp(String(row[4]), 50));
          updateStudentMark(cls.id, student.id, "cie4", clamp(String(row[5]), 50));
          updateStudentMark(cls.id, student.id, "see1", clamp(String(row[6]), 100));
          imported++;
        });
        toast.success(`Marks imported for ${imported} student${imported !== 1 ? "s" : ""}`);
      } catch {
        toast.error("Could not parse the file. Make sure it matches the downloaded template.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Marks & Attendance</h2>
          <p className="text-gray-500 mt-1 text-sm">Select a class to enter marks or manage attendance</p>
        </div>
        <Button onClick={handleUploadAtt} variant="outline" className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50">
          <Upload className="w-4 h-4" /> Upload Attendance
        </Button>
      </div>

      {/* Class Selector */}
      <div className="flex flex-wrap gap-2">
        {CLASSES.map((c) => (
          <button
            key={c.id}
            onClick={() => { setSelectedClassId(c.id); setExpandedDay(null); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              selectedClassId === c.id
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-700"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Selected Class Info */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-5 text-white flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">{cls.name}</h3>
          <p className="text-blue-100 text-sm mt-0.5">{cls.semester} &bull; {cls.room} &bull; {cls.schedule}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{cls.students}</p>
          <p className="text-blue-100 text-xs mt-0.5">Students</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="marks">
        <TabsList className="w-full bg-gray-100 rounded-xl p-1 grid grid-cols-2">
          <TabsTrigger value="marks" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold gap-2">
            <TrendingUp className="w-4 h-4" /> Marks Entry
          </TabsTrigger>
          <TabsTrigger value="attendance" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold gap-2">
            <Users className="w-4 h-4" /> Attendance
          </TabsTrigger>
        </TabsList>

        {/* ── Marks Tab ── */}
        <TabsContent value="marks" className="mt-4">
          <Card>
            <CardHeader className="pb-3 pt-5 px-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold text-gray-800">Enter Marks</CardTitle>
                  <p className="text-xs text-gray-400 mt-0.5">CIE max: 50 &nbsp;|&nbsp; SEE max: 100 &nbsp;|&nbsp; Type directly or upload an Excel file</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    onClick={handleDownloadTemplate}
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl gap-2"
                  >
                    <Download className="w-4 h-4" /> Template
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => marksFileRef.current?.click()}
                    className="border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl gap-2"
                  >
                    <Upload className="w-4 h-4" /> Upload Excel
                  </Button>
                  <input
                    ref={marksFileRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleMarksFile(f); e.target.value = ""; }}
                  />
                  <Button
                    onClick={handleSaveMarks}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl gap-2"
                  >
                    <Save className="w-4 h-4" /> Save
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-y border-gray-100">
                      <th className="text-left px-5 py-3 font-semibold text-gray-600 whitespace-nowrap">Student</th>
                      {FIELDS.map((f) => (
                        <th key={f} className="text-center px-3 py-3 font-semibold text-gray-600 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-md text-xs ${f === "see1" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                            {FIELD_LABELS[f]}
                          </span>
                        </th>
                      ))}
                      <th className="text-center px-4 py-3 font-semibold text-gray-600">Total</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-600">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {students.map((s) => {
                      const m = getStudentMarks(cls.id, s.id);
                      const vals = FIELDS.map((f) => (m[f] === "" ? 0 : Number(m[f])));
                      const cieAvg = (vals[0] + vals[1] + vals[2] + vals[3]) / 4;
                      const total = parseFloat((cieAvg * 0.5 + vals[4] * 0.5).toFixed(1));
                      const grade = total >= 90 ? "O" : total >= 80 ? "A+" : total >= 70 ? "A" : total >= 60 ? "B+" : total >= 50 ? "B" : "C";
                      const gradeColor = { O: "bg-emerald-100 text-emerald-700", "A+": "bg-blue-100 text-blue-700", A: "bg-sky-100 text-sky-700", "B+": "bg-violet-100 text-violet-700", B: "bg-amber-100 text-amber-700", C: "bg-red-100 text-red-700" }[grade] ?? "";
                      return (
                        <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-5 py-3">
                            <p className="font-medium text-gray-800">{s.name}</p>
                            <p className="text-xs text-gray-400">{s.rollNumber}</p>
                          </td>
                          {FIELDS.map((field) => (
                            <td key={field} className="px-2 py-2.5 text-center">
                              <input
                                type="number"
                                min={0}
                                max={FIELD_MAX[field]}
                                placeholder="0"
                                value={m[field]}
                                onChange={(e) => updateStudentMark(cls.id, s.id, field, e.target.value)}
                                className="w-16 text-center border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 hover:bg-white transition-colors"
                              />
                            </td>
                          ))}
                          <td className="px-4 py-2.5 text-center font-bold text-gray-800">
                            {vals.some((v) => v > 0) ? total : "—"}
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            {vals.some((v) => v > 0) && (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${gradeColor}`}>{grade}</span>
                            )}
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

        {/* ── Attendance Tab ── */}
        <TabsContent value="attendance" className="mt-4">
          <Card>
            <CardHeader className="pb-3 pt-5 px-5 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-gray-800">Attendance by Session</CardTitle>
                <p className="text-xs text-gray-400 mt-0.5">Click a session row to mark attendance. Upload CSV/XLSX to bulk-import.</p>
              </div>
              <Button onClick={handleUploadAtt} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl gap-2">
                <Upload className="w-4 h-4" /> Upload
              </Button>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-2">
              {classDays.map((day) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const isOpen = expandedDay === dateKey;
                const att = getDayAtt(dateKey);
                const presentCount = Object.values(att).filter(Boolean).length;
                const total = Object.keys(att).length;
                const pct = total ? Math.round((presentCount / total) * 100) : 0;
                const badgeColor = pct >= 75 ? "bg-emerald-100 text-emerald-700" : pct >= 60 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600";

                return (
                  <div key={dateKey} className="rounded-xl border border-gray-100 overflow-hidden">
                    {/* Session row */}
                    <button
                      onClick={() => setExpandedDay(isOpen ? null : dateKey)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50/40 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isOpen ? "bg-blue-600" : "bg-blue-50"}`}>
                          <span className={`text-sm font-bold ${isOpen ? "text-white" : "text-blue-600"}`}>{format(day, "dd")}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{format(day, "EEEE, MMMM d, yyyy")}</p>
                          <p className="text-xs text-gray-400">{presentCount}/{total} present</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>{pct}%</span>
                        {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                      </div>
                    </button>

                    {/* Expanded attendance sheet */}
                    {isOpen && (
                      <div className="border-t border-gray-100 bg-gray-50/50">
                        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Attendance Sheet</p>
                          <div className="flex gap-2">
                            <button onClick={() => markAll(dateKey, true)} className="text-xs text-blue-600 font-medium hover:underline">Mark All Present</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => markAll(dateKey, false)} className="text-xs text-red-500 font-medium hover:underline">Mark All Absent</button>
                          </div>
                        </div>

                        <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                          {students.map((s) => {
                            const present = att[s.id] ?? s.defaultAttendance;
                            return (
                              <div key={s.id} className="flex items-center justify-between px-4 py-2.5">
                                <div>
                                  <p className="text-sm font-medium text-gray-800">{s.name}</p>
                                  <p className="text-xs text-gray-400">{s.rollNumber}</p>
                                </div>
                                <button
                                  onClick={() => toggleStudent(dateKey, s.id)}
                                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                    present
                                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                      : "bg-red-100 text-red-600 hover:bg-red-200"
                                  }`}
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
                            onClick={() => handleSaveAtt(format(day, "MMMM d, yyyy"))}
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
