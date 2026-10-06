import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  Code,
  Palette,
  Trophy,
  BookOpen,
  Heart,
  Search,
  X,
  Mail,
  Phone,
  Users,
} from "lucide-react";

export function Clubs() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClub, setSelectedClub] = useState<any>(null);

  const categories = [
    { name: "All", icon: null },
    { name: "Technical", icon: Code },
    { name: "Cultural", icon: Palette },
    { name: "Sports", icon: Trophy },
    { name: "Literary", icon: BookOpen },
    { name: "Social Service", icon: Heart },
  ];

  const clubs = [
    {
      id: 1,
      name: "IEEE Student Chapter",
      category: "Technical",
      description:
        "IEEE VVCE student chapter focused on advancing technology for humanity",
      fullDescription:
        "The IEEE VVCE Student Branch provides students with opportunities to engage in technical activities, network with professionals, and develop leadership skills. We organize workshops, seminars, and technical competitions throughout the year.",
      members: 245,
      email: "ieee@vvce.ac.in",
      phone: "+91 98765 43210",
      icon: Code,
    },
    {
      id: 2,
      name: "ACM Student Chapter",
      category: "Technical",
      description: "Association for Computing Machinery student chapter",
      fullDescription:
        "ACM VVCE focuses on advancing computing as a science and profession. We conduct coding competitions, tech talks, and provide access to ACM's digital library and resources.",
      members: 198,
      email: "acm@vvce.ac.in",
      phone: "+91 98765 43211",
      icon: Code,
    },
    {
      id: 3,
      name: "Robotics Club",
      category: "Technical",
      description: "Build and program robots, participate in competitions",
      fullDescription:
        "The Robotics Club enables students to explore the exciting world of robotics through hands-on projects, workshops, and competitions. We work on autonomous robots, IoT devices, and participate in national-level competitions.",
      members: 156,
      email: "robotics@vvce.ac.in",
      phone: "+91 98765 43212",
      icon: Code,
    },
    {
      id: 4,
      name: "Music Club",
      category: "Cultural",
      description: "Express yourself through music",
      fullDescription:
        "The Music Club provides a platform for students to showcase their musical talents, learn instruments, and participate in college events and competitions. We organize jam sessions, concerts, and music workshops.",
      members: 132,
      email: "music@vvce.ac.in",
      phone: "+91 98765 43213",
      icon: Palette,
    },
    {
      id: 5,
      name: "Dance Club",
      category: "Cultural",
      description: "Various dance forms and performances",
      fullDescription:
        "The Dance Club celebrates the art of dance through regular practice sessions, workshops, and performances. We cover various dance styles from classical to contemporary and participate in inter-college competitions.",
      members: 178,
      email: "dance@vvce.ac.in",
      phone: "+91 98765 43214",
      icon: Palette,
    },
    {
      id: 6,
      name: "Cricket Club",
      category: "Sports",
      description: "College cricket team and tournaments",
      fullDescription:
        "The Cricket Club represents VVCE in various inter-college tournaments and organizes intra-college cricket events. We provide coaching, practice facilities, and competitive opportunities for cricket enthusiasts.",
      members: 89,
      email: "cricket@vvce.ac.in",
      phone: "+91 98765 43215",
      icon: Trophy,
    },
    {
      id: 7,
      name: "Debate Society",
      category: "Literary",
      description: "Enhance your debating and public speaking skills",
      fullDescription:
        "The Debate Society helps students develop critical thinking, public speaking, and argumentation skills through regular debates, discussion forums, and participation in national debate competitions.",
      members: 67,
      email: "debate@vvce.ac.in",
      phone: "+91 98765 43216",
      icon: BookOpen,
    },
    {
      id: 8,
      name: "NSS",
      category: "Social Service",
      description: "National Service Scheme - Serve the community",
      fullDescription:
        "NSS VVCE unit engages students in social service activities, community development programs, and awareness campaigns. We organize blood donation drives, cleanliness drives, and various social welfare initiatives.",
      members: 312,
      email: "nss@vvce.ac.in",
      phone: "+91 98765 43217",
      icon: Heart,
    },
  ];

  const filteredClubs = clubs.filter((club) => {
    const matchesCategory =
      selectedCategory === "All" || club.category === selectedCategory;
    const matchesSearch = club.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-8">
          Clubs & Societies
        </h1>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clubs..."
              className="w-full bg-white border border-gray-200 rounded pl-12 pr-4 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-6 py-3 rounded font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedCategory === cat.name
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {Icon && <Icon size={18} />}
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club, index) => {
            const Icon = club.icon;
            return (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedClub(club)}
                className="bg-white border border-gray-200 rounded p-6 hover:border-gray-400 transition-all cursor-pointer"
              >
                <Icon className="text-black mb-4" size={32} />
                <h3 className="text-xl font-bold text-black mb-2">
                  {club.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4">{club.description}</p>
                <div className="flex items-center gap-2 text-gray-700">
                  <Users size={16} />
                  <span className="text-sm">{club.members} members</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No clubs found</p>
          </div>
        )}
      </motion.div>

      {/* Club Detail Modal */}
      <AnimatePresence>
        {selectedClub && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClub(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white border border-gray-200 rounded p-8 z-50 overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedClub(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-6">
                {selectedClub.icon && (
                  <selectedClub.icon className="text-black mb-4" size={48} />
                )}
                <h2 className="text-3xl font-bold text-black mb-2">
                  {selectedClub.name}
                </h2>
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <Users size={16} />
                  <span>{selectedClub.members} members</span>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{selectedClub.fullDescription}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail size={20} className="text-black" />
                  <a
                    href={`mailto:${selectedClub.email}`}
                    className="hover:text-black transition-colors"
                  >
                    {selectedClub.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone size={20} className="text-black" />
                  <a
                    href={`tel:${selectedClub.phone}`}
                    className="hover:text-black transition-colors"
                  >
                    {selectedClub.phone}
                  </a>
                </div>
              </div>

              <button className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded transition-all">
                Join Club
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
