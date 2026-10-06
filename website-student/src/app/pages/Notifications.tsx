import { useState } from "react";
import { motion } from "motion/react";
import { BellRing, CheckCheck, Trash2, BookOpen, Bus, Users, FileText, Award } from "lucide-react";

type Notif = {
  id: number;
  title: string;
  body: string;
  time: string;
  read: boolean;
  category: "assignment" | "exam" | "club" | "bus" | "notes";
};

const initialNotifications: Notif[] = [
  {
    id: 1,
    title: "Assignment Due Tomorrow",
    body: "DBMS Lab Assignment #3 is due by 11:59 PM. Submit on the portal before the deadline.",
    time: "10 min ago",
    read: false,
    category: "assignment",
  },
  {
    id: 2,
    title: "Exam Schedule Released",
    body: "End-semester exam timetable for Dec 2024 has been published. Check the Exam Reports section.",
    time: "1 hr ago",
    read: false,
    category: "exam",
  },
  {
    id: 3,
    title: "Club Meet — CodeSync",
    body: "Weekly meeting today at 4:00 PM in Seminar Hall B. Attendance is mandatory for core members.",
    time: "3 hr ago",
    read: false,
    category: "club",
  },
  {
    id: 4,
    title: "Bus No-2 Delay",
    body: "Bus No-2 (VVCE → Mysore Bus Stand) will be 15 minutes late this evening due to traffic.",
    time: "Yesterday",
    read: false,
    category: "bus",
  },
  {
    id: 5,
    title: "New Notes Uploaded",
    body: "New notes added for Computer Networks — Unit 4: Transport Layer. Available in the Notes section.",
    time: "Yesterday",
    read: true,
    category: "notes",
  },
  {
    id: 6,
    title: "Internal Assessment Marks",
    body: "IA-2 marks for all subjects have been uploaded. Check your Exam Reports for details.",
    time: "2 days ago",
    read: true,
    category: "exam",
  },
  {
    id: 7,
    title: "OS Assignment Submitted",
    body: "Your Operating Systems Assignment #2 has been successfully received by the faculty.",
    time: "2 days ago",
    read: true,
    category: "assignment",
  },
  {
    id: 8,
    title: "Photography Club Event",
    body: "Annual photo walk on Sunday, 8:00 AM. Meet at the main gate. Bring your camera!",
    time: "3 days ago",
    read: true,
    category: "club",
  },
];

const categoryMeta = {
  assignment: { icon: FileText, label: "Assignment" },
  exam: { icon: Award, label: "Exam" },
  club: { icon: Users, label: "Club" },
  bus: { icon: Bus, label: "Bus" },
  notes: { icon: BookOpen, label: "Notes" },
};

const filters = ["All", "Unread", "Assignment", "Exam", "Club", "Bus", "Notes"] as const;
type Filter = (typeof filters)[number];

export function Notifications() {
  const [notifs, setNotifs] = useState<Notif[]>(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: number) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const dismiss = (id: number) => setNotifs((prev) => prev.filter((n) => n.id !== id));

  const unreadCount = notifs.filter((n) => !n.read).length;

  const filtered = notifs.filter((n) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !n.read;
    return n.category === activeFilter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-white p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black">Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <CheckCheck size={15} />
            Mark all read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-8 no-scrollbar">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              activeFilter === f
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {f}
            {f === "Unread" && unreadCount > 0 && (
              <span className="ml-1.5 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center">
            <BellRing size={28} className="text-gray-300" />
          </div>
          <p className="text-gray-400 text-sm">No notifications here</p>
        </div>
      ) : (
        <div className="space-y-3 max-w-2xl">
          {filtered.map((n, i) => {
            const { icon: Icon, label } = categoryMeta[n.category];
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => markRead(n.id)}
                className={`relative flex gap-4 p-4 rounded-xl border cursor-pointer transition-all group ${
                  n.read
                    ? "border-gray-100 bg-white hover:bg-gray-50"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {/* Category icon */}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    n.read ? "bg-gray-100" : "bg-black"
                  }`}
                >
                  <Icon size={18} className={n.read ? "text-gray-400" : "text-white"} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                      {label}
                    </span>
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
                    )}
                  </div>
                  <p className={`text-sm font-semibold ${n.read ? "text-gray-600" : "text-black"}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{n.body}</p>
                  <p className="text-[10px] text-gray-400 mt-2">{n.time}</p>
                </div>

                {/* Dismiss */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismiss(n.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-black self-start mt-0.5"
                  aria-label="Dismiss"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
