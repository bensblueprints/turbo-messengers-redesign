"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Loader2, ArrowLeft, Save, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface SiteSetting {
  id: number;
  setting_key: string;
  setting_value?: string;
  setting_type: string;
  description?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      const userRole = (session?.user as { role?: string })?.role;
      if (userRole !== "admin") {
        router.push("/admin/login");
      } else {
        fetchSettings();
      }
    }
  }, [status, session, router]);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings || []);
        const initialData: Record<string, string> = {};
        data.settings.forEach((s: SiteSetting) => {
          initialData[s.setting_key] = s.setting_value || "";
        });
        setFormData(initialData);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      for (const [key, value] of Object.entries(formData)) {
        await fetch("/api/admin/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ setting_key: key, setting_value: value }),
        });
      }
      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to save settings");
    } finally {
      setIsSaving(false);
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
                <h1 className="text-xl font-display font-bold text-white">Site Settings</h1>
                <p className="text-sm text-midnight-400">Configure global settings</p>
              </div>
            </div>
            <motion.button
              onClick={handleSave}
              disabled={isSaving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg bg-electric-500/10 text-electric-400 border border-electric-500/30 font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </motion.button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400">{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        <div className="bg-midnight-900/50 border border-midnight-800/50 rounded-xl p-6 space-y-6">
          {settings.map((setting) => (
            <div key={setting.id}>
              <label className="block text-sm font-medium text-midnight-300 mb-2">
                {setting.setting_key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </label>
              {setting.description && (
                <p className="text-xs text-midnight-500 mb-2">{setting.description}</p>
              )}
              <input
                type={setting.setting_type === "number" ? "number" : "text"}
                value={formData[setting.setting_key] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [setting.setting_key]: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-electric-500/50"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
