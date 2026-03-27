"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  ArrowRight,
  Shield,
  Star,
  FileText,
  Scale,
  Users,
  Briefcase,
} from "lucide-react";

interface ServicePageProps {
  service: {
    name: string;
    slug: string;
    description: string;
    longDescription: string;
    features: string[];
    process: { step: number; title: string; description: string }[];
    faqs: { question: string; answer: string }[];
    icon: "scale" | "file" | "users" | "briefcase";
  };
  county?: {
    name: string;
    slug: string;
    cities: string[];
    courts?: string[];
  };
}

const iconMap = {
  scale: Scale,
  file: FileText,
  users: Users,
  briefcase: Briefcase,
};

export default function ServicePage({ service, county }: ServicePageProps) {
  const Icon = iconMap[service.icon];
  const title = county
    ? `${service.name} in ${county.name}`
    : service.name;
  const subtitle = county
    ? `Professional ${service.name.toLowerCase()} services throughout ${county.name}`
    : `Professional ${service.name.toLowerCase()} services throughout Southern California`;

  return (
    <main className="relative bg-midnight-950 min-h-screen">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-midnight-950/80 backdrop-blur-md border-b border-midnight-800/50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img
              src="/images/logo-nav.png"
              alt="Turbo Messengers - Process Servers"
              className="h-8 sm:h-10 w-auto"
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-midnight-300 hover:text-gold-400 transition-colors hidden sm:flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Client Login
            </Link>
            <a
              href="tel:8187710904"
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">(818) 771-0904</span>
              <span className="sm:hidden">Call</span>
            </a>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gold-500/10 blur-[120px]" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-electric-500/10 blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Breadcrumbs */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 text-sm text-midnight-400 mb-8"
          >
            <Link href="/" className="hover:text-gold-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/services/${service.slug}`}
              className="hover:text-gold-400 transition-colors"
            >
              {service.name}
            </Link>
            {county && (
              <>
                <span>/</span>
                <span className="text-gold-400">{county.name}</span>
              </>
            )}
          </motion.nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-midnight-800/60 border border-midnight-700/50 backdrop-blur-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-midnight-300">
                  Registered & Bonded Since 2009
                </span>
                <Shield className="w-4 h-4 text-gold-400" />
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                <span className="text-white">{title}</span>
              </h1>

              <p className="text-xl text-midnight-300 mb-8 leading-relaxed">
                {subtitle}. Fast, reliable, and professional service with immediate proof of completion.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href="tel:8187710904"
                  className="btn-primary text-lg flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Call (818) 771-0904
                </a>
                <Link
                  href="/#contact"
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  Get a Quote
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="flex flex-wrap gap-4">
                {["Same-Day Service", "24/7 Available", "All Courts"].map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-2 text-sm text-midnight-300"
                  >
                    <CheckCircle className="w-4 h-4 text-gold-500" />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="card-glass p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/10 border border-gold-500/20 flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-gold-400" />
                </div>
                <h2 className="font-display text-2xl font-bold text-white mb-4">
                  Why Choose Turbo Messengers?
                </h2>
                <ul className="space-y-4">
                  {service.features.slice(0, 5).map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span className="text-midnight-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-20 bg-midnight-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              <span className="text-white">Professional </span>
              <span className="text-gradient">{service.name}</span>
            </h2>
            <p className="text-midnight-300 text-lg leading-relaxed">
              {service.longDescription}
            </p>
          </motion.div>

          {/* Process Steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.process.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-glass p-6 relative"
              >
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center font-bold text-midnight-950">
                  {step.step}
                </div>
                <h3 className="font-semibold text-white text-lg mb-2 mt-4">
                  {step.title}
                </h3>
                <p className="text-midnight-400 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas / Cities */}
      {county && county.cities.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                <span className="text-white">Cities We Serve in </span>
                <span className="text-gradient">{county.name}</span>
              </h2>
              <p className="text-midnight-400">
                Professional {service.name.toLowerCase()} available throughout {county.name}
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-3">
              {county.cities.map((city) => (
                <span
                  key={city}
                  className="px-4 py-2 rounded-full border border-midnight-700/50 bg-midnight-900/30 text-sm text-midnight-300"
                >
                  <MapPin className="w-3 h-3 inline mr-1 text-gold-500" />
                  {city}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Courts Served */}
      {county && county.courts && county.courts.length > 0 && (
        <section className="py-20 bg-midnight-900/50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                <span className="text-white">Courts in </span>
                <span className="text-gradient">{county.name}</span>
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {county.courts.map((court) => (
                <div
                  key={court}
                  className="card-glass p-4 flex items-center gap-3"
                >
                  <Scale className="w-5 h-5 text-gold-400" />
                  <span className="text-midnight-300">{court}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Service Areas */}
      {!county && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                <span className="text-white">Service Areas for </span>
                <span className="text-gradient">{service.name}</span>
              </h2>
              <p className="text-midnight-400">
                Click a county to learn more about our services in that area
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Los Angeles County", slug: "los-angeles" },
                { name: "Orange County", slug: "orange-county" },
                { name: "Riverside County", slug: "riverside" },
                { name: "San Bernardino County", slug: "san-bernardino" },
                { name: "Ventura County", slug: "ventura" },
                { name: "San Diego County", slug: "san-diego" },
              ].map((area) => (
                <Link
                  key={area.slug}
                  href={`/services/${service.slug}/${area.slug}`}
                  className="card-glass card-glass-hover p-6 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gold-400" />
                      <span className="text-white font-medium group-hover:text-gold-400 transition-colors">
                        {area.name}
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-midnight-500 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="py-20 bg-midnight-900/50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Frequently Asked </span>
              <span className="text-gradient">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {service.faqs.map((faq, index) => (
              <motion.details
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-glass group"
              >
                <summary className="p-6 cursor-pointer list-none flex items-center justify-between font-medium text-white">
                  {faq.question}
                  <span className="text-gold-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="px-6 pb-6 text-midnight-300">
                  {faq.answer}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              <span className="text-white">Ready to Get Started?</span>
            </h2>
            <p className="text-midnight-300 text-lg mb-8">
              Contact us today for fast, reliable {service.name.toLowerCase()} services
              {county ? ` in ${county.name}` : " throughout Southern California"}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:8187710904"
                className="btn-primary text-lg flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call (818) 771-0904
              </a>
              <a
                href="mailto:contact@turbomessengers.com"
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Email Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-midnight-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/">
              <img
                src="/images/logo-footer.png"
                alt="Turbo Messengers"
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-midnight-500 text-sm">
              © {new Date().getFullYear()} Turbo Messengers. All Rights Reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="tel:8187710904" className="text-midnight-400 hover:text-gold-400 transition-colors">
                <Phone className="w-5 h-5" />
              </a>
              <a href="mailto:contact@turbomessengers.com" className="text-midnight-400 hover:text-gold-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
