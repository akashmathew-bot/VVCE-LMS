import { motion } from "motion/react";
import { Clock, MapPin, AlertCircle, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";

export function Dashboard() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const todayClasses = [
    {
      time: "9:00 AM - 10:00 AM",
      subject: "Data Structures & Algorithms",
      professor: "Dr. Ramesh Kumar",
      room: "Lab 204",
      type: "Lab",
      status: "Live Now",
    },
    {
      time: "10:15 AM - 11:15 AM",
      subject: "Database Management Systems",
      professor: "Prof. Anjali Sharma",
      room: "Room 301",
      type: "Theory",
      status: "Next",
    },
    {
      time: "11:30 AM - 12:30 PM",
      subject: "Operating Systems",
      professor: "Dr. Vikram Patel",
      room: "Room 104",
      type: "Theory",
      status: "Upcoming",
    },
    {
      time: "1:30 PM - 3:30 PM",
      subject: "Computer Networks",
      professor: "Prof. Suresh Naik",
      room: "Room 302",
      type: "Lab",
      status: "Upcoming",
    },
  ];

  const pendingAssignments = [
    {
      title: "Binary Search Tree Implementation",
      subject: "DSA",
      deadline: "Due in 2 days",
      priority: "High",
    },
    {
      title: "ER Diagram Design",
      subject: "DBMS",
      deadline: "Due in 5 days",
      priority: "Medium",
    },
    {
      title: "Process Scheduling Report",
      subject: "OS",
      deadline: "Due in 1 week",
      priority: "Low",
    },
  ];

  const upcomingTests = [
    {
      name: "CIE 2",
      subject: "Web Technologies",
      date: "April 18, 2026",
      time: "10:00 AM",
      syllabus: "Modules 3-4",
    },
    {
      name: "CIE 2",
      subject: "Computer Networks",
      date: "April 22, 2026",
      time: "2:00 PM",
      syllabus: "Modules 1-3",
    },
  ];

  const priorityColors = {
    High: "bg-red-500/20 text-red-300 border-red-500/50",
    Medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
    Low: "bg-green-500/20 text-green-300 border-green-500/50",
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
          Welcome, Aditya
        </h1>
        <p className="text-gray-500 mb-8">Here's what's happening today</p>

        {/* Today's Classes Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-black">Today's Classes</h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
                  }
                }}
                className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={20} className="text-black" />
              </button>
              <button
                onClick={() => {
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
                  }
                }}
                className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={20} className="text-black" />
              </button>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {todayClasses.map((cls, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-full md:w-[600px] bg-white border border-gray-200 rounded p-6 snap-start"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded text-sm ${
                    cls.status === "Live Now"
                      ? "bg-black text-white"
                      : cls.status === "Next"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-700 border border-gray-300"
                  }`}>
                    {cls.status}
                  </span>
                  <span className="text-gray-500 text-sm">{cls.type}</span>
                </div>
                <h2 className="text-2xl font-bold text-black mb-2">
                  {cls.subject}
                </h2>
                <p className="text-gray-500 mb-3">{cls.professor}</p>
                <div className="flex items-center gap-2 text-black mb-2">
                  <Clock size={16} />
                  <span className="text-sm">{cls.time}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin size={16} />
                  <span className="text-sm">{cls.room}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Assignments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-gray-200 rounded p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-black">
                Pending Assignments
              </h3>
              <span className="bg-black text-white px-3 py-1 rounded text-sm">
                {pendingAssignments.length}
              </span>
            </div>
            <div className="space-y-3">
              {pendingAssignments.map((assignment, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-black font-semibold flex-1">
                      {assignment.title}
                    </h4>
                    <span className="px-2 py-1 rounded text-xs border border-gray-300 text-gray-700">
                      {assignment.priority}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-1">
                    {assignment.subject}
                  </p>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <AlertCircle size={14} />
                    <span>{assignment.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Tests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-gray-200 rounded p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-black">Upcoming Tests</h3>
              <Calendar size={20} className="text-gray-500" />
            </div>
            <div className="space-y-4">
              {upcomingTests.map((test, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-black text-white px-2 py-1 rounded text-xs">
                      {test.name}
                    </span>
                  </div>
                  <h4 className="text-black font-semibold mb-1">
                    {test.subject}
                  </h4>
                  <p className="text-gray-500 text-sm mb-1">
                    {test.date} at {test.time}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Syllabus: {test.syllabus}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
