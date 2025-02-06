
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/TextLayer.css';
import { motion, AnimatePresence } from "framer-motion";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Reader = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState(1.0);
  const [selectedText, setSelectedText] = useState("");
  const documentRef = useRef<HTMLDivElement>(null);
  const [showTwoPages, setShowTwoPages] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setShowTwoPages(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && currentPage < (numPages || 0)) {
        setCurrentPage(prev => Math.min(prev + (showTwoPages ? 2 : 1), numPages || 0));
      } else if (e.key === "ArrowLeft" && currentPage > 1) {
        setCurrentPage(prev => Math.max(prev - (showTwoPages ? 2 : 1), 1));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, numPages, showTwoPages]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection) {
      const text = selection.toString();
      if (text) {
        setSelectedText(text);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Home size={20} />
            <span>Home</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Page {currentPage} of {numPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(prev - (showTwoPages ? 2 : 1), 1))}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(prev + (showTwoPages ? 2 : 1), numPages || 0))}
                disabled={currentPage >= (numPages || 0)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          ref={documentRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
          onMouseUp={handleTextSelection}
        >
          <Document
            file="/sample.pdf"
            onLoadSuccess={onDocumentLoadSuccess}
            className="flex gap-4 justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex gap-4"
              >
                <Page
                  pageNumber={currentPage}
                  scale={scale}
                  className="shadow-lg rounded-lg overflow-hidden bg-white"
                  renderTextLayer={true}
                />
                {showTwoPages && currentPage + 1 <= (numPages || 0) && (
                  <Page
                    pageNumber={currentPage + 1}
                    scale={scale}
                    className="shadow-lg rounded-lg overflow-hidden bg-white"
                    renderTextLayer={true}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </Document>
        </motion.div>

        {selectedText && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg border">
            <p className="text-sm font-medium">Selected text:</p>
            <p className="text-gray-600">{selectedText}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Reader;
