import { motion } from "motion/react";
import { useState } from "react";
import { ClipboardList, Clock, CheckCircle } from "lucide-react";

export function Survey() {
  const [filter, setFilter] = useState<"pending" | "completed">("pending");

  const surveys = [
    {
      id: 1,
      title: "Course Feedback - Semester 5",
      description: "Provide feedback on courses and teaching quality",
      deadline: "April 20, 2026",
      daysLeft: 8,
      questions: 15,
      estimatedTime: "10 mins",
      priority: "High",
      status: "pending",
    },
    {
      id: 2,
      title: "Faculty Evaluation",
      description: "Evaluate faculty performance and teaching methods",
      deadline: "April 18, 2026",
      daysLeft: 6,
      questions: 20,
      estimatedTime: "15 mins",
      priority: "High",
      status: "pending",
    },
    {
      id: 3,
      title: "Campus Facilities Feedback",
      description: "Share your opinion on campus infrastructure and facilities",
      deadline: "April 25, 2026",
      daysLeft: 13,
      questions: 10,
      estimatedTime: "7 mins",
      priority: "Medium",
      status: "pending",
    },
    {
      id: 4,
      title: "Library Services Survey",
      description: "Help us improve library services and resources",
      deadline: "April 22, 2026",
      daysLeft: 10,
      questions: 8,
      estimatedTime: "5 mins",
      priority: "Low",
      status: "pending",
    },
    {
      id: 5,
      title: "Placement Preparation Survey",
      description: "Share your placement preparation needs and expectations",
      deadline: "April 15, 2026",
      completedDate: "April 12, 2026",
      questions: 12,
      estimatedTime: "10 mins",
      priority: "High",
      status: "completed",
    },
    {
      id: 6,
      title: "Extra-Curricular Activities",
      description: "Help us plan better events and activities",
      deadline: "April 10, 2026",
      completedDate: "April 8, 2026",
      questions: 8,
      estimatedTime: "6 mins",
      priority: "Medium",
      status: "completed",
    },
  ];
  const filteredSurveys = surveys.filter((s) => s.status === filter);

  const priorityColors: Record<string, string> = {
    High: "bg-red-100 text-red-700 border-red-200",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Low: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-8">
          Surveys
        </h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter("pending")}
            className={`px-6 py-3 rounded font-semibold transition-all ${
              filter === "pending"
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Pending ({surveys.filter((s) => s.status === "pending").length})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-6 py-3 rounded font-semibold transition-all ${
              filter === "completed"
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Completed ({surveys.filter((s) => s.status === "completed").length})
          </button>
        </div>

        {/* Surveys Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSurveys.map((survey, index) => (
            <motion.div
              key={survey.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <ClipboardList className="text-black" size={24} />
                <span className={`px-3 py-1 rounded text-xs border ${priorityColors[survey.priority] || "border-gray-300 text-gray-700"}`}>
                  {survey.priority}
                </span>
              </div>

              <h3 className="text-xl font-bold text-black mb-2">
                {survey.title}
              </h3>
              <p className="text-gray-500 text-sm mb-4">{survey.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <ClipboardList size={16} className="text-black" />
                  <span>{survey.questions} questions</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <Clock size={16} className="text-black" />
                  <span>{survey.estimatedTime} to complete</span>
                </div>
              </div>

              {survey.status === "pending" ? (
                <>
                  <div className="bg-gray-100 border border-gray-200 rounded p-3 mb-4">
                    <p className="text-gray-700 text-sm">
                      Deadline: {survey.deadline}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {survey.daysLeft} days remaining
                    </p>
                  </div>
                  <button className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded transition-all">
                    Start Survey
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-gray-100 border border-gray-200 rounded p-3 mb-4 flex items-center gap-2">
                    <CheckCircle className="text-black" size={20} />
                    <div>
                      <p className="text-black text-sm">
                        Completed on {survey.completedDate}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Thank you for your feedback!
                      </p>
                    </div>
                  </div>
                  <button className="w-full bg-gray-100 text-gray-500 font-semibold py-3 rounded cursor-not-allowed border border-gray-200">
                    Survey Completed
                  </button>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {filteredSurveys.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No surveys found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
