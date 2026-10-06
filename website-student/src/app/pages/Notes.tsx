import { motion } from "motion/react";
import { useState } from "react";
import { FileText, ChevronRight } from "lucide-react";

export function Notes() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const subjects = [
    {
      id: 1,
      name: "Data Structures & Algorithms",
      code: "18CS51",
      totalNotes: 12,
      notes: [
        {
          id: 1,
          title: "Binary Search Trees - Complete Guide",
          date: "April 10, 2026",
          preview: "Complete implementation and analysis of BST operations...",
          type: "PDF",
        },
        {
          id: 2,
          title: "Sorting Algorithms",
          date: "April 8, 2026",
          preview: "Quick sort, merge sort, heap sort with time complexity...",
          type: "PDF",
        },
        {
          id: 3,
          title: "Graph Algorithms",
          date: "April 5, 2026",
          preview: "BFS, DFS, Dijkstra's algorithm implementation...",
          type: "PDF",
        },
      ],
    },
    {
      id: 2,
      name: "Database Management Systems",
      code: "18CS52",
      totalNotes: 8,
      notes: [
        {
          id: 4,
          title: "Normalization in DBMS",
          date: "April 8, 2026",
          preview: "1NF, 2NF, 3NF, and BCNF with examples...",
          type: "PDF",
        },
        {
          id: 5,
          title: "SQL Queries and Joins",
          date: "April 6, 2026",
          preview: "Inner join, outer join, cross join examples...",
          type: "PDF",
        },
      ],
    },
    {
      id: 3,
      name: "Operating Systems",
      code: "18CS53",
      totalNotes: 10,
      notes: [
        {
          id: 6,
          title: "Process Scheduling Algorithms",
          date: "April 7, 2026",
          preview: "FCFS, SJF, Priority, Round Robin scheduling algorithms...",
          type: "PDF",
        },
        {
          id: 7,
          title: "Memory Management",
          date: "April 4, 2026",
          preview: "Paging, segmentation, virtual memory concepts...",
          type: "PDF",
        },
      ],
    },
    {
      id: 4,
      name: "Computer Networks",
      code: "18CS54",
      totalNotes: 9,
      notes: [
        {
          id: 8,
          title: "TCP/IP Protocol Stack",
          date: "April 9, 2026",
          preview: "Detailed notes on network protocol layers and their functions...",
          type: "PDF",
        },
        {
          id: 9,
          title: "Routing Algorithms",
          date: "April 3, 2026",
          preview: "Distance vector and link state routing protocols...",
          type: "PDF",
        },
      ],
    },
    {
      id: 5,
      name: "Web Technologies",
      code: "18CS55",
      totalNotes: 7,
      notes: [
        {
          id: 10,
          title: "React Hooks Deep Dive",
          date: "April 6, 2026",
          preview: "useState, useEffect, and custom hooks explained...",
          type: "PDF",
        },
        {
          id: 11,
          title: "REST API Design",
          date: "April 2, 2026",
          preview: "Best practices for designing RESTful APIs...",
          type: "PDF",
        },
      ],
    },
  ];

  const currentSubject = subjects.find((s) => s.id.toString() === selectedSubject);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-black">
            {selectedSubject ? currentSubject?.name : "Notes"}
          </h1>
          {selectedSubject && (
            <button
              onClick={() => setSelectedSubject(null)}
              className="text-gray-700 hover:text-black transition-colors text-sm"
            >
              ← Back to Subjects
            </button>
          )}
        </div>

        {!selectedSubject ? (
          <>
            {/* Subjects List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedSubject(subject.id.toString())}
                  className="bg-white border border-gray-200 rounded p-6 hover:border-gray-400 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-black mb-1">
                        {subject.name}
                      </h3>
                      <p className="text-gray-500 text-sm">{subject.code}</p>
                    </div>
                    <ChevronRight className="text-gray-400 group-hover:text-black transition-colors" size={24} />
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FileText size={16} />
                    <span className="text-sm">{subject.totalNotes} notes available</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Subject Notes */}
            <div className="mb-4">
              <p className="text-gray-500">{currentSubject?.code}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentSubject?.notes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded p-6 hover:border-gray-400 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <FileText className="text-black" size={24} />
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs border border-gray-300">
                      {note.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2">
                    {note.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">{note.preview}</p>
                  <p className="text-gray-400 text-xs">{note.date}</p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
