import mainOne from "../../assets/mainOne.webp";
import mainTwo from "../../assets/mainTwo.jpg";
import mainThree from "../../assets/mainThree.jpg";
import mainFour from "../../assets/mainFour.jpg";

const MaintenancePage = () => {
  return (
    <div className="font-sans text-gray-900">
      {/* Notification Bar */}
      <p
        className="
    flex 
    flex-wrap
    items-center 
    justify-center 
    text-xs 
    sm:text-sm 
    md:text-base 
    font-medium 
    bg-gray-900 
    text-white 
    text-center 
    px-3 
    py-2
    leading-relaxed
  "
      >
        🛠️ Allmart is currently running in{" "}
        <span className="mx-1 text-yellow-400 font-semibold">
          Development Mode
        </span>
        some features are not fully available.
      </p>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100">
        <div className="container mx-auto px-6 py-20 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-5xl font-bold mb-6">Welcome to Allmart</h1>
            <p className="text-lg mb-6">
              We’re currently fine-tuning our official website and testing new
              features to ensure the best experience for you. Explore what’s
              coming and stay connected for our full launch soon!
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition">
              In Development 🚧
            </button>
          </div>
          <div className="lg:w-1/2">
            <img
              src={mainOne}
              alt="Allmart Preview"
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Preview of Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-purple-400 transition">
            <img
              src={mainTwo}
              className="w-full h-64 object-cover"
              alt="Product"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">
                Body Sculpting Cream
              </h3>
              <p className="text-gray-600 mb-4">
                One of our upcoming bestsellers — enhance your natural curves
                and confidence. Currently being optimized.
              </p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition">
                Under Review
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
                A sneak peek of our premium fashion line. Comfortable, stylish,
                and still in testing phase.
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
                Improve your posture effortlessly — this product is being
                finalized and tested for release.
              </p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition">
                Testing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-purple-50 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Allmart in Progress 🚀</h2>
          <p className="text-gray-700 mb-12 max-w-2xl mx-auto">
            We’re currently enhancing our platform to serve you better. Expect
            smoother navigation, better product selection, and a richer
            experience on full launch!
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-purple-400 transition flex-1 min-w-[250px] max-w-xs">
              <h3 className="text-xl font-semibold mb-2">Ongoing Updates</h3>
              <p className="text-gray-600">
                We’re testing features and fixing minor bugs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-purple-400 transition flex-1 min-w-[250px] max-w-xs">
              <h3 className="text-xl font-semibold mb-2">User Feedback</h3>
              <p className="text-gray-600">
                Your opinions help shape the final experience.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-purple-400 transition flex-1 min-w-[250px] max-w-xs">
              <h3 className="text-xl font-semibold mb-2">Launch Preparation</h3>
              <p className="text-gray-600">
                We’re gearing up for the official release soon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-6 text-center">
          <p className="mb-2 text-yellow-400 font-medium">
            ⚙️ This site is currently running in Development Mode
          </p>
          <p className="mb-4 text-sm">© 2025 Allmart. All rights reserved.</p>
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
