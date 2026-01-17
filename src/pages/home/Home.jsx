import Layout from "../../components/layout/Layout";
import HeroSection from "../../components/heroSection/HeroSection";
import Filter from "../../components/filter/Filter";
import ProductCard from "../../components/productCard/ProductCard";
// import Track from "../../components/track/Track";
// import Testimonial from "../../components/testimonial/Testimonial";
// import Alert from "../../components/Alert";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Layout>
      <div>
        <HeroSection />
        <Filter />
        <ProductCard />
        {/* <div className="flex justify-center -mt-3 mb-4">
          <Link to={"/allproducts"}>
            <button className="bg-gray-300 px-5 py-2 rounded-xl">
              See more
            </button>
          </Link>
        </div> */}
        {/* <Track /> */}
        {/* <Testimonial /> */}
        {/* <Alert /> */}
      </div>
    </Layout>
  );
}

export default Home;
