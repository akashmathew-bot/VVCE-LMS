import { useState } from "react";
import { Book, Users, CheckSquare, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";

export default function Dashboard() {
  const [selectedClass, setSelectedClass] = useState("all");

  const classes = [
    {
      name: "Data Structures - 3rd Sem CSE",
      students: 68,
      attendance: 95,
      avgGrade: 87.5,
      room: "CSE Block 301"
    },
    {
      name: "Digital Electronics - 3rd Sem ECE",
      students: 62,
      attendance: 92,
      avgGrade: 84.2,
      room: "ECE Block 205"
    },
    {
      name: "Engineering Mechanics - 3rd Sem ME",
      students: 58,
      attendance: 93,
      avgGrade: 82.8,
      room: "ME Block 101"
    },
    {
      name: "Database Management Systems - 5th Sem CSE",
      students: 65,
      attendance: 96,
      avgGrade: 89.3,
      room: "CSE Block 402"
    },
    {
      name: "Microprocessor & Microcontroller - 5th Sem ECE",
      students: 60,
      attendance: 94,
      avgGrade: 86.7,
      room: "ECE Block 304"
    },
    {
      name: "Fluid Mechanics - 4th Sem CE",
      students: 55,
      attendance: 91,
      avgGrade: 81.5,
      room: "CE Block 201"
    },
    {
      name: "Web Technologies - 5th Sem ISE",
      students: 70,
      attendance: 97,
      avgGrade: 90.2,
      room: "ISE Block 501"
    },
    {
      name: "Power Systems - 6th Sem EEE",
      students: 52,
      attendance: 93,
      avgGrade: 85.4,
      room: "EEE Block 302"
    },
  ];

  const selectedClassData = selectedClass !== "all" ? classes.find(c => c.name === selectedClass) : null;

  const totalStats = {
    totalClasses: classes.length,
    totalStudents: classes.reduce((sum, c) => sum + c.students, 0),
    avgAttendance: (classes.reduce((sum, c) => sum + c.attendance, 0) / classes.length).toFixed(1),
    avgGrade: (classes.reduce((sum, c) => sum + c.avgGrade, 0) / classes.length).toFixed(1),
  };

  const stats = selectedClassData ? [
    {
      title: "Total Students",
      value: selectedClassData.students.toString(),
      icon: Users,
      color: "from-green-500 to-emerald-600",
      trend: `Room: ${selectedClassData.room}`,
    },
    {
      title: "Attendance Rate",
      value: `${selectedClassData.attendance}%`,
      icon: CheckSquare,
      color: "from-purple-500 to-purple-600",
      trend: selectedClassData.attendance >= 95 ? "Excellent" : "Good",
    },
    {
      title: "Average Grade",
      value: selectedClassData.avgGrade.toFixed(1),
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      trend: selectedClassData.avgGrade >= 85 ? "Above average" : "Average",
    },
  ] : [
    {
      title: "Total Classes",
      value: totalStats.totalClasses.toString(),
      icon: Book,
      color: "bg-blue-500",
      trend: "All departments",
    },
    {
      title: "Total Students",
      value: totalStats.totalStudents.toString(),
      icon: Users,
      color: "bg-green-500",
      trend: "Across all classes",
    },
    {
      title: "Avg Attendance",
      value: `${totalStats.avgAttendance}%`,
      icon: CheckSquare,
      color: "bg-purple-500",
      trend: "Overall performance",
    },
    {
      title: "Avg Grade",
      value: totalStats.avgGrade,
      icon: TrendingUp,
      color: "bg-orange-500",
      trend: "Across all classes",
    },
  ];

  const recentClasses = [
    { id: 1, name: "Data Structures - 3rd Sem CSE", students: 68, time: "Today, 9:00 AM" },
    { id: 2, name: "Digital Electronics - 3rd Sem ECE", students: 62, time: "Today, 10:00 AM" },
    { id: 3, name: "Engineering Mechanics - 3rd Sem ME", students: 58, time: "Today, 11:00 AM" },
  ];

  const pendingTasks = [
    { id: 1, task: "Update attendance for Data Structures", priority: "high" },
    { id: 2, task: "Enter marks for Digital Electronics Mid-term", priority: "high" },
    { id: 3, task: "Review Database Management assignment", priority: "medium" },
    { id: 4, task: "Prepare lesson plan for next week", priority: "low" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Vidyavardhaka College of Engineering, Mysore</p>
      </div>

      {/* Class Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Class for Detailed Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="class-select">Choose a class to view specific statistics</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class-select" className="mt-2">
                  <SelectValue placeholder="View all classes overview" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes (Overview)</SelectItem>
                  {classes.map((classItem) => (
                    <SelectItem key={classItem.name} value={classItem.name}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {selectedClass !== "all" ? `Statistics for: ${selectedClass}` : "Overall Statistics"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-2">{stat.trend}</p>
                    </div>
                    <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Classes */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-gray-900">{classItem.name}</p>
                    <p className="text-sm text-gray-600">{classItem.students} students</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{classItem.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <input type="checkbox" className="mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{item.task}</p>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                        item.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : item.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}