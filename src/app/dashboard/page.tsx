"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  User,
  ChevronRight,
  Search,
  Filter,
  Download,
  Eye,
  Zap,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, type Job, type Profile } from "@/lib/supabase";

const statusColors: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  pending: { bg: "bg-yellow-500/10", text: "text-yellow-400", icon: Clock },
  in_progress: { bg: "bg-blue-500/10", text: "text-blue-400", icon: Loader2 },
  completed: { bg: "bg-green-500/10", text: "text-green-400", icon: CheckCircle },
  on_hold: { bg: "bg-orange-500/10", text: "text-orange-400", icon: AlertCircle },
};

const jobTypeLabels: Record<string, string> = {
  process_service: "Process Service",
  court_filing: "Court Filing",
  small_claims: "Small Claims",
  document_retrieval: "Document Retrieval",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    // Get profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profile) {
      setUser(profile);
    }

    // Get jobs
    const { data: jobsData } = await supabase
      .from("jobs")
      .select("*")
      .eq("client_id", session.user.id)
      .order("created_at", { ascending: false });

    if (jobsData) {
      setJobs(jobsData);
    }

    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.defendant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.case_number?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: jobs.length,
    pending: jobs.filter((j) => j.status === "pending").length,
    inProgress: jobs.filter((j) => j.status === "in_progress").length,
    completed: jobs.filter((j) => j.status === "completed").length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-midnight-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-midnight-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-midnight-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-midnight-950/90 backdrop-blur-md border-b border-midnight-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-midnight-950" />
                </div>
                <span className="text-xl font-display font-bold text-white hidden sm:block">
                  Turbo<span className="text-gold-400">Messengers</span>
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-midnight-800/50 border border-midnight-700/50">
                <User className="w-4 h-4 text-midnight-400" />
                <span className="text-sm text-midnight-300">{user?.full_name || user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-midnight-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Welcome back, {user?.full_name?.split(" ")[0] || "Client"}
          </h1>
          <p className="text-midnight-400">
            Manage your process service requests and track their status.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Orders", value: stats.total, color: "text-white" },
            { label: "Pending", value: stats.pending, color: "text-yellow-400" },
            { label: "In Progress", value: stats.inProgress, color: "text-blue-400" },
            { label: "Completed", value: stats.completed, color: "text-green-400" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="bg-midnight-900/50 border border-midnight-800/50 rounded-xl p-4"
            >
              <p className="text-midnight-400 text-sm mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by defendant or case number..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50 transition-all"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-12 pr-8 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white appearance-none cursor-pointer focus:outline-none focus:border-gold-500/50 transition-all"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>

          <Link href="/dashboard/new-order">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-midnight-950 font-semibold flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Order
            </motion.button>
          </Link>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-midnight-900/50 border border-midnight-800/50 rounded-2xl overflow-hidden"
        >
          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-midnight-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No orders found</h3>
              <p className="text-midnight-400 mb-6">
                {jobs.length === 0
                  ? "You haven't submitted any orders yet."
                  : "No orders match your search criteria."}
              </p>
              {jobs.length === 0 && (
                <Link href="/dashboard/new-order">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-midnight-950 font-semibold inline-flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Submit Your First Order
                  </motion.button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-midnight-800/50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">
                      Defendant
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400 hidden md:table-cell">
                      Case #
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400 hidden lg:table-cell">
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-midnight-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => {
                    const status = statusColors[job.status] || statusColors.pending;
                    const StatusIcon = status.icon;

                    return (
                      <tr
                        key={job.id}
                        className="border-b border-midnight-800/30 hover:bg-midnight-800/20 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="text-white font-medium">
                            {jobTypeLabels[job.job_type] || job.job_type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-midnight-300">{job.defendant_name || "-"}</span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="text-midnight-400 font-mono text-sm">
                            {job.case_number || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {job.status.replace("_", " ").toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span className="text-midnight-400 text-sm">
                            {new Date(job.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {job.proof_of_service_url && (
                              <a
                                href={job.proof_of_service_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg text-green-400 hover:bg-green-500/10 transition-colors"
                                title="Download Proof of Service"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            )}
                            <Link href={`/dashboard/order/${job.id}`}>
                              <button className="p-2 rounded-lg text-midnight-400 hover:text-gold-400 hover:bg-gold-500/10 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                            </Link>
                            <Link href={`/dashboard/order/${job.id}`}>
                              <button className="p-2 rounded-lg text-midnight-400 hover:text-gold-400 hover:bg-gold-500/10 transition-colors">
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
