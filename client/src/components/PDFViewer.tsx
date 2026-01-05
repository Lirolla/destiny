import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut,
  Maximize,
  Download,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  pdfUrl: string;
  initialPage?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function PDFViewer({ pdfUrl, initialPage = 1, onPageChange, className }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    toast.success(`PDF loaded: ${numPages} pages`);
  };

  const onDocumentLoadError = (error: Error) => {
    setIsLoading(false);
    toast.error(`Failed to load PDF: ${error.message}`);
    console.error("PDF load error:", error);
  };

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      const newPage = pageNumber - 1;
      setPageNumber(newPage);
      onPageChange?.(newPage);
    }
  };

  const goToNextPage = () => {
    if (numPages && pageNumber < numPages) {
      const newPage = pageNumber + 1;
      setPageNumber(newPage);
      onPageChange?.(newPage);
    }
  };

  const goToPage = (page: number) => {
    if (numPages && page >= 1 && page <= numPages) {
      setPageNumber(page);
      onPageChange?.(page);
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Controls */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Page Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={numPages || 1}
                value={pageNumber}
                onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                className="w-16 text-center"
                disabled={isLoading}
              />
              <span className="text-sm text-muted-foreground">
                / {numPages || "?"}
              </span>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              disabled={!numPages || pageNumber >= numPages || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={zoomOut}
              disabled={scale <= 0.5 || isLoading}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              onClick={resetZoom}
              disabled={isLoading}
              className="min-w-20"
            >
              {Math.round(scale * 100)}%
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={zoomIn}
              disabled={scale >= 3.0 || isLoading}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.open(pdfUrl, "_blank")}
              title="Open in new tab"
            >
              <Maximize className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const link = document.createElement("a");
                link.href = pdfUrl;
                link.download = "destiny-hacking-book.pdf";
                link.click();
              }}
              title="Download PDF"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* PDF Document */}
      <div className="flex-1 overflow-auto bg-muted/30 rounded-lg p-4">
        <div className="flex justify-center">
          {isLoading && (
            <div className="flex flex-col items-center gap-4 py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading PDF...</p>
            </div>
          )}

          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
            error={
              <div className="text-center py-12">
                <p className="text-destructive font-medium">Failed to load PDF</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please check the PDF URL and try again
                </p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-lg"
            />
          </Document>
        </div>
      </div>
    </div>
  );
}
