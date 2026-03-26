"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Zap, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check user role and redirect accordingly
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profile?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company_name: companyName,
            phone: phone,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        await supabase.from("profiles").insert({
          id: data.user.id,
          email,
          full_name: fullName,
          company_name: companyName,
          phone,
          role: "client",
        });

        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-midnight-950 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-16 xl:px-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full mx-auto"
        >
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-midnight-400 hover:text-gold-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-midnight-950" />
            </div>
            <div>
              <span className="text-xl font-display font-bold tracking-tight text-white">
                Turbo<span className="text-gold-400">Messengers</span>
              </span>
              <p className="text-xs text-midnight-400">Client Portal</p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h1>
          <p className="text-midnight-400 mb-8">
            {isSignUp
              ? "Sign up to submit and track your process service requests"
              : "Log in to your client portal to manage your orders"}
          </p>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-5">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-medium text-midnight-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all duration-300"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-midnight-300 mb-2">
                    Company / Law Firm Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all duration-300"
                    placeholder="Smith & Associates"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-midnight-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all duration-300"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-midnight-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all duration-300"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all duration-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-midnight-500 hover:text-gold-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-gold-400 hover:text-gold-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-midnight-950 font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-gold-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </>
              ) : (
                <>{isSignUp ? "Create Account" : "Sign In"}</>
              )}
            </motion.button>
          </form>

          {/* Toggle Sign Up / Login */}
          <p className="mt-8 text-center text-midnight-400">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-gold-400 hover:text-gold-300 transition-colors font-medium"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>

          {/* Admin Login Link */}
          <p className="mt-4 text-center">
            <Link
              href="/admin/login"
              className="text-sm text-midnight-500 hover:text-midnight-400 transition-colors"
            >
              Staff Login
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Image/Branding */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/downtown-la-home-slider.jpg"
            alt="Downtown Los Angeles"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-midnight-950 via-midnight-950/80 to-midnight-950/60" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Track Your Cases in Real-Time
            </h2>
            <p className="text-midnight-300 leading-relaxed mb-8">
              Our client portal gives you instant access to your process service orders,
              document uploads, proof of service downloads, and complete status tracking.
            </p>

            <div className="space-y-4">
              {[
                "Submit orders 24/7 online",
                "Track service attempts in real-time",
                "Download proof of service instantly",
                "Manage multiple cases at once",
              ].map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-gold-400" />
                  <span className="text-midnight-200">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
