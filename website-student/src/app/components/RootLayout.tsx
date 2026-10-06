import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Calendar,
  FileText,
  BookOpen,
  Users,
  Award,
  Bus,
  ClipboardList,
  HelpCircle,
  Menu,
  X,
  LogOut,
  User,
  BellRing,
  CircleUserRound,
} from "lucide-react";

const UNREAD_COUNT = 4;

const navItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Calendar, label: "Timetable", path: "/timetable" },
  { icon: FileText, label: "Assignments", path: "/assignments" },
  { icon: BookOpen, label: "Notes", path: "/notes" },
  { icon: Users, label: "Clubs", path: "/clubs" },
  { icon: Award, label: "Exam Reports", path: "/exam-reports" },
  { icon: Bus, label: "Bus Schedules", path: "/bus-schedules" },
  { icon: ClipboardList, label: "Survey", path: "/survey" },
  { icon: HelpCircle, label: "Help", path: "/help" },
  { icon: CircleUserRound, label: "Profile", path: "/profile" },
];

export function RootLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => navigate("/login");

  const NotifButton = ({ size = 20 }: { size?: number }) => (
    <button
      onClick={() => navigate("/notifications")}
      className="relative p-2 rounded hover:bg-gray-100 transition-colors text-black"
      aria-label="Notifications"
    >
      <BellRing size={size} strokeWidth={1.75} />
      {UNREAD_COUNT > 0 && (
        <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-black rounded-full" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">VV</span>
            </div>
            <h1 className="text-black font-semibold">VVCE Portal</h1>
          </div>
          <div className="flex items-center gap-0.5">
            <NotifButton size={21} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-black rounded hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-80 bg-white border-r border-gray-200 z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                      <User className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-black font-semibold">Aditya PS</h3>
                      <p className="text-gray-500 text-sm">4VV22CS057</p>
                    </div>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500">
                    <X size={24} />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded transition-all ${
                          isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded text-gray-700 hover:bg-gray-100 w-full mt-6 transition-all"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6">
          {/* Logo row */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">VV</span>
              </div>
              <div>
                <h1 className="text-black font-bold text-lg">VVCE</h1>
                <p className="text-gray-500 text-sm">Student Portal</p>
              </div>
            </div>
            <NotifButton size={19} />
          </div>

          {/* Student card */}
          <div className="mb-8 p-4 bg-gray-50 rounded border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-black font-semibold">Aditya PS</h3>
                <p className="text-gray-500 text-sm">4VV22CS057</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded transition-all ${
                    isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded text-gray-700 hover:bg-gray-100 w-full mt-6 transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
