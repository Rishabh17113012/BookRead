import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Footer from "@/pages/Footer";
import { quotes } from "./quotes";

const Home = () => {
  const [showSplash, setShowSplash] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [currentQuote, setCurrentQuote] = useState(
    () => quotes[Math.floor(Math.random() * quotes.length)]
  );

  const pdfFiles = [
    { name: "Genre 2024", file: "magazine24.pdf" },
    { name: "Genre 2023", file: "magazine23.pdf" },
    { name: "Genre 2019", file: "magazine19.pdf" },
  ];

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 5000);
    return () => clearInterval(quoteInterval);
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setShowSplash(false);
    }, 5000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSplashDismiss = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setShowSplash(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 70, damping: 15 },
    },
  };

  // Quote Display Component with 3D effect and internal glitch overlay
  const EnhancedQuoteDisplay = ({ quote }: { quote: string }) => {
    return (
      <div className="relative max-w-3xl mx-auto mb-8">
       
        <div className="glitch-overlay absolute inset-0 pointer-events-none z-[-1]"></div>
        <div className="relative p-1">
          <svg
            className="absolute inset-0 w-full h-full"
            style={{
              filter: "drop-shadow(0 0 2px currentColor)",
              overflow: "visible",
            }}
          >
            <defs>
              <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff0000" stopOpacity="0.0">
                  <animate
                    attributeName="stopColor"
                    values="#ff0000; #ffff00; #800080; #ff0000"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="50%" stopColor="#ff0000">
                  <animate
                    attributeName="stopColor"
                    values="#ff0000; #ffff00; #800080; #ff0000"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="100%" stopColor="#ff0000" stopOpacity="0.0">
                  <animate
                    attributeName="stopColor"
                    values="#ff0000; #ffff00; #800080; #ff0000"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </stop>
              </linearGradient>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="none"
              stroke="url(#neonGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;100"
                dur="2s"
                repeatCount="indefinite"
              />
            </rect>
          </svg>

          {/* 3D-styled quote */}
          <div className="relative p-6 transform-gpu perspective-800">
            <AnimatePresence mode="wait">
              <motion.p
                key={quote}
                initial={{ opacity: 0, y: 10, z: -20 }}
                animate={{ opacity: 1, y: 0, z: 30 }}
                exit={{ opacity: 0, y: -10, z: -20 }}
                transition={{ duration: 0.5 }}
                className="text-glow text-center italic text-lg font-serif"
                style={{
                  transform: "translateZ(30px)",
                  textShadow: "0 4px 8px rgba(0,0,0,0.3)",
                }}
              >
                {quote}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  return (
    <LayoutGroup>
      <div className="relative min-h-screen overflow-hidden">
    
        <div className="synthwave-bg" />
        <div className="perspective-grid" />
        {/* Sparkles overlay*/}
        <div className="sparkles-overlay absolute inset-0 pointer-events-none z-[-2]"></div>

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

        {/* Main content area (body) */}
        <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
          {/* Internal glitch overlay */}
          <div className="glitch-overlay absolute inset-0 pointer-events-none z-[-1]"></div>

          <div className="text-center mb-16">
            <motion.div
              layoutId="logo"
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="px-4 py-2 rounded-full bg-primary/20 text-white text-lg mb-4 inline-block"
              whileHover={{
                scale: 1.05,
                boxShadow: [
                  "0 0 20px rgba(123, 47, 247, 0.4)",
                  "0 0 25px rgba(255, 45, 135, 0.4)",
                ],
              }}
              animate={{ scale: 1 }}
            >
              <img
                src="/Genre_Logo.png"
                alt="Genre Magazine Logo"
                className="h-24 w-auto"
              />
            </motion.div>

            <AnimatePresence>
              {!showSplash && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
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
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {!showSplash && (
              <>
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

                <motion.div variants={itemVariants}>
                  <EnhancedQuoteDisplay quote={currentQuote} />
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
              </>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showSplash && (
            <motion.div
              key="splash"
              onClick={handleSplashDismiss}
              onTouchStart={handleSplashDismiss}
              className="fixed inset-0 bg-black z-50 flex items-center justify-center cursor-pointer"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
            >
              <motion.div
                layoutId="logo"
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                className="flex items-center justify-center mx-auto max-w-[80%] max-h-[80vh]"
              >
                <img
                  src="/Genre_Logo.png"
                  alt="Genre Magazine Logo"
                  className="max-w-full max-h-full object-contain"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.75, duration: 0.6 }}
        >
          <Footer />
        </motion.footer>
      </div>
    </LayoutGroup>
  );
};

export default Home;
