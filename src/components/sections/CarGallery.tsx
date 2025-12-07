import React, { useState, Suspense } from 'react';
import { ChevronLeft, ChevronRight, X, Camera, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CarViewer3D } from '../ui/CarViewer3D';

interface CarGalleryProps {
  images: string[];
  has3DModel?: boolean;
}

export const CarGallery: React.FC<CarGalleryProps> = ({ images, has3DModel = false }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'photos' | '3d'>('photos');

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="glass-effect rounded-xl overflow-hidden mb-6">
        {has3DModel && (
          <div className="flex border-b border-dark-700 glass-effect-light">
            <button
              onClick={() => setViewMode('photos')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                viewMode === 'photos'
                  ? 'bg-yellow-500/20 text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              Фотографии
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                viewMode === '3d'
                  ? 'bg-yellow-500/20 text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Box className="w-4 h-4" />
              3D модель
            </button>
          </div>
        )}
        <div className="relative aspect-video">
          {viewMode === 'photos' ? (
            <>
              <img
                src={images[currentImage]}
                alt="Car"
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setIsFullscreen(true)}
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImage ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-gray-500">Загрузка 3D модели...</div>
              </div>
            }>
              <CarViewer3D className="w-full h-full" />
            </Suspense>
          )}
        </div>

        {images.length > 1 && viewMode === 'photos' && (
          <div className="p-4 grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentImage ? 'border-yellow-400' : 'border-transparent'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <img
              src={images[currentImage]}
              alt="Car fullscreen"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
                >
                  <ChevronRight className="w-8 h-8 text-white" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};