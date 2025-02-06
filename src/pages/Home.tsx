import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Footer from "@/pages/Footer";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#09001a] via-[#240046] to-[#3a0ca3] text-white">

      {/* 🔥 Updated Navbar */}
      <nav className="fixed top-0 w-full bg-[#12002b]/90 backdrop-blur-lg border-b border-[#7209b7]/50 z-50 shadow-md shadow-[#7209b7]/30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-[#f8f9fa] drop-shadow-lg">
            Genre Magazine 2025
          </Link>
          <Link to="/reader">
            <Button className="bg-[#ff006e] hover:bg-[#d6005f] text-white shadow-lg shadow-pink-500/50 rounded-full">
              Open Reader
            </Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-24 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="px-3 py-1 rounded-full bg-[#7209b7]/40 text-[#f8f9fa] text-sm mb-4 inline-block shadow-md shadow-[#ff006e]/40">
            Genre Magazine
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-medium mt-4 mb-6 drop-shadow-lg text-[#f8f9fa]">
            The Art of Reading
          </h1>
          <p className="text-[#dad8f7] max-w-2xl mx-auto mb-8 text-lg">
            Immerse yourself in a distraction-free reading experience and get to know the Hidden Talent of your Peers. Designed for focus and enjoyment.
          </p>
          <Link to="/reader">
            <Button size="lg" className="rounded-full px-8 bg-[#ff006e] hover:bg-[#d6005f] text-white shadow-lg shadow-pink-500/50">
              Let's Unfold the Journey
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto max-w-3xl aspect-[4/3] rounded-lg overflow-hidden shadow-2xl border border-[#f72585]/40"
        >
          <img
            src="/book-preview.jpg"
            alt="Book Preview"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </main>

      {/* 🔥 Footer Component */}
      <Footer />
    </div>
  );
};

export default Home;
