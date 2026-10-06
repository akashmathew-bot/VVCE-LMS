import { motion } from "motion/react";
import { MapPin, Clock, Phone, Navigation } from "lucide-react";

export function BusSchedules() {
  const busRoutes = [
    {
      id: "Bus No-1",
      name: "VVCE College - Mysore Bus Stand",
      stops: [
        "VVCE Main Gate",
        "Hootagalli",
        "Hebbal",
        "Gokulam",
        "KEB Circle",
        "Mysore Bus Stand",
      ],
      departure: "5:00 PM",
      duration: "45 mins",
      status: "Active",
      driver: "+91 98765 11111",
    },
    {
      id: "Bus No-2",
      name: "VVCE College - Mysore Bus Stand",
      stops: [
        "VVCE Main Gate",
        "Ring Road",
        "Vijayanagar",
        "Kuvempunagar",
        "Saraswathipuram",
        "Mysore Bus Stand",
      ],
      departure: "5:30 PM",
      duration: "50 mins",
      status: "Active",
      driver: "+91 98765 22222",
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-8">
          Bus Schedules
        </h1>

        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded p-8 mb-8 text-center"
        >
          <MapPin className="text-black mx-auto mb-4" size={48} />
          <h3 className="text-black text-xl font-semibold mb-2">
            Bus Route Map
          </h3>
          <p className="text-gray-500">
            Interactive map showing all bus routes and current positions
          </p>
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded p-12">
            <p className="text-gray-400">Map visualization placeholder</p>
          </div>
        </motion.div>

        {/* Bus Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {busRoutes.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center border border-gray-300">
                    <span className="text-black font-bold">{route.id}</span>
                  </div>
                  <div>
                    <h3 className="text-black font-semibold">{route.name}</h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Clock size={14} />
                      <span>{route.duration}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded text-xs border ${route.status === "Active" ? "border-gray-300 text-gray-700" : "border-gray-400 text-gray-600"}`}>
                  {route.status}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-gray-500 text-sm mb-2">Major Stops:</p>
                <div className="space-y-2">
                  {route.stops.map((stop, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          idx === route.stops.length - 1
                            ? "bg-black"
                            : "bg-gray-400"
                        }`}
                      />
                      <span className="text-gray-700 text-sm">{stop}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <Clock size={16} className="text-black" />
                  <span>Departs at {route.departure}</span>
                </div>
                <a
                  href={`tel:${route.driver}`}
                  className="flex items-center gap-2 text-black hover:text-gray-700 transition-colors text-sm"
                >
                  <Phone size={16} />
                  <span>Call Driver</span>
                </a>
              </div>

              <button className="w-full mt-4 bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded transition-all flex items-center justify-center gap-2">
                <Navigation size={20} />
                Track Bus
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
