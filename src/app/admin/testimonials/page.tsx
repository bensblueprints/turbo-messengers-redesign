"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Loader2, ArrowLeft, Eye, EyeOff, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Testimonial {
  id: number;
  name: string;
  company?: string;
  content: string;
  rating: number;
  is_featured: boolean;
  is_published: boolean;
  service_type?: string;
  created_at: string;
}

export default function TestimonialsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      const userRole = (session?.user as { role?: string })?.role;
      if (userRole !== "admin") {
        router.push("/admin/login");
      } else {
        fetchTestimonials();
      }
    }
  }, [status, session, router]);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/admin/testimonials");
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data.testimonials || []);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePublished = async (id: number, currentStatus: boolean) => {
    try {
      await fetch("/api/admin/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_published: !currentStatus }),
      });
      fetchTestimonials();
    } catch (error) {
      console.error("Error toggling testimonial:", error);
    }
  };

  const toggleFeatured = async (id: number, currentStatus: boolean) => {
    try {
      await fetch("/api/admin/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_featured: !currentStatus }),
      });
      fetchTestimonials();
    } catch (error) {
      console.error("Error toggling featured:", error);
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
              <h1 className="text-xl font-display font-bold text-white">Testimonials</h1>
              <p className="text-sm text-midnight-400">{testimonials.filter(t => t.is_published).length} published</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-4">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-xl p-6 ${
                testimonial.is_published
                  ? "bg-midnight-900/50 border-midnight-800/50"
                  : "bg-midnight-900/30 border-midnight-800/30 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white">{testimonial.name}</h3>
                  {testimonial.company && <p className="text-sm text-midnight-400">{testimonial.company}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFeatured(testimonial.id, testimonial.is_featured)}
                    className={`p-2 rounded-lg transition-colors ${
                      testimonial.is_featured
                        ? "bg-gold-500/10 text-gold-400"
                        : "text-midnight-500 hover:bg-midnight-800"
                    }`}
                    title={testimonial.is_featured ? "Featured" : "Mark as featured"}
                  >
                    <Award className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => togglePublished(testimonial.id, testimonial.is_published)}
                    className={`p-2 rounded-lg transition-colors ${
                      testimonial.is_published
                        ? "text-green-400 hover:bg-green-500/10"
                        : "text-gray-400 hover:bg-gray-500/10"
                    }`}
                  >
                    {testimonial.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating ? "fill-gold-400 text-gold-400" : "text-midnight-700"
                    }`}
                  />
                ))}
              </div>
              <p className="text-midnight-300 text-sm leading-relaxed">{testimonial.content}</p>
              {testimonial.service_type && (
                <div className="mt-3 pt-3 border-t border-midnight-800/50">
                  <span className="px-2 py-1 rounded bg-midnight-800/50 text-midnight-400 text-xs">
                    {testimonial.service_type}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
