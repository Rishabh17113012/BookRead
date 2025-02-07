import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Home, Maximize, Minimize } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const Reader = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showTwoPages, setShowTwoPages] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Get selected PDF from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const file = queryParams.get("file");

  useEffect(() => {
    const handleResize = () => {
      setShowTwoPages(window.innerWidth >= 1024);
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && currentPage < (numPages || 0)) {
        setCurrentPage((prev) =>
          Math.min(prev + (showTwoPages ? 2 : 1), numPages || 0)
        );
      } else if (e.key === "ArrowLeft" && currentPage > 1) {
        setCurrentPage((prev) => Math.max(prev - (showTwoPages ? 2 : 1), 1));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, numPages, showTwoPages]);

  // Full-Screen Toggle Function
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // Listen for Full-Screen Exit
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] overflow-hidden">
      {/* Navbar - Hidden in Fullscreen Mode */}
      {!isFullScreen && (
        <nav className="fixed top-0 w-full bg-gradient-to-b from-[#09001a]/90 to-[#240046]/80 backdrop-blur-lg border-b border-[#7209b7]/50 shadow-lg z-50 flex justify-between items-center px-4 h-16">
          {/* Home Button */}
          <Link to="/">
            <Button variant="ghost" className="text-[#dad8f7] hover:text-white">
              <Home size={20} />
              <span>Home</span>
            </Button>
          </Link>

          {/* Navigation Controls (Centered) */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="icon"
              className="border-[#f72585] text-[#f72585] hover:border-[#ff006e] hover:text-[#ff006e]"
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - (showTwoPages ? 2 : 1), 1))
              }
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-[#4cc9f0] text-[#4cc9f0] hover:border-[#4361ee] hover:text-[#4361ee]"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + (showTwoPages ? 2 : 1), numPages || 0)
                )
              }
              disabled={currentPage >= (numPages || 0)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullScreen}
            className="text-white bg-[#4cc9f0] hover:bg-[#4361ee] px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Maximize size={20} />
            Fullscreen
          </button>

          {/* Page Number on the Right */}
          <span className="text-sm text-gray-300">
            Page {currentPage} of {numPages}
          </span>
        </nav>
      )}

      {/* Small Exit Fullscreen Button */}
      {isFullScreen && (
        <button
          onClick={toggleFullScreen}
          className="fixed top-4 right-4 bg-[#f72585] text-white p-2 rounded-full shadow-lg hover:bg-[#ff006e] z-50"
        >
          <Minimize size={24} />
        </button>
      )}

      {/* PDF Viewer */}
      <main className="container mx-auto px-4 pt-20 pb-12 flex-grow flex flex-col items-center">
        <div className="flex justify-center">
          <Document
            file={`/${file}`}
            onLoadSuccess={onDocumentLoadSuccess}
            className="flex justify-center gap-1 lg:gap-2"
          >
            <div className="flex flex-col items-center">
              <Page
                pageNumber={currentPage}
                className="shadow-lg bg-white rounded-lg"
                width={isMobile ? window.innerWidth - 40 : 600} // Full width on mobile, 600px on desktop
              />
            </div>
            {showTwoPages && currentPage + 1 <= (numPages || 0) && !isMobile && (
              <div className="flex flex-col items-center">
                <Page
                  pageNumber={currentPage + 1}
                  className="shadow-lg bg-white rounded-lg"
                  width={600} // Second page only on desktop
                />
              </div>
            )}
          </Document>
        </div>
      </main>
    </div>
  );
};

export default Reader;
