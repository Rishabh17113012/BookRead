
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">
            ReadFlow
          </Link>
          <Link to="/reader">
            <Button variant="ghost">Open Reader</Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4 inline-block">
            Featured Book
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-medium mt-4 mb-6">
            The Art of Reading
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Immerse yourself in a distraction-free reading experience. Designed for focus and enjoyment.
          </p>
          <Link to="/reader">
            <Button size="lg" className="rounded-full px-8">
              Start Reading
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto max-w-3xl aspect-[4/3] rounded-lg overflow-hidden shadow-2xl"
        >
          <img
            src="/book-preview.jpg"
            alt="Book Preview"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </main>
    </div>
  );
};

export default Home;
