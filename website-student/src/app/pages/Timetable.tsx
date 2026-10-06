import { motion } from "motion/react";
import { useState } from "react";
import { Clock, MapPin } from "lucide-react";

export function Timetable() {
  const [selectedDay, setSelectedDay] = useState("Monday");

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const timetableData: Record<string, any[]> = {
    Monday: [
      {
        time: "9:00 AM - 10:00 AM",
        subject: "Data Structures & Algorithms",
        professor: "Dr. Ramesh Kumar",
        room: "Room 301",
        type: "Theory",
      },
      {
        time: "10:15 AM - 11:15 AM",
        subject: "Database Management Systems",
        professor: "Prof. Anjali Sharma",
        room: "Room 205",
        type: "Theory",
      },
      {
        time: "11:30 AM - 12:30 PM",
        subject: "Operating Systems",
        professor: "Dr. Vikram Patel",
        room: "Room 104",
        type: "Theory",
      },
      {
        time: "1:30 PM - 3:30 PM",
        subject: "DSA Lab",
        professor: "Dr. Ramesh Kumar",
        room: "Lab 204",
        type: "Lab",
      },
    ],
    Tuesday: [
      {
        time: "9:00 AM - 10:00 AM",
        subject: "Computer Networks",
        professor: "Prof. Suresh Naik",
        room: "Room 302",
        type: "Theory",
      },
      {
        time: "10:15 AM - 11:15 AM",
        subject: "Web Technologies",
        professor: "Dr. Priya Desai",
        room: "Room 201",
        type: "Theory",
      },
      {
        time: "11:30 AM - 12:30 PM",
        subject: "Software Engineering",
        professor: "Prof. Kiran Bhat",
        room: "Room 105",
        type: "Theory",
      },
    ],
    Wednesday: [
      {
        time: "9:00 AM - 11:00 AM",
        subject: "DBMS Lab",
        professor: "Prof. Anjali Sharma",
        room: "Lab 301",
        type: "Lab",
      },
      {
        time: "11:30 AM - 12:30 PM",
        subject: "Data Structures & Algorithms",
        professor: "Dr. Ramesh Kumar",
        room: "Room 301",
        type: "Theory",
      },
      {
        time: "1:30 PM - 2:30 PM",
        subject: "Operating Systems",
        professor: "Dr. Vikram Patel",
        room: "Room 104",
        type: "Theory",
      },
    ],
    Thursday: [
      {
        time: "9:00 AM - 10:00 AM",
        subject: "Web Technologies",
        professor: "Dr. Priya Desai",
        room: "Room 201",
        type: "Theory",
      },
      {
        time: "10:15 AM - 11:15 AM",
        subject: "Computer Networks",
        professor: "Prof. Suresh Naik",
        room: "Room 302",
        type: "Theory",
      },
      {
        time: "1:30 PM - 3:30 PM",
        subject: "Web Technologies Lab",
        professor: "Dr. Priya Desai",
        room: "Lab 101",
        type: "Lab",
      },
    ],
    Friday: [
      {
        time: "9:00 AM - 10:00 AM",
        subject: "Software Engineering",
        professor: "Prof. Kiran Bhat",
        room: "Room 105",
        type: "Theory",
      },
      {
        time: "10:15 AM - 11:15 AM",
        subject: "Database Management Systems",
        professor: "Prof. Anjali Sharma",
        room: "Room 205",
        type: "Theory",
      },
      {
        time: "11:30 AM - 1:30 PM",
        subject: "Mini Project",
        professor: "Dr. Ramesh Kumar",
        room: "Lab 204",
        type: "Project",
      },
    ],
    Saturday: [
      {
        time: "9:00 AM - 11:00 AM",
        subject: "Seminar",
        professor: "Dr. Priya Desai",
        room: "Seminar Hall",
        type: "Seminar",
      },
    ],
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-8">
          Timetable
        </h1>

        {/* Day Selector */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max md:min-w-0">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-3 rounded font-semibold transition-all ${
                  selectedDay === day
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {timetableData[selectedDay].map((cls, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded p-6 hover:border-gray-400 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-black">
                  <Clock size={16} />
                  <span className="text-sm">{cls.time}</span>
                </div>
                <span className="px-3 py-1 rounded text-xs border border-gray-300 text-gray-700">
                  {cls.type}
                </span>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">
                {cls.subject}
              </h3>
              <p className="text-gray-500 mb-3">{cls.professor}</p>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={16} />
                <span className="text-sm">{cls.room}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {timetableData[selectedDay].length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No classes scheduled</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
