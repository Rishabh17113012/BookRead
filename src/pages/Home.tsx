import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/pages/Footer";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const pdfFiles = [
    { name: "Genre 2024", file: "magazine24.pdf" },
    { name: "Genre 2023", file: "magazine23.pdf" },
    { name: "Genre 2019", file: "magazine19.pdf" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 15,
      },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Layers */}
      <div className="synthwave-bg" />
      <div className="perspective-grid" />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 50, damping: 15 }}
        className="fixed top-0 w-full bg-card/90 backdrop-blur-lg border-b border-primary/30 z-50"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="nav-link text-2xl font-bold">
            Genre Magazine 2025
          </Link>
        </div>
      </motion.nav>

      {/* Main Content */}
      <AnimatePresence>
        {!isLoading && (
          <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 container mx-auto px-4 pt-24 pb-16"
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <motion.span
                className="px-4 py-2 rounded-full bg-primary/20 text-white text-lg mb-4 inline-block"
                whileHover={{
                  scale: 1.05,
                  boxShadow: [
                    "0 0 20px rgba(123, 47, 247, 0.4)",
                    "0 0 25px rgba(255, 45, 135, 0.4)",
                  ],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                Genre Magazine
              </motion.span>

              <motion.h1
                className="heading-primary text-5xl md:text-7xl mb-8"
                variants={itemVariants}
                data-text="The Art of Reading"
              >
                The Art of Reading
              </motion.h1>

              <motion.p
                className="text-glow text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
                variants={itemVariants}
              >
                Immerse yourself in a distraction-free reading experience and
                discover the hidden talents of your peers.
              </motion.p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex justify-center gap-6 flex-wrap mb-16"
            >
              {pdfFiles.map((pdf, index) => (
                <Link key={index} to={`/reader?file=${pdf.file}`}>
                  <motion.button
                    className="cybr-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 50,
                      damping: 10,
                    }}
                  >
                    {pdf.name}
                  </motion.button>
                </Link>
              ))}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="synthwave-card max-w-3xl mx-auto"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent z-10"
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <img
                  src="/book-preview.jpg"
                  alt="Book Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </motion.main>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Home;
