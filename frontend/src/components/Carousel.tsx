// components/HeroCarousel.tsx
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselItem {
  id: number;
  image: string;
}

const carouselData: CarouselItem[] = [
  { id: 1, image: "/src/assets/homepage-ga.avif" },
  { id: 2, image: "/src/assets/home1.avif" },
  { id: 3, image: "/src/assets/homepage-gb.avif" },
  { id: 4, image: "/src/assets/homepage-gc.avif" },
  { id: 5, image: "/src/assets/homepage-gd.avif" },
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
      prevIndex === 0 ? carouselData.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselData.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className="
    relative w-full 
    h-[220px] 
    sm:h-[300px] 
    md:h-[380px] 
    lg:h-[450px] 
    overflow-hidden group
  "
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Images */}
      <div
        className="relative w-full h-full flex"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: "transform 0.7s ease-in-out",
        }}
      >
        {carouselData.map((item) => (
          <div key={item.id} className="w-full h-full flex-shrink-0">
            <img src={item.image} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* LEFT ARROW */}
      <button
        onClick={goToPrevious}
        className="
      absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 
      bg-white/80 hover:bg-white text-gray-800 
      p-2 sm:p-3 rounded-full
      opacity-100 sm:opacity-0 sm:group-hover:opacity-100
      transition shadow-lg
    "
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={goToNext}
        className="
      absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 
      bg-white/80 hover:bg-white text-gray-800 
      p-2 sm:p-3 rounded-full
      opacity-100 sm:opacity-0 sm:group-hover:opacity-100
      transition shadow-lg
    "
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
        {carouselData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`
          h-2 rounded-full transition-all duration-300
          ${
            index === currentIndex
              ? "bg-white w-6 sm:w-8"
              : "bg-white/50 hover:bg-white/80 w-2"
          }
        `}
          />
        ))}
      </div>
    </div>
  );
};
