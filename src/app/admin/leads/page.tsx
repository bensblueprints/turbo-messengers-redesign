"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Building,
  UserCheck,
  Loader2,
  ArrowLeft,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Lead {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  service_type?: string;
  message?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  source: string;
  created_at: string;
  updated_at: string;
  notes?: string;
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: "bg-blue-500/10", text: "text-blue-400", label: "New" },
  contacted: { bg: "bg-purple-500/10", text: "text-purple-400", label: "Contacted" },
  qualified: { bg: "bg-green-500/10", text: "text-green-400", label: "Qualified" },
  converted: { bg: "bg-gold-500/10", text: "text-gold-400", label: "Converted" },
  closed: { bg: "bg-gray-500/10", text: "text-gray-400", label: "Closed" },
};

export default function LeadsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service_type: "",
    message: "",
    source: "website",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      const userRole = (session?.user as { role?: string })?.role;
      if (userRole !== "admin") {
        router.push("/admin/login");
      } else {
        fetchLeads();
      }
    }
  }, [status, session, router]);

  const fetchLeads = async () => {
    try {
      const response = await fetch("/api/admin/leads");
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create lead");
      }

      setSuccess("Lead created successfully!");
      setNewLead({
        name: "",
        email: "",
        phone: "",
        company: "",
        service_type: "",
        message: "",
        source: "website",
      });
      fetchLeads();
      setTimeout(() => {
        setShowAddModal(false);
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateLeadStatus = async (leadId: number, newStatus: string) => {
    try {
      const response = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });

      if (response.ok) {
        setLeads(leads.map((l) => (l.id === leadId ? { ...l, status: newStatus as Lead["status"] } : l)));
      }
    } catch (error) {
      console.error("Error updating lead status:", error);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    converted: leads.filter((l) => l.status === "converted").length,
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-midnight-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-midnight-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          Loading leads...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-midnight-950">
      <header className="sticky top-0 z-50 bg-midnight-950/90 backdrop-blur-md border-b border-midnight-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="p-2 rounded-lg text-midnight-400 hover:text-electric-400 hover:bg-electric-500/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-display font-bold text-white">Leads Management</h1>
                <p className="text-sm text-midnight-400">{stats.total} total leads</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-lg bg-electric-500/10 text-electric-400 border border-electric-500/30 font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Lead
            </motion.button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total", value: stats.total, icon: Users, color: "text-white" },
            { label: "New", value: stats.new, icon: Clock, color: "text-blue-400" },
            { label: "Contacted", value: stats.contacted, icon: Phone, color: "text-purple-400" },
            { label: "Qualified", value: stats.qualified, icon: CheckCircle, color: "text-green-400" },
            { label: "Converted", value: stats.converted, icon: UserCheck, color: "text-gold-400" },
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or company..."
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
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-midnight-900/50 border border-midnight-800/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-midnight-800/50">
                  <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">Service</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">Source</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-midnight-400">Created</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-midnight-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => {
                  const status = statusColors[lead.status] || statusColors.new;
                  return (
                    <tr
                      key={lead.id}
                      className="border-b border-midnight-800/30 hover:bg-midnight-800/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-white font-medium">{lead.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {lead.email && (
                            <div className="flex items-center gap-2 text-midnight-300 text-sm">
                              <Mail className="w-3 h-3" />
                              {lead.email}
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center gap-2 text-midnight-300 text-sm">
                              <Phone className="w-3 h-3" />
                              {lead.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-midnight-300">{lead.company || "-"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-midnight-400 text-sm">{lead.service_type || "-"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full bg-midnight-800/50 text-midnight-300 text-xs">
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium ${status.bg} ${status.text} border-0 cursor-pointer`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="converted">Converted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-midnight-400 text-sm">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/leads/${lead.id}`}
                            className="p-2 rounded-lg text-midnight-400 hover:text-electric-400 hover:bg-electric-500/10 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-midnight-900 border border-midnight-800/50 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-white">Add New Lead</h2>
              <button
                onClick={() => setShowAddModal(false)}
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

            <form onSubmit={handleAddLead} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-midnight-300 mb-2">Name *</label>
                <input
                  type="text"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-electric-500/50"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight-300 mb-2">Email</label>
                <input
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-electric-500/50"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-electric-500/50"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight-300 mb-2">Company</label>
                <input
                  type="text"
                  value={newLead.company}
                  onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-electric-500/50"
                  placeholder="Acme Law Firm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight-300 mb-2">Service Type</label>
                <select
                  value={newLead.service_type}
                  onChange={(e) => setNewLead({ ...newLead, service_type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white focus:outline-none focus:border-electric-500/50"
                >
                  <option value="">Select service...</option>
                  <option value="process_service">Process Service</option>
                  <option value="court_filing">Court Filing</option>
                  <option value="small_claims">Small Claims</option>
                  <option value="document_retrieval">Document Retrieval</option>
                  <option value="skip_tracing">Skip Tracing</option>
                  <option value="notary">Notary Services</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight-300 mb-2">Message</label>
                <textarea
                  value={newLead.message}
                  onChange={(e) => setNewLead({ ...newLead, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-electric-500/50 resize-none"
                  placeholder="Additional notes..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-electric-400 to-electric-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create Lead
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </main>
  );
}
