import { Outlet, Link, useLocation } from "react-router";
import { Book, Calendar, Menu, X, BarChart3, HardDrive, ClipboardList, Bell, Megaphone, Info, DoorOpen, Users, Clock, CheckCircle, Search, MapPin, PenLine, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast, Toaster } from "sonner";

export default function Root() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");;

  const notifications = [
    {
      id: 1,
      sender: "Principal",
      message: "All faculty must submit internal marks by Friday 5 PM.",
      time: "2 hours ago",
      icon: Megaphone,
      color: "bg-purple-100 text-purple-700",
      iconColor: "text-purple-600"
    },
    {
      id: 2,
      sender: "System Admin",
      message: "Server maintenance scheduled for this weekend. Drive access may be intermittent.",
      time: "5 hours ago",
      icon: Info,
      color: "bg-blue-100 text-blue-700",
      iconColor: "text-blue-600"
    }
  ];

  const initialRooms = [
    { id: 1, name: "Sahukar Chennaiah Auditorium", block: "Main Block", type: "Auditorium", capacity: 500, isFree: false, nextBooking: "Available at 4:00 PM" },
    { id: 2, name: "CSE Department Seminar Hall", block: "A Block", type: "Seminar", capacity: 120, isFree: true, nextBooking: "2:00 PM" },
    { id: 3, name: "ISE Seminar Hall", block: "B Block", type: "Seminar", capacity: 100, isFree: true, nextBooking: "Tomorrow" },
    { id: 4, name: "TAP Cell Conference Room", block: "Admin Block", type: "Conference", capacity: 40, isFree: true, nextBooking: "3:30 PM" },
    { id: 5, name: "Board Room", block: "Admin Block", type: "Conference", capacity: 20, isFree: false, nextBooking: "Available at 1:00 PM" },
    { id: 6, name: "Smart Classroom A203", block: "A Block", type: "Interactive Class", capacity: 60, isFree: true, nextBooking: "11:30 AM" },
    { id: 7, name: "Innovation Lab", block: "C Block", type: "Interactive Class", capacity: 50, isFree: true, nextBooking: "Tomorrow" },
  ];

  const [rooms, setRooms] = useState(initialRooms);
  const [bookingRoomId, setBookingRoomId] = useState<number | null>(null);
  const [bookingForm, setBookingForm] = useState({ name: "", purpose: "", duration: "1 Hour" });

  const handleInitiateBook = (roomId: number) => {
    setBookingRoomId(roomId);
    setBookingForm({ name: "", purpose: "", duration: "1 Hour" });
  };

  const handleConfirmBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingRoomId === null) return;
    
    setRooms(rooms.map(r => r.id === bookingRoomId ? { 
      ...r, 
      isFree: false, 
      nextBooking: `Booked by ${bookingForm.name} (${bookingForm.duration})` 
    } : r));
    toast.success(`Hall booked successfully for ${bookingForm.purpose}! A confirmation email has been sent.`);
    setBookingRoomId(null);
  };

  const filteredRooms = rooms.filter(r => 
    (filterType === "All" || r.type === filterType) &&
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBookHallDialogContent = () => {
    if (bookingRoomId !== null) {
      const room = rooms.find(r => r.id === bookingRoomId);
      return (
        <form onSubmit={handleConfirmBook} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Confirm Booking</DialogTitle>
            <DialogDescription>
              Complete your booking details for {room?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Your Name</label>
              <Input 
                required 
                placeholder="e.g. Prof. Sharma" 
                value={bookingForm.name}
                onChange={e => setBookingForm({...bookingForm, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Purpose of Booking</label>
              <Input 
                required 
                placeholder="e.g. Guest Lecture on AI" 
                value={bookingForm.purpose}
                onChange={e => setBookingForm({...bookingForm, purpose: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Time Duration</label>
              <select 
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={bookingForm.duration}
                onChange={e => setBookingForm({...bookingForm, duration: e.target.value})}
              >
                <option value="1 Hour">1 Hour</option>
                <option value="2 Hours">2 Hours</option>
                <option value="3 Hours">3 Hours</option>
                <option value="Half Day">Half Day</option>
                <option value="Full Day">Full Day</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outline" type="button" onClick={() => setBookingRoomId(null)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg transition-all">
              Confirm Booking
            </Button>
          </div>
        </form>
      );
    }

    return (
      <>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Book a Space</DialogTitle>
        <DialogDescription>
          Check real-time availability for spaces at Vidyavardhaka College of Engineering.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search rooms..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 w-full rounded-xl"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
            {["All", "Seminar", "Conference", "Interactive Class", "Auditorium"].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filterType === type 
                    ? "bg-blue-100 text-blue-700 border border-blue-200" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2 pb-4">
          {filteredRooms.length > 0 ? filteredRooms.map(room => (
            <div key={room.id} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{room.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <p className="text-xs text-gray-500">{room.block} • {room.capacity} seats</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 ${
                  room.isFree ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                }`}>
                  {room.isFree ? (
                    <><CheckCircle className="w-3 h-3" /> Free</>
                  ) : (
                    <><Clock className="w-3 h-3" /> Occupied</>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50">
                <span className="text-xs text-gray-500 font-medium">
                  {room.isFree ? `Next: ${room.nextBooking}` : room.nextBooking}
                </span>
                <Button 
                  variant={room.isFree ? "default" : "secondary"}
                  size="sm"
                  disabled={!room.isFree}
                  onClick={() => handleInitiateBook(room.id)}
                  className={room.isFree ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm" : ""}
                >
                  {room.isFree ? "Book Now" : "Booked"}
                </Button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-8 text-center text-gray-500">
              <DoorOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No rooms found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

  const navigation = [
    { name: "Calendar", href: "/", icon: Calendar },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Classes", href: "/classes", icon: Book },
    { name: "Marks/Attendance", href: "/marks-attendance", icon: PenLine },
    { name: "Attainment", href: "/attainment", icon: FileSpreadsheet },
    { name: "Drive", href: "/drive", icon: HardDrive },
    { name: "Assignments", href: "/assignments", icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Toaster position="top-center" richColors />
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Book className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1 mr-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.href ||
                    (item.href !== "/" && location.pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Book Room Dialog */}
              <Dialog onOpenChange={(open) => { if (!open) setBookingRoomId(null); }}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="hidden sm:flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg h-9 px-3">
                    <DoorOpen className="w-4 h-4" />
                    <span className="text-sm font-medium">Book Hall</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl rounded-2xl w-[95vw] sm:w-full">
                  {renderBookHallDialogContent()}
                </DialogContent>
              </Dialog>

              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-full">
                    <Bell className="w-5 h-5 text-gray-700" />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0 rounded-xl overflow-hidden shadow-xl border-gray-100 mt-2">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className="flex items-start gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${notification.color}`}>
                          <notification.icon className={`w-4 h-4 ${notification.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h4 className="font-medium text-gray-900 text-sm truncate pr-2">{notification.sender}</h4>
                            <span className="text-[10px] text-gray-500 whitespace-nowrap">{notification.time}</span>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{notification.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-gray-100 bg-gray-50/50 text-center">
                    <button className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors w-full py-1">
                      Mark all as read
                    </button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.href ||
                  (item.href !== "/" && location.pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Book Hall Button */}
              <Dialog onOpenChange={(open) => { if (!open) setBookingRoomId(null); }}>
                <DialogTrigger asChild>
                  <button className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-blue-700 bg-blue-50 hover:bg-blue-100 mt-2">
                    <DoorOpen className="w-5 h-5" />
                    <span>Book Hall</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl rounded-2xl w-[95vw] max-h-[85vh] overflow-y-auto">
                  {renderBookHallDialogContent()}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}