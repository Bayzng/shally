import { useState, useEffect } from "react";
import image from "../../assets/ecommerce.png.webp";

const slides = [
  {
    title: "📦 Discover Amazing Deals",
    subtitle: "Top products across all categories",
    image:
      "https://deerdesigner.com/wp-content/uploads/2024/05/Article-34-ecommerce-design-01.png", // (replace with a real marketplace image)
    cta: "/allproducts",
  },
  {
    title: "🛍️ Shop What You Love",
    subtitle: "Find your next must-have items",
    image:
      "https://img.freepik.com/premium-photo/woman-is-sitting-globe-with-clock-city-background_984237-89720.jpg?semt=ais_hybrid&w=740&q=80", // (replace with another image)
    cta: "/allproducts",
  },
  {
    title: "🚚 Fast Shipping & Support",
    subtitle: "Quality service from start to finish",
    image: image, // (replace with another image)
    cta: "/allproducts",
  },
];

function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden h-[250px] sm:h-[350px] md:h-[500px] lg:h-[600px]">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />

          {/* Overlay with text */}
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center text-white px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg">
              {slide.title}
            </h1>
            <p className="mt-2 text-sm sm:text-base md:text-lg drop-shadow">
              {slide.subtitle}
            </p>
            <a
              href={slide.cta}
              className="mt-4 inline-block bg-pink-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-pink-700 transition"
            >
              Shop Now 🛒
            </a>
          </div>
        </div>
      ))}

      {/* Slide indicators */}
      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full ${
              current === idx ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div> */}
    </div>
  );
}

export default HeroSection;
