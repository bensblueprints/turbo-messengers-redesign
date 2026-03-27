"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Loader2, ArrowLeft, ToggleRight, ToggleLeft, Clock, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface County {
  id: number;
  name: string;
  state: string;
  is_active: boolean;
  rush_available: boolean;
  rush_fee?: number;
  standard_turnaround?: string;
  rush_turnaround?: string;
}

export default function CountiesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [counties, setCounties] = useState<County[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      const userRole = (session?.user as { role?: string })?.role;
      if (userRole !== "admin") {
        router.push("/admin/login");
      } else {
        fetchCounties();
      }
    }
  }, [status, session, router]);

  const fetchCounties = async () => {
    try {
      const response = await fetch("/api/admin/counties");
      if (response.ok) {
        const data = await response.json();
        setCounties(data.counties || []);
      }
    } catch (error) {
      console.error("Error fetching counties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActive = async (countyId: number, currentStatus: boolean) => {
    try {
      await fetch("/api/admin/counties", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: countyId, is_active: !currentStatus }),
      });
      fetchCounties();
    } catch (error) {
      console.error("Error toggling county:", error);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-midnight-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-midnight-400" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-midnight-950">
      <header className="sticky top-0 z-50 bg-midnight-950/90 backdrop-blur-md border-b border-midnight-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 rounded-lg text-midnight-400 hover:text-electric-400 hover:bg-electric-500/10 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-display font-bold text-white">Service Areas (Counties)</h1>
              <p className="text-sm text-midnight-400">{counties.filter(c => c.is_active).length} active counties</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {counties.map((county) => (
            <motion.div
              key={county.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`border rounded-xl p-4 ${
                county.is_active
                  ? "bg-midnight-900/50 border-midnight-800/50"
                  : "bg-midnight-900/30 border-midnight-800/30 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className={county.is_active ? "w-5 h-5 text-electric-400" : "w-5 h-5 text-gray-500"} />
                  <h3 className="font-semibold text-white">{county.name}</h3>
                </div>
                <button
                  onClick={() => toggleActive(county.id, county.is_active)}
                  className={`p-1 rounded transition-colors ${
                    county.is_active ? "text-green-400 hover:bg-green-500/10" : "text-gray-400 hover:bg-gray-500/10"
                  }`}
                >
                  {county.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-midnight-300">
                  <Clock className="w-4 h-4" />
                  {county.standard_turnaround || "3-5 business days"}
                </div>
                {county.rush_available && (
                  <div className="flex items-center justify-between text-gold-400">
                    <span>Rush: {county.rush_turnaround || "Same day"}</span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {county.rush_fee || 50}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
