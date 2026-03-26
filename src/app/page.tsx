"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  FileText,
  Scale,
  Zap,
  Shield,
  Clock,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Star,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

// Animation variants
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
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// Components
function Navigation() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-midnight-950/80 backdrop-blur-md border-b border-midnight-800/50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3"
        >
          <img
            src="/images/logo-white.png"
            alt="Turbo Messengers"
            className="h-10 w-auto"
          />
          <div>
            <span className="text-xl font-display font-bold tracking-tight">
              Turbo<span className="text-gold-400">Messengers</span>
            </span>
            <p className="text-xs text-midnight-400 -mt-0.5">Est. Since 2009</p>
          </div>
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          {["Services", "Coverage", "About", "Contact"].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="text-sm font-medium text-midnight-300 hover:text-gold-400 transition-colors duration-300 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
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

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/downtown-la-home-slider.jpg"
          alt="Downtown Los Angeles"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-950/90 via-midnight-950/80 to-midnight-950" />
      </div>

      {/* Background Effects */}
      <motion.div
        style={{ y }}
        className="absolute inset-0"
      >
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gold-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-electric-500/10 blur-[100px] animate-pulse animation-delay-500" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-midnight-800/60 border border-midnight-700/50 backdrop-blur-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-midnight-300">
            Registered & Bonded Process Servers
          </span>
          <Shield className="w-4 h-4 text-gold-400" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={0.5}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="block text-white">Fast, Reliable</span>
          <span className="block text-gradient glow-text mt-2">& Honest</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={0.7}
          className="text-xl md:text-2xl text-midnight-300 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          Southern California&apos;s premier process serving and court filing service.
          <span className="text-gold-400"> Ranked #1</span> for over 10 years.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={0.9}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary text-lg flex items-center gap-2"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5" />
          </motion.a>
          <motion.a
            href="#services"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary flex items-center gap-2"
          >
            View Services
            <ChevronRight className="w-5 h-5" />
          </motion.a>
        </motion.div>

        {/* Service Areas */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-3"
        >
          {[
            "Los Angeles",
            "Ventura",
            "San Bernardino",
            "Riverside",
            "Orange",
            "San Diego",
          ].map((county) => (
            <motion.span
              key={county}
              variants={staggerItem}
              whileHover={{ scale: 1.05, borderColor: "rgba(251, 191, 36, 0.5)" }}
              className="px-4 py-2 rounded-full border border-midnight-700/50 bg-midnight-900/30 backdrop-blur-sm text-sm text-midnight-300 hover:text-gold-400 transition-all duration-300 cursor-default flex items-center gap-2"
            >
              <MapPin className="w-3 h-3 text-gold-500" />
              {county} County
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-midnight-600 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], scaleY: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 rounded-full bg-gold-400"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

function Services() {
  const services = [
    {
      icon: Scale,
      title: "Process Service",
      description:
        "Serve any paper or legal document anywhere in Southern California with original proof of service regarding completion status.",
      features: ["Same-day service available", "Skip tracing", "Stakeout service", "Proof of service"],
    },
    {
      icon: FileText,
      title: "Court Filing",
      description:
        "Most court filings delivered same day with filing stamps indicating receipt date (subject to court backlogs).",
      features: ["Same-day filing", "All SoCal courts", "Filing stamps", "Document retrieval"],
    },
    {
      icon: Users,
      title: "Small Claims",
      description:
        "Skilled staff specializes in preparing Small Claims documents for individuals and companies with expert guidance.",
      features: ["Document preparation", "Filing assistance", "Service coordination", "Expert guidance"],
    },
  ];

  return (
    <section id="services" className="relative py-32 bg-midnight-950">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight-900/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm font-medium mb-6"
          >
            Our Services
          </motion.span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Professional Legal</span>
            <br />
            <span className="text-gradient">Support Services</span>
          </h2>
          <p className="text-midnight-400 text-lg max-w-2xl mx-auto">
            Comprehensive process serving and court filing solutions backed by over a decade of excellence.
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <motion.div
                whileHover={{ y: -8 }}
                className="h-full card-glass card-glass-hover p-8 group"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/10 border border-gold-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <service.icon className="w-7 h-7 text-gold-400" />
                </div>

                {/* Content */}
                <h3 className="font-display text-2xl font-bold text-white mb-4 group-hover:text-gold-400 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-midnight-400 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-midnight-300"
                    >
                      <CheckCircle className="w-4 h-4 text-gold-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Link */}
                <motion.a
                  href="#contact"
                  whileHover={{ x: 5 }}
                  className="inline-flex items-center gap-2 mt-8 text-gold-400 font-medium group/link"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </motion.a>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { value: "15+", label: "Years Experience", icon: Clock },
    { value: "10K+", label: "Documents Served", icon: FileText },
    { value: "5", label: "Star Rating", icon: Star },
    { value: "6", label: "Counties Covered", icon: MapPin },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-midnight-900 to-electric-500/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#0a1929_70%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-midnight-800/50 border border-midnight-700/50 mb-4 group-hover:border-gold-500/30 transition-colors duration-300"
              >
                <stat.icon className="w-7 h-7 text-gold-400" />
              </motion.div>
              <motion.div
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                className="font-display text-4xl md:text-5xl font-bold text-gradient mb-2"
              >
                {stat.value}
              </motion.div>
              <p className="text-midnight-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="relative py-32 bg-midnight-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-1.5 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-sm font-medium mb-6"
            >
              About Us
            </motion.span>

            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Ranked #1</span>
              <br />
              <span className="text-gradient-blue">Since 2009</span>
            </h2>

            <p className="text-midnight-300 text-lg leading-relaxed mb-6">
              Turbo Messengers has been the trusted choice for process serving and court filing services throughout Southern California for over 15 years. Our multi-lingual staff provides immediate proof of service upon completion, ensuring you always have the documentation you need.
            </p>

            <p className="text-midnight-400 leading-relaxed mb-8">
              We pride ourselves on supportive and proficient services, handling each case with the utmost professionalism and attention to detail. From routine filings to complex service situations, our experienced team delivers results.
            </p>

            {/* Features List */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Registered & Bonded",
                "Multi-lingual Staff",
                "Same-Day Service",
                "24/7 Availability",
                "Immediate Proof of Service",
                "All SoCal Courts",
              ].map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-gold-400" />
                  </div>
                  <span className="text-midnight-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="card-glass p-10 relative overflow-hidden"
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-gold-500/20 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-electric-500/20 to-transparent rounded-full blur-2xl" />

                <div className="relative">
                  <Award className="w-16 h-16 text-gold-400 mb-6" />
                  <h3 className="font-display text-3xl font-bold text-white mb-4">
                    Excellence in Service
                  </h3>
                  <p className="text-midnight-300 leading-relaxed mb-6">
                    Our commitment to fast, reliable, and honest service has made us the #1 ranked messenger service in Southern California.
                  </p>

                  {/* Trust Badges */}
                  <div className="flex flex-wrap gap-3">
                    {["Licensed", "Bonded", "Insured"].map((badge) => (
                      <span
                        key={badge}
                        className="px-4 py-2 rounded-lg bg-midnight-800/50 border border-midnight-700/50 text-sm text-gold-400"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/30"
              >
                <span className="font-display text-2xl font-bold text-midnight-950">15+</span>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 px-6 py-3 rounded-xl bg-midnight-800 border border-midnight-700/50 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-400 to-electric-600 border-2 border-midnight-800"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-midnight-300">
                    Trusted by <span className="text-white font-medium">1000+</span> clients
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="relative py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight-950 via-midnight-900/50 to-midnight-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(251,191,36,0.1)_0%,_transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm font-medium mb-6"
            >
              Contact Us
            </motion.span>

            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Ready to Get</span>
              <br />
              <span className="text-gradient">Started?</span>
            </h2>

            <p className="text-midnight-300 text-lg leading-relaxed mb-10">
              Get in touch with our team today. We&apos;re available 24/7 to handle your process serving and court filing needs throughout Southern California.
            </p>

            {/* Contact Methods */}
            <div className="space-y-6">
              <motion.a
                href="tel:8187710904"
                whileHover={{ x: 10 }}
                className="flex items-center gap-5 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/10 border border-gold-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <p className="text-sm text-midnight-400 mb-1">Call Us</p>
                  <p className="text-xl font-semibold text-white group-hover:text-gold-400 transition-colors">
                    (818) 771-0904
                  </p>
                </div>
              </motion.a>

              <motion.a
                href="mailto:contact@turbomessengers.com"
                whileHover={{ x: 10 }}
                className="flex items-center gap-5 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-electric-400/20 to-electric-600/10 border border-electric-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-6 h-6 text-electric-400" />
                </div>
                <div>
                  <p className="text-sm text-midnight-400 mb-1">Email Us</p>
                  <p className="text-xl font-semibold text-white group-hover:text-electric-400 transition-colors">
                    contact@turbomessengers.com
                  </p>
                </div>
              </motion.a>

              <motion.div
                whileHover={{ x: 10 }}
                className="flex items-center gap-5"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400/20 to-green-600/10 border border-green-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-midnight-400 mb-1">Availability</p>
                  <p className="text-xl font-semibold text-white">
                    24/7 Service Available
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="card-glass p-8 md:p-10">
              <h3 className="font-display text-2xl font-bold text-white mb-6">
                Send Us a Message
              </h3>

              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-midnight-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all duration-300"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-midnight-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all duration-300"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-midnight-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all duration-300"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-midnight-300 mb-2">
                    Service Needed
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all duration-300">
                    <option value="">Select a service</option>
                    <option value="process">Process Service</option>
                    <option value="court">Court Filing</option>
                    <option value="small-claims">Small Claims Preparation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-midnight-300 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-midnight-800/50 border border-midnight-700/50 text-white placeholder-midnight-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all duration-300 resize-none"
                    placeholder="Tell us about your needs..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-primary text-lg py-4"
                >
                  Send Message
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative py-16 border-t border-midnight-800/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-midnight-950" />
              </div>
              <span className="text-xl font-display font-bold">
                Turbo<span className="text-gold-400">Messengers</span>
              </span>
            </div>
            <p className="text-midnight-400 max-w-md leading-relaxed">
              Southern California&apos;s premier process serving and court filing service. Fast, reliable, and honest since 2009.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-3">
              {["Process Service", "Court Filing", "Small Claims", "Document Retrieval"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#services"
                      className="text-midnight-400 hover:text-gold-400 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:8187710904"
                  className="text-midnight-400 hover:text-gold-400 transition-colors"
                >
                  (818) 771-0904
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@turbomessengers.com"
                  className="text-midnight-400 hover:text-gold-400 transition-colors"
                >
                  contact@turbomessengers.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-midnight-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-midnight-500 text-sm">
            &copy; {new Date().getFullYear()} Turbo Messengers. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-midnight-500 hover:text-gold-400 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-midnight-500 hover:text-gold-400 text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <Hero />
      <Services />
      <Stats />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
