import mainOne from "../../assets/mainOne.webp"
import mainTwo from "../../assets/mainTwo.jpg"
import mainThree from "../../assets/mainThree.jpg"
import mainFour from "../../assets/mainFour.jpg"

const MaintenancePage = () => {
  return (
    <div className="font-sans text-gray-900">
      {/* Hero Section */}
      <p className="flex h-10 items-center justify-center text-sm font-medium bg-gray-900 text-white">
          💃 Get free delivery on orders over ₦50,000
      </p>
      <section className="bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100">
        <div className="container mx-auto px-6 py-20 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-5xl font-bold mb-6">Welcome to Shally</h1>
            <p className="text-lg mb-6">
              Your premium destination for clothing and body enhancement
              products. Our official website will be launching soon! Get ready
              to explore our full range of services and elevate your style.
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition">
              Coming Soon
            </button>
          </div>
          <div className="lg:w-1/2">
            <img
              src={mainOne}
              alt="Shally Products"
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-purple-400 transition">
            <img
              src={mainTwo}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">
                Body Sculpting Cream
              </h3>
              <p className="text-gray-600 mb-4">
                Enhance your natural curves and boost confidence with our
                premium body sculpting cream.
              </p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition">
                Coming Soon
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-purple-400 transition">
            <img
              src={mainThree}
              alt="Product 2"
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Slim Fit Clothing</h3>
              <p className="text-gray-600 mb-4">
                Comfortable, stylish, and perfect for any occasion. Designed to
                fit your body perfectly.
              </p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition">
                Coming Soon
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-purple-400 transition">
            <img
              src={mainFour}
              alt="Product 3"
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Posture Corrector</h3>
              <p className="text-gray-600 mb-4">
                Improve your posture and appearance effortlessly with our
                ergonomic posture corrector.
              </p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition">
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-purple-50 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Why Choose Shally?</h2>
          <p className="text-gray-700 mb-12 max-w-2xl mx-auto">
            Shally provides high-quality clothing and body enhancement products
            with a focus on style, comfort, and customer satisfaction. Your
            confidence is our mission!
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-purple-400 transition flex-1 min-w-[250px] max-w-xs">
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Only the best materials for lasting results.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-purple-400 transition flex-1 min-w-[250px] max-w-xs">
              <h3 className="text-xl font-semibold mb-2">Customer Support</h3>
              <p className="text-gray-600">
                We are here to help you 24/7 with any queries.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-purple-400 transition flex-1 min-w-[250px] max-w-xs">
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-gray-600">
                Quick and reliable delivery straight to your door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-black py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Get Ready for Shally!</h2>
          <p className="mb-6">
            Our official website will be launching soon. Stay tuned to explore
            our services!
          </p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Coming Soon
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-6 text-center">
          <p className="mb-4">© 2025 Shally. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="hover:text-purple-400">
              Instagram
            </a>
            <a href="#" className="hover:text-purple-400">
              Facebook
            </a>
            <a href="#" className="hover:text-purple-400">
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MaintenancePage;
