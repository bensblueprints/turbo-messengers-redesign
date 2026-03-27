"use client";

import { motion } from "framer-motion";
import {
  Scale,
  Building2,
  FileText,
  Landmark,
  ExternalLink,
  Phone,
  ChevronRight,
  Home,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

interface LinkItem {
  name: string;
  url: string;
  description?: string;
}

interface LinkSection {
  id: string;
  title: string;
  icon: typeof Scale;
  links: LinkItem[];
}

const linkSections: LinkSection[] = [
  {
    id: "superior-courts",
    title: "Superior Courts",
    icon: Scale,
    links: [
      { name: "Los Angeles Superior Court", url: "https://www.lacourt.org/", description: "LA County courts" },
      { name: "Orange County Superior Court", url: "https://www.occourts.org/", description: "Orange County courts" },
      { name: "Riverside Superior Court", url: "https://www.riverside.courts.ca.gov/", description: "Riverside County courts" },
      { name: "San Bernardino Superior Court", url: "https://www.sb-court.org/", description: "San Bernardino County courts" },
      { name: "San Diego Superior Court", url: "https://www.sdcourt.ca.gov/", description: "San Diego County courts" },
      { name: "Ventura Superior Court", url: "https://www.ventura.courts.ca.gov/", description: "Ventura County courts" },
      { name: "All California Courts Directory", url: "https://www.courts.ca.gov/find-my-court.htm", description: "Find any California court" },
    ],
  },
  {
    id: "district-courts",
    title: "U.S. District Courts & Legal Resources",
    icon: Landmark,
    links: [
      { name: "California Code of Civil Procedure", url: "https://leginfo.legislature.ca.gov/faces/codesTOCSelected.xhtml?tocCode=CCP", description: "Civil procedure codes" },
      { name: "California Rules of Court", url: "https://www.courts.ca.gov/rules.htm", description: "Court rules and procedures" },
      { name: "Court Holidays Calendar", url: "https://www.courts.ca.gov/holidays.htm", description: "Court holiday schedule" },
      { name: "Los Angeles County Sheriff", url: "https://lasd.org/", description: "Sheriff civil services" },
      { name: "Workers Compensation Appeals Board", url: "https://www.dir.ca.gov/wcab/wcab.htm", description: "WCAB information" },
      { name: "California Secretary of State", url: "https://www.sos.ca.gov/", description: "Business filings & records" },
      { name: "California DMV", url: "https://www.dmv.ca.gov/", description: "Vehicle & driver records" },
    ],
  },
  {
    id: "bankruptcy-courts",
    title: "U.S. Bankruptcy Courts",
    icon: Building2,
    links: [
      { name: "Central District - Los Angeles Division", url: "https://www.cacb.uscourts.gov/", description: "Los Angeles, Santa Ana, Riverside, San Fernando Valley" },
      { name: "Eastern District - Sacramento & Fresno", url: "https://www.caeb.uscourts.gov/", description: "Sacramento, Fresno divisions" },
      { name: "Northern District - San Francisco", url: "https://www.canb.uscourts.gov/", description: "San Francisco, Oakland, San Jose" },
      { name: "Southern District - San Diego", url: "https://www.casb.uscourts.gov/", description: "San Diego division" },
      { name: "Federal Courts Nationwide", url: "https://www.uscourts.gov/court-locator", description: "Find any federal court" },
    ],
  },
  {
    id: "county-recorders",
    title: "Southern California County Recorders",
    icon: FileText,
    links: [
      { name: "Los Angeles County Recorder", url: "https://www.lavote.gov/home/recorder/property-document-recording", description: "LA County property records" },
      { name: "Orange County Recorder", url: "https://www.ocrecorder.com/", description: "Orange County property records" },
      { name: "Riverside County Recorder", url: "https://www.asrclkrec.com/", description: "Riverside County property records" },
      { name: "San Bernardino County Recorder", url: "https://www.sbcounty.gov/arc/", description: "San Bernardino property records" },
      { name: "Ventura County Recorder", url: "https://recorder.countyofventura.org/", description: "Ventura County property records" },
      { name: "Common Recording Forms", url: "https://www.lavote.gov/home/recorder/property-document-recording/forms", description: "Standard recording forms" },
    ],
  },
];

function Navigation() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-midnight-950/80 backdrop-blur-md border-b border-midnight-800/50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div whileHover={{ scale: 1.02 }} className="flex items-center">
          <Link href="/">
            <img src="/images/logo-nav.png" alt="Turbo Messengers - Process Servers" className="h-12 w-auto" />
          </Link>
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-midnight-300 hover:text-gold-400 transition-colors duration-300 flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          {["superior-courts", "district-courts", "bankruptcy-courts", "county-recorders"].map(
            (section) => (
              <a
                key={section}
                href={`#${section}`}
                className="text-sm font-medium text-midnight-300 hover:text-gold-400 transition-colors duration-300 relative group"
              >
                {section
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 group-hover:w-full transition-all duration-300" />
              </a>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          <motion.a
            href="/login"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-sm font-medium text-midnight-300 hover:text-gold-400 transition-colors hidden sm:flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Client Login
          </motion.a>
          <motion.a
            href="tel:8187710904"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">(818) 771-0904</span>
            <span className="sm:hidden">Call</span>
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
}

function LinkCard({ link }: { link: LinkItem }) {
  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      variants={staggerItem}
      whileHover={{ x: 8, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="group flex items-center justify-between p-4 rounded-xl bg-midnight-800/30 border border-midnight-700/30 hover:border-gold-500/30 hover:bg-midnight-800/50 transition-all duration-300"
    >
      <div className="flex-1">
        <h4 className="font-medium text-white group-hover:text-gold-400 transition-colors flex items-center gap-2">
          {link.name}
          <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h4>
        {link.description && (
          <p className="text-sm text-midnight-400 mt-0.5">{link.description}</p>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-midnight-600 group-hover:text-gold-400 transition-colors" />
    </motion.a>
  );
}

function LinkSectionComponent({ section, index }: { section: LinkSection; index: number }) {
  return (
    <motion.section
      id={section.id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="scroll-mt-24"
    >
      <div className="card-glass p-8">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400/20 to-gold-600/10 border border-gold-500/20 flex items-center justify-center">
            <section.icon className="w-6 h-6 text-gold-400" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white">{section.title}</h2>
            <p className="text-sm text-midnight-400">{section.links.length} resources</p>
          </div>
        </div>

        {/* Links Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-3"
        >
          {section.links.map((link) => (
            <LinkCard key={link.name} link={link} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

function Footer() {
  return (
    <footer className="relative py-12 border-t border-midnight-800/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <img
            src="/images/logo-footer.png"
            alt="Turbo Messengers - Process Servers"
            className="h-14 w-auto"
          />
          <p className="text-midnight-500 text-sm">
            &copy; {new Date().getFullYear()} Turbo Messengers. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function LinksPage() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    // Handle hash navigation on page load
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 500);
      }
    }

    // Update active section on scroll
    const handleScroll = () => {
      const sections = linkSections.map((s) => document.getElementById(s.id));
      const scrollPos = window.scrollY + 200;

      for (const section of sections.reverse()) {
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gold-500/5 blur-[120px]" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-electric-500/5 blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm font-medium mb-6"
            >
              Legal Resources
            </motion.span>

            <motion.h1
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            >
              <span className="text-white">Helpful</span>{" "}
              <span className="text-gradient">Links</span>
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={0.5}
              className="text-lg text-midnight-300 max-w-2xl mx-auto"
            >
              Quick access to California courts, legal resources, and county recorders throughout
              Southern California.
            </motion.p>
          </motion.div>

          {/* Quick Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mt-10"
          >
            {linkSections.map((section) => (
              <motion.a
                key={section.id}
                href={`#${section.id}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeSection === section.id
                    ? "bg-gold-500/20 border-gold-500/40 text-gold-400"
                    : "bg-midnight-800/30 border-midnight-700/50 text-midnight-300 hover:border-gold-500/30 hover:text-gold-400"
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.title}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Links Sections */}
      <section className="relative py-16">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          {linkSections.map((section, index) => (
            <LinkSectionComponent key={section.id} section={section} index={index} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card-glass p-8 md:p-12 text-center"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
              Need Process Serving or Court Filing?
            </h2>
            <p className="text-midnight-300 mb-8 max-w-xl mx-auto">
              Let our experienced team handle your legal documents throughout Southern California.
              Fast, reliable service since 2009.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="tel:8187710904"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call (818) 771-0904
              </motion.a>
              <motion.a
                href="/#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                Contact Us
                <ChevronRight className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
