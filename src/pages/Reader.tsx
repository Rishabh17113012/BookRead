import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import Navbar from "./Navbar";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";


const PRELOAD_PAGES = 2;
const CACHE_SIZE = 10;
const RENDER_THROTTLE = 150;

const Reader = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showTwoPages, setShowTwoPages] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [showSwipeAlert, setShowSwipeAlert] = useState(isMobile);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const pageCache = useRef<Map<number, any>>(new Map());
  const preloadQueue = useRef<Set<number>>(new Set());
  const pdfDocument = useRef<any>(null);
  const resizeTimeout = useRef<NodeJS.Timeout>();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const file = queryParams.get("file");

  const calculatePageDimensions = useCallback(() => {
    if (resizeTimeout.current) {
      clearTimeout(resizeTimeout.current);
    }

    resizeTimeout.current = setTimeout(() => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const navbarHeight = 64;
      const padding = 32;
      const availableHeight = screenHeight - navbarHeight - padding;
      const standardPDFRatio = 1.414;
      const scale = window.devicePixelRatio || 1;

      let width: number, height: number;

      if (screenWidth < 768) {
        width = screenWidth - padding * 2;
        
        height = screenHeight - (navbarHeight + padding);
      } else {
        width = showTwoPages
          ? (screenWidth - padding * 3) / 2
          : screenWidth - padding * 2;
        
        if (width / standardPDFRatio > availableHeight) {
          height = availableHeight;
          width = height * (1 / standardPDFRatio);
        } else {
          height = width * standardPDFRatio;
        }
      }

      setPageDimensions({
        width: Math.floor(width * scale),
        height: Math.floor(height * scale)
      });
    }, RENDER_THROTTLE);
  }, [showTwoPages]);

  const preloadPages = useCallback(async () => {
    if (!pdfDocument.current || preloadQueue.current.size === 0) return;

    const pagesToLoad = Array.from(preloadQueue.current);
    preloadQueue.current.clear();

    for (const pageNum of pagesToLoad) {
      if (pageCache.current.has(pageNum)) continue;

      try {
        const page = await pdfDocument.current.getPage(pageNum);
        
        if (pageCache.current.size >= CACHE_SIZE) {
          const oldestPage = Array.from(pageCache.current.keys())[0];
          pageCache.current.delete(oldestPage);
        }
        
        pageCache.current.set(pageNum, page);
        
        // Update loading progress
        const progressIncrement = 100 / pagesToLoad.length;
        setLoadingProgress(prev => Math.min(100, prev + progressIncrement));
      } catch (error) {
        console.error(`Error preloading page ${pageNum}:`, error);
      }
    }
  }, []);

  const changePage = useCallback(
    (direction: "next" | "prev") => {
      if (isFlipping || !numPages) return;

      const pagesToPreload = new Set<number>();
      const increment = showTwoPages ? 2 : 1;

      if (direction === "next" && currentPage < numPages) {
        const nextPage = Math.min(currentPage + increment, numPages);
        setIsFlipping(true);
        setFlipDirection("next");
        
        for (let i = 1; i <= PRELOAD_PAGES; i++) {
          const pageToPreload = nextPage + i * increment;
          if (pageToPreload <= numPages) {
            pagesToPreload.add(pageToPreload);
          }
        }

        setTimeout(() => {
          setCurrentPage(nextPage);
          preloadQueue.current = pagesToPreload;
          preloadPages();
          
          setTimeout(() => {
            setIsFlipping(false);
            setFlipDirection(null);
          }, 400);
        }, 200);
      } else if (direction === "prev" && currentPage > 1) {
        const prevPage = Math.max(currentPage - increment, 1);
        setIsFlipping(true);
        setFlipDirection("prev");
        
        for (let i = 1; i <= PRELOAD_PAGES; i++) {
          const pageToPreload = prevPage - i * increment;
          if (pageToPreload >= 1) {
            pagesToPreload.add(pageToPreload);
          }
        }

        setTimeout(() => {
          setCurrentPage(prevPage);
          preloadQueue.current = pagesToPreload;
          preloadPages();
          
          setTimeout(() => {
            setIsFlipping(false);
            setFlipDirection(null);
          }, 400);
        }, 200);
      }
    },
    [isFlipping, currentPage, numPages, showTwoPages, preloadPages]
  );

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= (numPages || 0)) {
      setCurrentPage(page);
    }
  }, [numPages]);

  useEffect(() => {
    if (!file) return;

    const loadPDF = async () => {
      try {
        setIsLoading(true);
        setLoadingProgress(0);

        const loadingTask = pdfjs.getDocument(`/${file}`);
        
        loadingTask.onProgress = ({ loaded, total }) => {
          const progress = Math.round((loaded / total) * 100);
          setLoadingProgress(progress);
        };

        pdfDocument.current = await loadingTask.promise;
        setNumPages(pdfDocument.current.numPages);
        
        // Preload initial pages
        const initialPages = new Set<number>();
        for (let i = 1; i <= PRELOAD_PAGES + 1; i++) {
          initialPages.add(i);
        }
        preloadQueue.current = initialPages;
        await preloadPages();
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading PDF:", error);
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [file, preloadPages]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setShowTwoPages(width >= 1024);
      setIsMobile(width < 768);
      calculatePageDimensions();
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculatePageDimensions]);

  useEffect(() => {
    const savedPage = localStorage.getItem(`pdf_progress_${file}`);
    if (savedPage) setCurrentPage(parseInt(savedPage, 10));
  }, [file]);

  useEffect(() => {
    if (file) localStorage.setItem(`pdf_progress_${file}`, currentPage.toString());
  }, [currentPage, file]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "ArrowRight" && currentPage < (numPages || 0)) {
        e.preventDefault();
        changePage("next");
      } else if (e.key === "ArrowLeft" && currentPage > 1) {
        e.preventDefault();
        changePage("prev");
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [changePage, currentPage, numPages]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchDiff = touchStartX - touchEndX;
    if (touchDiff > 50 && currentPage < (numPages || 0)) {
      changePage("next");
    } else if (touchDiff < -50 && currentPage > 1) {
      changePage("prev");
    }
    setTouchStartX(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] overflow-hidden">
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          <div className="text-center">
            <div className="relative w-24 h-24">
              <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="text-blue-500 font-semibold">{loadingProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {isMobile && showSwipeAlert && (
            <div
              className="fixed top-0 left-0 w-full bg-black text-white text-sm px-4 py-2 text-center shadow-md z-50 cursor-pointer"
              onClick={() => setShowSwipeAlert(false)}
            >
              Swipe left or right to turn pages!
            </div>
          )}

          <Navbar
            currentPage={currentPage}
            numPages={numPages}
            isFlipping={isFlipping}
            onPageChange={changePage}
            onGoToPage={goToPage}
          />

          <main
            id="pdf-container"
            className="container mx-auto px-4 pt-20 pb-12 flex-grow flex flex-col items-center justify-center perspective"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Document
              file={`/${file}`}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
                setIsLoading(false);
              }}
              className={`flex justify-center ${showTwoPages ? "book-spread" : ""}`}
              error={
                <div className="text-center p-4">
                  <p className="text-red-500 mb-2">Error loading PDF</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Retry
                  </button>
                </div>
              }
            >
              <div 
                className={`flex justify-center ${isFlipping ? "flipping" : ""} 
                ${flipDirection === "next" ? "flip-next" : ""} 
                ${flipDirection === "prev" ? "flip-prev" : ""}`}
              >
                <Page
                  pageNumber={currentPage}
                  width={pageDimensions.width}
                  height={pageDimensions.height}
                  renderMode="canvas"
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className={`bg-white ${
                    showTwoPages
                      ? "rounded-l-lg rounded-r-none border-r border-gray-300"
                      : "rounded-lg shadow-lg"
                  }`}
                  loading={
                    <div className="flex items-center justify-center w-full h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                    </div>
                  }
                />

                {showTwoPages && currentPage + 1 <= (numPages || 0) && (
                  <Page
                    pageNumber={currentPage + 1}
                    width={pageDimensions.width}
                    height={pageDimensions.height}
                    renderMode="canvas"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="bg-white rounded-r-lg rounded-l-none"
                    loading={
                      <div className="flex items-center justify-center w-full h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                      </div>
                    }
                  />
                )}
              </div>
            </Document>
          </main>
        </>
      )}

      <style>{`
        .perspective {
          perspective: 2000px;
          perspective-origin: 50% 50%;
        }
        .book-spread {
          display: flex;
          background: white;
          border-radius: 8px;
          transform-style: preserve-3d;
          transition: all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
          position: relative;
          transform-origin: center left;
        }
        .book-spread .react-pdf__Page {
          margin: 0 !important;
          backface-visibility: hidden;
        }
        .book-spread::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.05));
          transform: translateX(-50%);
        }
        .flip-next .book-spread .react-pdf__Page:nth-child(2) {
          transform-origin: left center;
          animation: pageTurnNext 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .flip-prev .book-spread .react-pdf__Page:nth-child(1) {
          transform-origin: right center;
          animation: pageTurnPrev 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        @keyframes pageTurnNext {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(-90deg); }
          100% { transform: rotateY(-170deg); }
        }
        @keyframes pageTurnPrev {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(90deg); }
          100% { transform: rotateY(170deg); }
        }
        .flipping {
          transition: transform 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
        .book-shadow {
          position: relative;
        }
        .book-shadow::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -20px;
          height: 20px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.12), transparent);
          filter: blur(8px);
          transform-origin: center;
          transform: perspective(100px) rotateX(40deg);
          opacity: 0.8;
        }
        .book-spread::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 3px;
          left: -3px;
          background: linear-gradient(to right, rgba(0,0,0,0.05), rgba(0,0,0,0.02) 50%, rgba(255,255,255,0.05) 100%);
          border-radius: 2px 0 0 2px;
          transform: translateZ(-1px);
        }
        .book-spread:hover {
          transform: translateZ(5px);
          box-shadow: -5px 5px 10px rgba(0,0,0,0.1), -1px 1px 2px rgba(0,0,0,0.1);
        }
        @media (max-width: 768px) {
          .flip-next, .flip-prev {
            animation-duration: 0.65s;
          }
          .perspective {
            perspective: 1500px;
          }
          /* For mobile, make the PDF container use full screen height */
          #pdf-container {
            min-height: 100vh;
          }
        }
      `}</style>
    </div>
  );
};

export default Reader;
