"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  Shield,
  ChevronRight,
  Search,
  Filter,
  Eye,
  Edit,
  Loader2,
  RefreshCw,
  Calendar,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, type Job, type Profile } from "@/lib/supabase";

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-yellow-500/10", text: "text-yellow-400", label: "Pending" },
  in_progress: { bg: "bg-blue-500/10", text: "text-blue-400", label: "In Progress" },
  completed: { bg: "bg-green-500/10", text: "text-green-400", label: "Completed" },
  on_hold: { bg: "bg-orange-500/10", text: "text-orange-400", label: "On Hold" },
};

const jobTypeLabels: Record<string, string> = {
  process_service: "Process Service",
  court_filing: "Court Filing",
  small_claims: "Small Claims",
  document_retrieval: "Doc Retrieval",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [clients, setClients] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "clients">("overview");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push("/admin/login");
      return;
    }

    // Get profile and verify admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "admin") {
      router.push("/admin/login");
      return;
    }

    setUser(profile);

    // Get all jobs
    const { data: jobsData } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (jobsData) setJobs(jobsData);

    // Get all clients
    const { data: clientsData } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "client")
      .order("created_at", { ascending: false });

    if (clientsData) setClients(clientsData);

    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const updateJobStatus = async (jobId: string, newStatus: string) => {
    await supabase
      .from("jobs")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", jobId);

    setJobs(jobs.map((j) => (j.id === jobId ? { ...j, status: newStatus as Job["status"] } : j)));
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.defendant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.case_number?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalJobs: jobs.length,
    pending: jobs.filter((j) => j.status === "pending").length,
    inProgress: jobs.filter((j) => j.status === "in_progress").length,
    completed: jobs.filter((j) => j.status === "completed").length,
    totalClients: clients.length,
    todayJobs: jobs.filter((j) => new Date(j.created_at).toDateString() === new Date().toDateString()).length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-midnight-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-midnight-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          Loading admin dashboard...
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-400 to-electric-600 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-display font-bold text-white">
                    Admin Portal
                  </span>
                  <p className="text-xs text-midnight-400">Turbo Messengers</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={checkAuth}
                className="p-2 rounded-lg text-midnight-400 hover:text-electric-400 hover:bg-electric-500/10 transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-midnight-800/50 border border-midnight-700/50">
                <Shield className="w-4 h-4 text-electric-400" />
                <span className="text-sm text-midnight-300">{user?.full_name || "Admin"}</span>
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
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "jobs", label: "All Jobs", icon: FileText },
            { id: "clients", label: "Clients", icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? "bg-electric-500/10 text-electric-400 border border-electric-500/30"
                  : "text-midnight-400 hover:text-midnight-200"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {[
                { label: "Total Jobs", value: stats.totalJobs, icon: FileText, color: "text-white" },
                { label: "Today", value: stats.todayJobs, icon: Calendar, color: "text-electric-400" },
                { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-400" },
                { label: "In Progress", value: stats.inProgress, icon: TrendingUp, color: "text-blue-400" },
                { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-green-400" },
                { label: "Clients", value: stats.totalClients, icon: Users, color: "text-purple-400" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-midnight-900/50 border border-midnight-800/50 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-midnight-400 text-xs">{stat.label}</span>
                  </div>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Jobs */}
            <div className="bg-midnight-900/50 border border-midnight-800/50 rounded-xl">
              <div className="px-6 py-4 border-b border-midnight-800/50 flex justify-between items-center">
                <h3 className="font-semibold text-white">Recent Jobs</h3>
                <button
                  onClick={() => setActiveTab("jobs")}
                  className="text-sm text-electric-400 hover:text-electric-300 flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="divide-y divide-midnight-800/30">
                {jobs.slice(0, 5).map((job) => {
                  const status = statusColors[job.status] || statusColors.pending;
                  return (
                    <div
                      key={job.id}
                      className="px-6 py-4 flex items-center justify-between hover:bg-midnight-800/20 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-midnight-800/50 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-gold-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{job.defendant_name || "Unknown"}</p>
                          <p className="text-sm text-midnight-400">
                            {jobTypeLabels[job.job_type]} • {job.case_number || "No case #"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                        <select
                          value={job.status}
                          onChange={(e) => updateJobStatus(job.id, e.target.value)}
                          className="px-3 py-1 rounded-lg bg-midnight-800/50 border border-midnight-700/50 text-sm text-midnight-300"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="on_hold">On Hold</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by defendant or case number..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-electric-500/50"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-12 pr-8 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                </select>
              </div>
            </div>

            {/* Jobs Table */}
            <div className="bg-midnight-900/50 border border-midnight-800/50 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-midnight-800/50">
                      <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">Defendant</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">Case #</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">Created</th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-midnight-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map((job) => {
                      const status = statusColors[job.status] || statusColors.pending;
                      return (
                        <tr
                          key={job.id}
                          className="border-b border-midnight-800/30 hover:bg-midnight-800/20 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">
                                {jobTypeLabels[job.job_type]}
                              </span>
                              {job.rush_service && (
                                <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 text-xs">
                                  RUSH
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-white">{job.defendant_name || "-"}</p>
                              <p className="text-midnight-500 text-sm truncate max-w-[200px]">
                                {job.defendant_address}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-midnight-300 font-mono text-sm">
                              {job.case_number || "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={job.status}
                              onChange={(e) => updateJobStatus(job.id, e.target.value)}
                              className={`px-3 py-1 rounded-lg text-xs font-medium ${status.bg} ${status.text} border-0 cursor-pointer`}
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="on_hold">On Hold</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-midnight-400 text-sm">
                              {new Date(job.created_at).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 rounded-lg text-midnight-400 hover:text-electric-400 hover:bg-electric-500/10 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 rounded-lg text-midnight-400 hover:text-gold-400 hover:bg-gold-500/10 transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Clients Tab */}
        {activeTab === "clients" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-midnight-900/50 border border-midnight-800/50 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-midnight-800/50">
                      <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">Company</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">Joined</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => {
                      const clientJobs = jobs.filter((j) => j.client_id === client.id);
                      return (
                        <tr
                          key={client.id}
                          className="border-b border-midnight-800/30 hover:bg-midnight-800/20 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="text-white font-medium">{client.full_name}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-midnight-300">{client.company_name || "-"}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-midnight-300">{client.email}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-midnight-400">{client.phone || "-"}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-midnight-400 text-sm">
                              {new Date(client.created_at).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-electric-400 font-medium">{clientJobs.length}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
