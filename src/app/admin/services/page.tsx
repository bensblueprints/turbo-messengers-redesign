"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Loader2,
  ArrowLeft,
  ToggleLeft,
  ToggleRight,
  DollarSign,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Service {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price_range?: string;
  base_price?: number;
  turnaround_time?: string;
  is_active: boolean;
  display_order: number;
  features?: string[];
}

export default function ServicesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      const userRole = (session?.user as { role?: string })?.role;
      if (userRole !== "admin") {
        router.push("/admin/login");
      } else {
        fetchServices();
      }
    }
  }, [status, session, router]);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/admin/services");
      if (response.ok) {
        const data = await response.json();
        setServices(data.services || []);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActive = async (serviceId: number, currentStatus: boolean) => {
    try {
      await fetch("/api/admin/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: serviceId, is_active: !currentStatus }),
      });
      fetchServices();
    } catch (error) {
      console.error("Error toggling service:", error);
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 rounded-lg text-midnight-400 hover:text-electric-400 hover:bg-electric-500/10 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-display font-bold text-white">Services Management</h1>
                <p className="text-sm text-midnight-400">{services.length} services configured</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid gap-4">
          {services.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-midnight-900/50 border border-midnight-800/50 rounded-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                    {service.is_active ? (
                      <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs">Active</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-400 text-xs">Inactive</span>
                    )}
                  </div>
                  <p className="text-midnight-300 text-sm mb-4">{service.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {service.price_range && (
                      <div className="flex items-center gap-2 text-gold-400">
                        <DollarSign className="w-4 h-4" />
                        {service.price_range}
                      </div>
                    )}
                    {service.turnaround_time && (
                      <div className="flex items-center gap-2 text-electric-400">
                        <Clock className="w-4 h-4" />
                        {service.turnaround_time}
                      </div>
                    )}
                  </div>
                  {service.features && service.features.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {service.features.map((feature, idx) => (
                        <span key={idx} className="px-2 py-1 rounded bg-midnight-800/50 text-midnight-300 text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleActive(service.id, service.is_active)}
                    className={`p-2 rounded-lg transition-colors ${
                      service.is_active
                        ? "text-green-400 hover:bg-green-500/10"
                        : "text-gray-400 hover:bg-gray-500/10"
                    }`}
                  >
                    {service.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
