import { motion } from "motion/react";
import { useState } from "react";
import { Download, CreditCard } from "lucide-react";

export function ExamReports() {
  const [selectedSemester, setSelectedSemester] = useState(5);

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const examData: Record<
    number,
    {
      sgpa: number;
      cgpa: number;
      subjects: Array<{
        code: string;
        name: string;
        cie1: number;
        cie2: number;
        cie3: number;
        exam: number;
        total: number;
        grade: string;
      }>;
    }
  > = {
    5: {
      sgpa: 8.7,
      cgpa: 8.5,
      subjects: [
        {
          code: "18CS51",
          name: "Management & Entrepreneurship",
          cie1: 18,
          cie2: 19,
          cie3: 17,
          exam: 68,
          total: 86,
          grade: "S",
        },
        {
          code: "18CS52",
          name: "Computer Networks",
          cie1: 17,
          cie2: 18,
          cie3: 19,
          exam: 72,
          total: 90,
          grade: "S",
        },
        {
          code: "18CS53",
          name: "Database Management System",
          cie1: 19,
          cie2: 18,
          cie3: 18,
          exam: 75,
          total: 93,
          grade: "S",
        },
        {
          code: "18CS54",
          name: "Automata Theory",
          cie1: 16,
          cie2: 17,
          cie3: 18,
          exam: 65,
          total: 82,
          grade: "A",
        },
        {
          code: "18CS55",
          name: "Application Development using Python",
          cie1: 18,
          cie2: 19,
          cie3: 18,
          exam: 70,
          total: 88,
          grade: "S",
        },
      ],
    },
  };

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 90) return "text-black";
    if (percentage >= 70) return "text-gray-700";
    if (percentage >= 50) return "text-gray-500";
    return "text-gray-400";
  };

  const currentSemesterData = examData[selectedSemester];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-8">
          Exam Reports
        </h1>

        {/* Semester Selector */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max md:min-w-0">
            {semesters.map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`px-6 py-3 rounded font-semibold transition-all ${
                  selectedSemester === sem
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                Sem {sem}
              </button>
            ))}
          </div>
        </div>

        {currentSemesterData ? (
          <>
            {/* SGPA & CGPA Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-gray-200 rounded p-8"
              >
                <h3 className="text-gray-500 mb-4">Semester GPA</h3>
                <p className="text-5xl font-bold text-black mb-2">
                  {currentSemesterData.sgpa}
                </p>
                <p className="text-gray-500">Out of 10.0</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-gray-200 rounded p-8"
              >
                <h3 className="text-gray-500 mb-4">Cumulative GPA</h3>
                <p className="text-5xl font-bold text-black mb-2">
                  {currentSemesterData.cgpa}
                </p>
                <p className="text-gray-500">Overall Performance</p>
              </motion.div>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-4 mb-6 flex-wrap">
              <button className="bg-black hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded transition-all flex items-center gap-2">
                <Download size={20} />
                Export as PDF
              </button>
              <button className="bg-white hover:bg-gray-100 text-black font-semibold px-6 py-3 rounded transition-all flex items-center gap-2 border border-gray-200">
                <Download size={20} />
                Export as Excel
              </button>
              <button className="bg-black hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded transition-all flex items-center gap-2 ml-auto">
                <CreditCard size={20} />
                Exam Fee Section
              </button>
            </div>

            {/* Marks Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-gray-200 rounded overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left p-4 text-black font-semibold">
                        Subject
                      </th>
                      <th className="text-center p-4 text-black font-semibold">
                        CIE 1
                      </th>
                      <th className="text-center p-4 text-black font-semibold">
                        CIE 2
                      </th>
                      <th className="text-center p-4 text-black font-semibold">
                        CIE 3
                      </th>
                      <th className="text-center p-4 text-black font-semibold">
                        Exam
                      </th>
                      <th className="text-center p-4 text-black font-semibold">
                        Total
                      </th>
                      <th className="text-center p-4 text-black font-semibold">
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSemesterData.subjects.map((subject, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4">
                          <p className="text-black font-semibold">
                            {subject.name}
                          </p>
                          <p className="text-gray-500 text-sm">{subject.code}</p>
                        </td>
                        <td
                          className={`text-center p-4 font-semibold ${getScoreColor(
                            subject.cie1,
                            20
                          )}`}
                        >
                          {subject.cie1}/20
                        </td>
                        <td
                          className={`text-center p-4 font-semibold ${getScoreColor(
                            subject.cie2,
                            20
                          )}`}
                        >
                          {subject.cie2}/20
                        </td>
                        <td
                          className={`text-center p-4 font-semibold ${getScoreColor(
                            subject.cie3,
                            20
                          )}`}
                        >
                          {subject.cie3}/20
                        </td>
                        <td
                          className={`text-center p-4 font-semibold ${getScoreColor(
                            subject.exam,
                            80
                          )}`}
                        >
                          {subject.exam}/80
                        </td>
                        <td
                          className={`text-center p-4 font-semibold ${getScoreColor(
                            subject.total,
                            100
                          )}`}
                        >
                          {subject.total}/100
                        </td>
                        <td className="text-center p-4">
                          <span className="px-3 py-1 rounded text-sm border border-gray-300 text-gray-700">
                            {subject.grade}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No exam data available for this semester
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
