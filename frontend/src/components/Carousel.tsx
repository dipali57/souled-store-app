// components/HeroCarousel.tsx
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselItem {
  id: number;
  image: string;
}

const carouselData: CarouselItem[] = [
    { id: 1, image: "/src/assets/homepage-ga.avif"},
    { id: 2, image: "/src/assets/home1.avif"},
    { id: 3, image: "/src/assets/homepage-gb.avif"},
    { id: 4, image: "/src/assets/homepage-gc.avif"},
    { id: 5, image: "/src/assets/homepage-gd.avif"},
];

export const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
  let interval: ReturnType<typeof setTimeout>;
    
    if (isAutoPlaying) {
      interval = setInterval(() => {
        goToNext();
      }, 5000); // Change slide every 5 seconds
    }

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? carouselData.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === carouselData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div 
      className="relative w-full h-[450px] overflow-hidden group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Images */}
      <div 
        className="relative w-full h-full"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: 'transform 0.7s ease-in-out',
          display: 'flex'
        }}
      >
        {carouselData.map((item) => (
          <div key={item.id} className="w-full h-full flex-shrink-0 relative">
            <img src={item.image} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {carouselData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};