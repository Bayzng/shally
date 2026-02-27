import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import myContext from "../../context/data/myContext";

export default function HeroSection() {
  const { mode } = useContext(myContext); // Get mode from context
  const isAuthenticated = localStorage.getItem("user");

  // Slides for mobile carousel
  const slides = [
    {
      title: "📦 Discover Amazing Deals",
      subtitle: "Top products across all categories",
      image:
        "https://www.aumcore.com/wp-content/uploads/2023/10/Boosting-Your-Ecommerce-Store-The-10-Best-Marketing-Strategies.jpg",
      cta: "#",
    },
    {
      title: "🛍️ Shop What You Love",
      subtitle: "Find your next must-have items",
      image:
        "https://img.freepik.com/premium-photo/woman-is-sitting-globe-with-clock-city-background_984237-89720.jpg?semt=ais_hybrid&w=740&q=80",
      cta: "#",
    },
    {
      title: "🚚 Fast Shipping & Support",
      subtitle: "Quality service from start to finish",
      image:
        "https://kinsta.com/wp-content/uploads/2024/08/performance-requirements-and-10-best-practices-for-high-speed-ecommerce-websites-1024x512.png",
      // image: image,
      cta: "#",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Comments for desktop hero
  const comments = [
    {
      text: "Absolutely love the experience!",
      author: "@adebayo",
      color: "bg-cyan-400",
      top: "15%",
      left: "10%",
      rotate: "-3deg",
    },
    {
      text: "Seamless and intuitive!",
      author: "@mimisola",
      color: "bg-pink-500",
      top: "15%",
      left: "75%",
      rotate: "2deg",
    },
    {
      text: "Elegant and premium!",
      author: "@rayhaan",
      color: "bg-yellow-400",
      top: "70%",
      left: "10%",
      rotate: "-1deg",
    },
    {
      text: "Best online shopping ever.",
      author: "@zee",
      color: "bg-purple-400",
      top: "75%",
      left: "75%",
      rotate: "3deg",
    },
    // { text: "Curated collections are amazing!", author: "@rayhaan", color: "bg-green-400", top: "40%", left: "90%", rotate: "-2deg" },
  ];

  const bgColor = mode === "dark" ? "bg-gray-900" : "bg-gray-50";
  const textColor = mode === "dark" ? "text-white" : "text-gray-900";
  const subTextColor = mode === "dark" ? "text-gray-300" : "text-gray-700";

  return (
    <section className={`relative w-full ${bgColor} overflow-hidden`}>
      {/* ---------- MOBILE HERO (SMALL SCREENS) ---------- */}
      <div className="block md:hidden w-full h-[250px] sm:h-[350px]">
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
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center text-white px-4">
              <h1 className="text-2xl sm:text-3xl font-bold drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="mt-2 text-sm sm:text-base drop-shadow">
                {slide.subtitle}
              </p>
              <a
                onClick={() =>
                  window.scrollTo({
                    top: window.innerHeight,
                    behavior: "smooth",
                  })
                }
                href={slide.cta}
                className="mt-4 inline-block bg-pink-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-pink-700 transition"
              >
                Shop Now 🛒
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- DESKTOP HERO (BIG SCREENS) ---------- */}
      <div className="hidden md:flex relative w-full h-screen flex-col justify-center items-center px-6 text-center">
        {/* Floating gradient shapes */}
        <div className="absolute w-full h-full top-0 left-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                background: `linear-gradient(135deg, hsl(${Math.random() * 360}, 70%, 60%), hsl(${Math.random() * 360}, 80%, 70%))`,
                animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Hero Text */}
        <h1
          className={`relative text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-pink-400 animate-textGlow leading-tight tracking-tight z-10 drop-shadow-lg`}
        >
          Elevate Your <span className={textColor}>Shopping Experience</span>
        </h1>

        <p
          className={`mt-6 text-xl md:text-2xl max-w-3xl drop-shadow-lg animate-fadeIn z-10 ${subTextColor}`}
        >
          Discover premium deals, curated collections, and a seamless online
          experience{" "}
          <span className="text-cyan-400 font-semibold">
            all at your fingertips.
          </span>
        </p>

        {/* Call to Action */}
        {/* Call to Action */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 animate-fadeIn delay-200 z-10">
          {/* GET STARTED / EXPLORE BUTTON */}
          {isAuthenticated ? (
            <button
              onClick={() =>
                window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
              }
              className="px-12 py-4 bg-cyan-400 text-gray-900 font-bold rounded-full shadow-2xl hover:scale-110 transition-transform duration-300"
            >
              Explore
            </button>
          ) : (
            <Link to="/signup" className="w-full sm:w-auto">
              <button className="px-12 py-4 bg-cyan-400 text-gray-900 font-bold rounded-full shadow-2xl hover:scale-110 transition-transform duration-300">
                Get Started
              </button>
            </Link>
          )}

          {/* MARKETPLACE BUTTON */}
          <Link to={isAuthenticated ? "/allproducts" : "/login"}>
            <button className="px-12 py-4 border-2 border-cyan-400 text-cyan-400 font-bold rounded-full shadow-2xl hover:scale-110 transition-transform duration-300">
              Marketplace
            </button>
          </Link>
        </div>

        {/* Floating side comments */}
        {comments.map((comment, index) => (
          <div
            key={index}
            className={`absolute ${comment.color} text-gray-900 p-4 rounded-2xl shadow-2xl max-w-xs text-sm md:text-base`}
            style={{
              top: comment.top,
              left: comment.left,
              transform: `translate(-50%, 0) rotate(${comment.rotate})`,
              animation: `float 6s ease-in-out infinite alternate`,
              animationDelay: `${index * 0.5}s`,
              zIndex: 5,
            }}
          >
            <p className="italic font-medium">“{comment.text}”</p>
            <span className="block text-gray-100 mt-1 text-xs">
              {comment.author}
            </span>
          </div>
        ))}

        {/* Animations */}
        <style jsx>{`
          @keyframes textGlow {
            0%,
            100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          .animate-textGlow {
            background-size: 200% 200%;
            animation: textGlow 6s ease infinite;
          }

          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 1.5s ease forwards;
          }

          @keyframes float {
            0% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-15px);
            }
            100% {
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </section>
  );
}
