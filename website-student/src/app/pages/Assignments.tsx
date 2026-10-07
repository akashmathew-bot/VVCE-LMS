import { motion } from "motion/react";
import { useState } from "react";
import { AlertCircle, Upload, CheckCircle } from "lucide-react";

export function Assignments() {
  const [filter, setFilter] = useState<"all" | "pending" | "submitted">("all");

  const assignments = [
    {
      id: 1,
      title: "Binary Search Tree Implementation",
      subject: "Data Structures & Algorithms",
      description: "Implement BST with insert, delete, and search operations",
      deadline: "April 14, 2026",
      daysLeft: 2,
      priority: "High",
      status: "pending",
    },
    {
      id: 2,
      title: "ER Diagram Design",
      subject: "Database Management Systems",
      description: "Design ER diagram for library management system",
      deadline: "April 17, 2026",
      daysLeft: 5,
      priority: "Medium",
      status: "pending",
    },
    {
      id: 3,
      title: "Process Scheduling Report",
      subject: "Operating Systems",
      description: "Write a detailed report on CPU scheduling algorithms",
      deadline: "April 19, 2026",
      daysLeft: 7,
      priority: "Low",
      status: "pending",
    },
    {
      id: 4,
      title: "Network Protocol Analysis",
      subject: "Computer Networks",
      description: "Analyze TCP/IP protocol stack",
      deadline: "April 10, 2026",
      submittedDate: "April 9, 2026",
      priority: "High",
      status: "submitted",
    },
    {
      id: 5,
      title: "HTML/CSS Portfolio",
      subject: "Web Technologies",
      description: "Create a personal portfolio website",
      deadline: "April 8, 2026",
      submittedDate: "April 7, 2026",
      priority: "Medium",
      status: "submitted",
    },
  ];

  const filteredAssignments = assignments.filter((a) => {
    if (filter === "all") return true;
    return a.status === filter;
  });

  const priorityColors: Record<string, string> = {
    High: "bg-red-100 text-red-700 border-red-200",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Low: "bg-green-100 text-green-700 border-green-200",
  };

  const pendingCount = assignments.filter((a) => a.status === "pending").length;
  const submittedCount = assignments.filter(
    (a) => a.status === "submitted"
  ).length;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
          Assignments
        </h1>
        <p className="text-gray-500 mb-8">
          {pendingCount} pending • {submittedCount} submitted
        </p>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-3 rounded font-semibold whitespace-nowrap transition-all ${
              filter === "all"
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            All ({assignments.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-6 py-3 rounded font-semibold whitespace-nowrap transition-all ${
              filter === "pending"
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter("submitted")}
            className={`px-6 py-3 rounded font-semibold whitespace-nowrap transition-all ${
              filter === "submitted"
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Submitted ({submittedCount})
          </button>
        </div>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAssignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-black flex-1">
                  {assignment.title}
                </h3>
                <span className={`px-3 py-1 rounded text-xs border ${priorityColors[assignment.priority] || "border-gray-300 text-gray-700"}`}>
                  {assignment.priority}
                </span>
              </div>

              <p className="text-black mb-2">{assignment.subject}</p>
              <p className="text-gray-500 text-sm mb-4">
                {assignment.description}
              </p>

              {assignment.status === "pending" ? (
                <>
                  <div className="flex items-center gap-2 text-gray-700 mb-4">
                    <AlertCircle size={16} />
                    <span className="text-sm">
                      Due: {assignment.deadline} (in {assignment.daysLeft} days)
                    </span>
                  </div>
                  <button className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded transition-all flex items-center justify-center gap-2">
                    <Upload size={20} />
                    Upload Assignment
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-black mb-4">
                    <CheckCircle size={16} />
                    <span className="text-sm">
                      Submitted on {assignment.submittedDate}
                    </span>
                  </div>
                  <div className="bg-gray-100 border border-gray-200 rounded p-3 text-center text-gray-700">
                    Submitted Successfully
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No assignments found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
