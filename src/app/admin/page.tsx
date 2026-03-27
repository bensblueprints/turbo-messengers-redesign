"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
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
  Plus,
  X,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Scale,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

interface Job {
  id: number;
  client_id: number;
  job_type: string;
  status: "pending" | "in_progress" | "completed" | "on_hold";
  defendant_name: string | null;
  defendant_address: string | null;
  case_number: string | null;
  court_name: string | null;
  notes: string | null;
  rush_service: boolean;
  proof_of_service_url: string | null;
  created_at: string;
  updated_at: string;
}

interface Client {
  id: number;
  email: string;
  full_name: string;
  company_name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
}

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

const serviceTypes = [
  { id: "process_service", label: "Process Service", price: 95 },
  { id: "court_filing", label: "Court Filing", price: 75 },
  { id: "small_claims", label: "Small Claims Prep", price: 125 },
  { id: "document_retrieval", label: "Document Retrieval", price: 65 },
];

const counties = [
  "Los Angeles",
  "Ventura",
  "San Bernardino",
  "Riverside",
  "Orange",
  "San Diego",
];

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "clients">("overview");

  // Modal states
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [selectedClientForOrder, setSelectedClientForOrder] = useState<Client | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // New client form
  const [newClient, setNewClient] = useState({
    email: "",
    password: "",
    full_name: "",
    company_name: "",
    phone: "",
  });

  // New order form
  const [newOrder, setNewOrder] = useState({
    client_id: 0,
    job_type: "",
    defendant_name: "",
    defendant_address: "",
    case_number: "",
    court_name: "",
    notes: "",
    rush_service: false,
    county: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      const userRole = (session?.user as { role?: string })?.role;
      if (userRole !== "admin") {
        router.push("/admin/login");
      } else {
        fetchData();
      }
    }
  }, [status, session, router]);

  const fetchData = async () => {
    try {
      const [jobsRes, clientsRes] = await Promise.all([
        fetch("/api/admin/jobs"),
        fetch("/api/admin/clients"),
      ]);

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData.jobs || []);
      }

      if (clientsRes.ok) {
        const clientsData = await clientsRes.json();
        setClients(clientsData.clients || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const updateJobStatus = async (jobId: number, newStatus: string) => {
    try {
      const response = await fetch("/api/admin/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, status: newStatus }),
      });

      if (response.ok) {
        setJobs(jobs.map((j) => (j.id === jobId ? { ...j, status: newStatus as Job["status"] } : j)));
      }
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create client");
      }

      setSuccess("Client created successfully!");
      setNewClient({ email: "", password: "", full_name: "", company_name: "", phone: "" });
      fetchData();
      setTimeout(() => {
        setShowAddClientModal(false);
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create client");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newOrder,
          client_id: selectedClientForOrder?.id || newOrder.client_id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      setSuccess("Order created successfully!");
      setNewOrder({
        client_id: 0,
        job_type: "",
        defendant_name: "",
        defendant_address: "",
        case_number: "",
        court_name: "",
        notes: "",
        rush_service: false,
        county: "",
      });
      setSelectedClientForOrder(null);
      fetchData();
      setTimeout(() => {
        setShowAddOrderModal(false);
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openOrderModalForClient = (client: Client) => {
    setSelectedClientForOrder(client);
    setNewOrder({ ...newOrder, client_id: client.id });
    setShowAddOrderModal(true);
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

  if (status === "loading" || isLoading) {
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
                onClick={fetchData}
                className="p-2 rounded-lg text-midnight-400 hover:text-electric-400 hover:bg-electric-500/10 transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-midnight-800/50 border border-midnight-700/50">
                <Shield className="w-4 h-4 text-electric-400" />
                <span className="text-sm text-midnight-300">{session?.user?.name || "Admin"}</span>
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
        <div className="flex flex-wrap gap-2 mb-8">
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

          {/* Quick Actions */}
          <div className="flex gap-2 ml-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddClientModal(true)}
              className="px-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Client
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddOrderModal(true)}
              className="px-4 py-2 rounded-lg bg-gold-500/10 text-gold-400 border border-gold-500/30 font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Order
            </motion.button>
          </div>
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
                            {jobTypeLabels[job.job_type]} - {job.case_number || "No case #"}
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
                      <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">Client</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">Created</th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-midnight-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map((job) => {
                      const status = statusColors[job.status] || statusColors.pending;
                      const client = clients.find(c => c.id === job.client_id);
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
                            <span className="text-midnight-300 text-sm">
                              {client?.full_name || "-"}
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
                      <th className="px-6 py-4 text-right text-sm font-medium text-midnight-400">Actions</th>
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
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openOrderModalForClient(client)}
                                className="px-3 py-1.5 rounded-lg bg-gold-500/10 text-gold-400 text-sm font-medium flex items-center gap-1 hover:bg-gold-500/20 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                                Add Order
                              </motion.button>
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
      </div>

      {/* Add Client Modal */}
      <AnimatePresence>
        {showAddClientModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddClientModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-midnight-900 border border-midnight-800/50 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-white">Add New Client</h2>
                <button
                  onClick={() => setShowAddClientModal(false)}
                  className="p-2 rounded-lg text-midnight-400 hover:text-white hover:bg-midnight-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">{success}</span>
                </div>
              )}

              <form onSubmit={handleAddClient} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-midnight-300 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newClient.full_name}
                    onChange={(e) => setNewClient({ ...newClient, full_name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-electric-500/50"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-midnight-300 mb-2">
                    <Building className="w-4 h-4 inline mr-2" />
                    Company / Law Firm
                  </label>
                  <input
                    type="text"
                    value={newClient.company_name}
                    onChange={(e) => setNewClient({ ...newClient, company_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-electric-500/50"
                    placeholder="Smith & Associates"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-midnight-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-electric-500/50"
                    placeholder="john@lawfirm.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-midnight-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-electric-500/50"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-midnight-300 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={newClient.password}
                    onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-electric-500/50"
                    placeholder="Min 8 characters"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Create Client
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Order Modal */}
      <AnimatePresence>
        {showAddOrderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowAddOrderModal(false);
              setSelectedClientForOrder(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-midnight-900 border border-midnight-800/50 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-display font-bold text-white">Create New Order</h2>
                  {selectedClientForOrder && (
                    <p className="text-midnight-400 text-sm mt-1">
                      For: {selectedClientForOrder.full_name} ({selectedClientForOrder.company_name || selectedClientForOrder.email})
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowAddOrderModal(false);
                    setSelectedClientForOrder(null);
                  }}
                  className="p-2 rounded-lg text-midnight-400 hover:text-white hover:bg-midnight-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">{success}</span>
                </div>
              )}

              <form onSubmit={handleAddOrder} className="space-y-4">
                {/* Client Selection (if not pre-selected) */}
                {!selectedClientForOrder && (
                  <div>
                    <label className="block text-sm font-medium text-midnight-300 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Select Client *
                    </label>
                    <select
                      value={newOrder.client_id}
                      onChange={(e) => setNewOrder({ ...newOrder, client_id: parseInt(e.target.value) })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white focus:outline-none focus:border-gold-500/50"
                    >
                      <option value="">Select a client...</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.full_name} - {client.company_name || client.email}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-midnight-300 mb-2">
                    Service Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {serviceTypes.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setNewOrder({ ...newOrder, job_type: service.id })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          newOrder.job_type === service.id
                            ? "bg-gold-500/10 border-gold-500/50"
                            : "bg-midnight-800/50 border-midnight-700/50 hover:border-midnight-600"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium text-sm">{service.label}</span>
                          <span className="text-gold-400 font-bold text-sm">${service.price}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rush Service */}
                <div
                  onClick={() => setNewOrder({ ...newOrder, rush_service: !newOrder.rush_service })}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    newOrder.rush_service
                      ? "bg-orange-500/10 border-orange-500/50"
                      : "bg-midnight-800/50 border-midnight-700/50 hover:border-midnight-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${newOrder.rush_service ? "text-orange-400" : "text-midnight-500"}`} />
                      <span className="text-white text-sm">Rush Service (+$50)</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      newOrder.rush_service ? "bg-orange-500 border-orange-500" : "border-midnight-600"
                    }`}>
                      {newOrder.rush_service && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </div>

                {/* County */}
                <div>
                  <label className="block text-sm font-medium text-midnight-300 mb-2">County *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {counties.map((county) => (
                      <button
                        key={county}
                        type="button"
                        onClick={() => setNewOrder({ ...newOrder, county })}
                        className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                          newOrder.county === county
                            ? "bg-gold-500/10 border-gold-500/50 text-gold-400"
                            : "bg-midnight-800/50 border-midnight-700/50 text-midnight-300 hover:border-midnight-600"
                        }`}
                      >
                        {county}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-midnight-300 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Defendant Name *
                    </label>
                    <input
                      type="text"
                      value={newOrder.defendant_name}
                      onChange={(e) => setNewOrder({ ...newOrder, defendant_name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-midnight-300 mb-2">
                      <Scale className="w-4 h-4 inline mr-2" />
                      Case Number
                    </label>
                    <input
                      type="text"
                      value={newOrder.case_number}
                      onChange={(e) => setNewOrder({ ...newOrder, case_number: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50"
                      placeholder="23CV12345"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-midnight-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Service Address *
                  </label>
                  <input
                    type="text"
                    value={newOrder.defendant_address}
                    onChange={(e) => setNewOrder({ ...newOrder, defendant_address: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50"
                    placeholder="123 Main St, Los Angeles, CA 90001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-midnight-300 mb-2">
                    Court Name
                  </label>
                  <input
                    type="text"
                    value={newOrder.court_name}
                    onChange={(e) => setNewOrder({ ...newOrder, court_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50"
                    placeholder="Los Angeles Superior Court"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-midnight-300 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    value={newOrder.notes}
                    onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50 resize-none"
                    placeholder="Any special instructions..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting || !newOrder.job_type || !newOrder.defendant_name || !newOrder.defendant_address || !newOrder.county || (!selectedClientForOrder && !newOrder.client_id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-midnight-950 font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Create Order
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
