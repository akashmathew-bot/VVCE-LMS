import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
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
} from "lucide-react";

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
];

export function RootLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(session);
      setIsAuthLoading(false);

      if (!session) {
        navigate("/login", { replace: true });
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;

      setSession(nextSession);

      if (!nextSession) {
        navigate("/login", { replace: true });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const userEmail = session?.user?.email || "";
  const userUSN = userEmail.endsWith("@vvce.ac.in")
    ? userEmail.split("@")[0].toUpperCase()
    : "N/A";
  const userName =
    session?.user?.user_metadata?.name || "Student Profile";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const NotifButton = ({ size = 20 }: { size?: number }) => (
    <button
      onClick={() => navigate("/notifications")}
      className="relative p-2 rounded hover:bg-gray-100 transition-colors text-black"
      aria-label="Notifications"
    >
      <BellRing size={size} strokeWidth={1.75} />
    </button>
  );

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
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
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

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
                      <h3 className="text-black font-semibold">{userName}</h3>
                      <p className="text-gray-500 text-sm">{userUSN}</p>
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

      <div className="hidden lg:block fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6">
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

          <div className="mb-8 p-4 bg-gray-50 rounded border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-black font-semibold">{userName}</h3>
                <p className="text-gray-500 text-sm">{userUSN}</p>
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

      <div className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
