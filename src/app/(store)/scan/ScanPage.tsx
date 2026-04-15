"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, X, Search, Zap } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { toast } from "sonner";

type BarcodeDetectorResult = {
  rawValue: string;
};

type BarcodeDetectorInstance = {
  detect: (source: ImageBitmapSource) => Promise<BarcodeDetectorResult[]>;
};

type BarcodeDetectorConstructor = new (options?: {
  formats?: string[];
}) => BarcodeDetectorInstance;

export function ScanPage() {
  const navigate = useNavigate();
  const { products } = useStore();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [scannedProduct, setScannedProduct] = useState<typeof products[0] | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera for scanning
  const startCamera = async () => {
    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      toast.success("Camera started! Point at barcode");
    } catch (err) {
      console.error("Camera error:", err);
      toast.error("Could not access camera. Please allow camera permission.");
      setIsScanning(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleBarcodeScanned = useCallback((code: string) => {
    setScannedCode(code);
    stopCamera();

    // Search for product by barcode
    const product = products.find((p) => p.barcode === code);
    if (product) {
      setScannedProduct(product);
      toast.success(`Found: ${product.name}`);
    } else {
      toast.error("Product not found for this barcode");
    }
  }, [products]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Try to detect barcode from video frames
  useEffect(() => {
    if (!isScanning || !videoRef.current) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const detectBarcode = async () => {
      if (!videoRef.current || !context) return;

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);

      // Try BarcodeDetector API (Chrome/Edge)
      const detectorCtor = (window as Window & { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector;

      if (detectorCtor) {
        try {
          const barcodeDetector = new detectorCtor({
            formats: ["ean_13", "ean_8", "code_128", "code_39", "upc_a", "upc_e", "qr_code"],
          });
          const barcodes = await barcodeDetector.detect(canvas);
          if (barcodes.length > 0) {
            const code = barcodes[0].rawValue;
            handleBarcodeScanned(code);
            return;
          }
        } catch {
          console.log("Barcode detection not available");
        }
      }

      // Continue scanning
      if (isScanning) {
        requestAnimationFrame(detectBarcode);
      }
    };

    const timer = setTimeout(() => {
      detectBarcode();
    }, 500);

    return () => clearTimeout(timer);
  }, [handleBarcodeScanned, isScanning]);

  const handleManualSearch = () => {
    if (!manualInput.trim()) {
      toast.error("Please enter a barcode");
      return;
    }
    handleBarcodeScanned(manualInput.trim());
  };

  const goToProduct = () => {
    if (scannedProduct) {
      navigate(`/product/${scannedProduct.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-4 px-4 py-3">
          <button
            onClick={() => {
              stopCamera();
              navigate(-1);
            }}
            className="p-2 text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Scan Barcode</h1>
        </div>
      </div>

      <div className="p-4">
        {/* Camera Scanner */}
        {!isScanning ? (
          <div className="bg-card rounded-2xl overflow-hidden shadow-lg mb-6">
            <div className="relative aspect-square bg-black flex items-center justify-center">
              <div className="text-center text-white">
                <Camera className="w-16 h-16 mx-auto mb-4 text-primary" />
                <p className="text-lg font-semibold mb-2">Scan Barcode</p>
                <p className="text-sm text-gray-400 mb-6">
                  Point your camera at a barcode
                </p>
                <button
                  onClick={startCamera}
                  className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Camera className="w-5 h-5" />
                  Start Scanning
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-2xl overflow-hidden shadow-lg mb-6">
            <div className="relative aspect-square bg-black">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              
              {/* Scan overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-4 border-primary rounded-lg relative">
                  {/* Corner markers */}
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />
                  
                  {/* Scanning line animation */}
                  <div className="absolute left-0 right-0 h-0.5 bg-primary/80 animate-pulse" style={{ top: "50%" }} />
                </div>
              </div>

              {/* Stop button */}
              <button
                onClick={stopCamera}
                className="absolute top-4 right-4 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-white text-sm font-medium bg-black/50 inline-block px-4 py-2 rounded-full">
                  Point camera at barcode
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Manual Input */}
        <div className="bg-card rounded-xl p-4 shadow-sm mb-6">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Or Enter Barcode Manually
          </h3>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
                placeholder="Enter barcode number"
                className="w-full pl-10 pr-4 py-3 bg-secondary rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={handleManualSearch}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Scanned Product Result */}
        {scannedProduct && (
          <div className="bg-card rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-foreground mb-3">Scanned Product</h3>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
                <Image
                  src={scannedProduct.images[0]}
                  alt={scannedProduct.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{scannedProduct.name}</h4>
                <p className="text-lg font-bold text-primary mt-1">
                  ${scannedProduct.price.toFixed(2)}
                </p>
                {scannedProduct.originalPrice > scannedProduct.price && (
                  <p className="text-sm text-muted-foreground line-through">
                    ${scannedProduct.originalPrice.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={goToProduct}
              className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              View Product Details
            </button>
          </div>
        )}

        {/* Barcode Info */}
        {scannedCode && !scannedProduct && (
          <div className="bg-warning/10 rounded-xl p-4">
            <p className="text-warning font-medium">
              Barcode: {scannedCode}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Product not found. Try manual search or add this product from admin panel.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
