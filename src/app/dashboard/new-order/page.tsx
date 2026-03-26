"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  FileText,
  MapPin,
  User,
  Scale,
  CheckCircle,
  Loader2,
  Zap,
  X,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const serviceTypes = [
  { id: "process_service", label: "Process Service", description: "Serve legal documents", price: 95 },
  { id: "court_filing", label: "Court Filing", description: "File documents with the court", price: 75 },
  { id: "small_claims", label: "Small Claims Prep", description: "Prepare small claims documents", price: 125 },
  { id: "document_retrieval", label: "Document Retrieval", description: "Retrieve court documents", price: 65 },
];

const counties = [
  "Los Angeles",
  "Ventura",
  "San Bernardino",
  "Riverside",
  "Orange",
  "San Diego",
];

export default function NewOrderPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    job_type: "",
    rush_service: false,
    county: "",
    defendant_name: "",
    defendant_address: "",
    defendant_city: "",
    defendant_state: "CA",
    defendant_zip: "",
    case_number: "",
    court_name: "",
    notes: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const calculatePrice = () => {
    const serviceType = serviceTypes.find((s) => s.id === formData.job_type);
    let price = serviceType?.price || 0;
    if (formData.rush_service) price += 50;
    return price;
  };

  const handleSubmit = async () => {
    if (!session?.user) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_type: formData.job_type,
          defendant_name: formData.defendant_name,
          defendant_address: `${formData.defendant_address}, ${formData.defendant_city}, ${formData.defendant_state} ${formData.defendant_zip}`,
          case_number: formData.case_number,
          court_name: formData.court_name,
          notes: formData.notes,
          rush_service: formData.rush_service,
        }),
      });

      if (!response.ok) throw new Error("Failed to create order");

      const data = await response.json();
      router.push(`/dashboard`);
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
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
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 text-midnight-400 hover:text-gold-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-midnight-950" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= s
                      ? "bg-gradient-to-br from-gold-400 to-gold-600 text-midnight-950"
                      : "bg-midnight-800 text-midnight-500"
                  }`}
                >
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 rounded ${
                      step > s ? "bg-gold-500" : "bg-midnight-800"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <p className="text-midnight-400 text-sm">
              Step {step} of 3:{" "}
              {step === 1 ? "Service Type" : step === 2 ? "Case Details" : "Review & Submit"}
            </p>
          </div>
        </div>

        {/* Step 1: Service Type */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                Select Service Type
              </h2>
              <p className="text-midnight-400">
                Choose the type of service you need.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {serviceTypes.map((service) => (
                <motion.button
                  key={service.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, job_type: service.id })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-xl border text-left transition-all ${
                    formData.job_type === service.id
                      ? "bg-gold-500/10 border-gold-500/50"
                      : "bg-midnight-900/50 border-midnight-800/50 hover:border-midnight-700"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white">{service.label}</h3>
                    <span className="text-gold-400 font-bold">${service.price}</span>
                  </div>
                  <p className="text-midnight-400 text-sm">{service.description}</p>
                </motion.button>
              ))}
            </div>

            {/* Rush Service */}
            <div
              onClick={() => setFormData({ ...formData, rush_service: !formData.rush_service })}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                formData.rush_service
                  ? "bg-orange-500/10 border-orange-500/50"
                  : "bg-midnight-900/50 border-midnight-800/50 hover:border-midnight-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className={`w-5 h-5 ${formData.rush_service ? "text-orange-400" : "text-midnight-500"}`} />
                  <div>
                    <h3 className="font-medium text-white">Rush Service</h3>
                    <p className="text-midnight-400 text-sm">Same-day or next-day service (+$50)</p>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    formData.rush_service
                      ? "bg-orange-500 border-orange-500"
                      : "border-midnight-600"
                  }`}
                >
                  {formData.rush_service && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
              </div>
            </div>

            {/* County Selection */}
            <div>
              <label className="block text-sm font-medium text-midnight-300 mb-3">
                Select County
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {counties.map((county) => (
                  <button
                    key={county}
                    type="button"
                    onClick={() => setFormData({ ...formData, county })}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      formData.county === county
                        ? "bg-gold-500/10 border-gold-500/50 text-gold-400"
                        : "bg-midnight-900/50 border-midnight-800/50 text-midnight-300 hover:border-midnight-700"
                    }`}
                  >
                    <MapPin className="w-4 h-4 inline mr-2" />
                    {county}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Preview */}
            {formData.job_type && (
              <div className="p-4 rounded-xl bg-midnight-800/30 border border-midnight-700/50">
                <div className="flex justify-between items-center">
                  <span className="text-midnight-300">Estimated Price:</span>
                  <span className="text-2xl font-bold text-gold-400">
                    ${calculatePrice()}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <motion.button
                type="button"
                onClick={() => setStep(2)}
                disabled={!formData.job_type || !formData.county}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-midnight-950 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Case Details */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                Case & Defendant Details
              </h2>
              <p className="text-midnight-400">
                Provide information about the case and person being served.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-midnight-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Defendant Name *
                </label>
                <input
                  type="text"
                  value={formData.defendant_name}
                  onChange={(e) => setFormData({ ...formData, defendant_name: e.target.value })}
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
                  value={formData.case_number}
                  onChange={(e) => setFormData({ ...formData, case_number: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50"
                  placeholder="e.g., 23CV12345"
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
                value={formData.defendant_address}
                onChange={(e) => setFormData({ ...formData, defendant_address: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50"
                placeholder="123 Main Street, Apt 4B"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-midnight-300 mb-2">City *</label>
                <input
                  type="text"
                  value={formData.defendant_city}
                  onChange={(e) => setFormData({ ...formData, defendant_city: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50"
                  placeholder="Los Angeles"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-midnight-300 mb-2">State</label>
                <input
                  type="text"
                  value={formData.defendant_state}
                  onChange={(e) => setFormData({ ...formData, defendant_state: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50"
                  placeholder="CA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-midnight-300 mb-2">ZIP *</label>
                <input
                  type="text"
                  value={formData.defendant_zip}
                  onChange={(e) => setFormData({ ...formData, defendant_zip: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50"
                  placeholder="90001"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight-300 mb-2">
                Court Name
              </label>
              <input
                type="text"
                value={formData.court_name}
                onChange={(e) => setFormData({ ...formData, court_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50"
                placeholder="Los Angeles Superior Court"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight-300 mb-2">
                Special Instructions
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50 resize-none"
                placeholder="Any special instructions for the process server..."
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-midnight-300 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Upload Documents
              </label>
              <div className="border-2 border-dashed border-midnight-700/50 rounded-xl p-6 text-center hover:border-gold-500/30 transition-colors">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-10 h-10 text-midnight-500 mx-auto mb-3" />
                  <p className="text-midnight-300">
                    Drop files here or <span className="text-gold-400">browse</span>
                  </p>
                  <p className="text-midnight-500 text-sm mt-1">PDF, DOC, DOCX up to 10MB</p>
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-midnight-800/30 border border-midnight-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gold-400" />
                        <span className="text-midnight-300 text-sm">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 text-midnight-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <motion.button
                type="button"
                onClick={() => setStep(1)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-xl border border-midnight-700 text-midnight-300 font-medium flex items-center gap-2 hover:border-midnight-600"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setStep(3)}
                disabled={!formData.defendant_name || !formData.defendant_address || !formData.defendant_city || !formData.defendant_zip}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-midnight-950 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                Review Your Order
              </h2>
              <p className="text-midnight-400">
                Please review the details before submitting.
              </p>
            </div>

            <div className="bg-midnight-900/50 border border-midnight-800/50 rounded-xl p-6 space-y-4">
              <div className="flex justify-between pb-4 border-b border-midnight-800/50">
                <span className="text-midnight-400">Service Type</span>
                <span className="text-white font-medium">
                  {serviceTypes.find((s) => s.id === formData.job_type)?.label}
                  {formData.rush_service && " (Rush)"}
                </span>
              </div>
              <div className="flex justify-between pb-4 border-b border-midnight-800/50">
                <span className="text-midnight-400">County</span>
                <span className="text-white">{formData.county}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-midnight-800/50">
                <span className="text-midnight-400">Defendant</span>
                <span className="text-white">{formData.defendant_name}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-midnight-800/50">
                <span className="text-midnight-400">Address</span>
                <span className="text-white text-right max-w-xs">
                  {formData.defendant_address}, {formData.defendant_city}, {formData.defendant_state} {formData.defendant_zip}
                </span>
              </div>
              {formData.case_number && (
                <div className="flex justify-between pb-4 border-b border-midnight-800/50">
                  <span className="text-midnight-400">Case Number</span>
                  <span className="text-white font-mono">{formData.case_number}</span>
                </div>
              )}
              {uploadedFiles.length > 0 && (
                <div className="flex justify-between pb-4 border-b border-midnight-800/50">
                  <span className="text-midnight-400">Documents</span>
                  <span className="text-white">{uploadedFiles.length} file(s)</span>
                </div>
              )}
              <div className="flex justify-between pt-2">
                <span className="text-lg font-medium text-white">Total</span>
                <span className="text-2xl font-bold text-gold-400">${calculatePrice()}</span>
              </div>
            </div>

            <div className="flex justify-between">
              <motion.button
                type="button"
                onClick={() => setStep(2)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-xl border border-midnight-700 text-midnight-300 font-medium flex items-center gap-2 hover:border-midnight-600"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </motion.button>
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-midnight-950 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Submit Order
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
