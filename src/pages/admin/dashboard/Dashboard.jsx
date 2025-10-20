import { useContext } from "react";
import { FaUser, FaBox, FaShoppingCart, FaDollarSign } from "react-icons/fa";
import myContext from "../../../context/data/myContext";
import Layout from "../../../components/layout/Layout";
import DashboardTab from "./DashboardTab";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  const context = useContext(myContext);
  const { mode, product, order, user } = context;

  // ✅ Real-time totals
  const totalProducts = product?.length || 0;
  const totalOrders = order?.length || 0;
  const totalUsers = user?.length || 0;

  // ✅ Calculate total revenue (including ₦100 shipping per order)
  const totalRevenue = order?.reduce((acc, o) => {
    if (o.cartItems && Array.isArray(o.cartItems)) {
      const itemTotal = o.cartItems.reduce(
        (sum, item) => sum + (Number(item.price) || 0),
        0
      );
      const shipping = 100; // Flat shipping rate
      return acc + itemTotal + shipping;
    }
    return acc;
  }, 0);

  // ✅ Toast (avoid duplicates)
  toast.dismiss();
  toast.info("Dashboard data loaded successfully!", {
    position: "top-right",
    autoClose: 2000,
  });

  // ✅ Styling
  const cardStyle = {
    backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
    color: mode === "dark" ? "white" : "",
  };

  // ✅ Dashboard stats
  const stats = [
    {
      icon: <FaBox size={50} />,
      title: "Total Products",
      value: totalProducts,
      color: "text-purple-500",
    },
    {
      icon: <FaShoppingCart size={50} />,
      title: "Total Orders",
      value: totalOrders,
      color: "text-pink-500",
    },
    {
      icon: <FaUser size={50} />,
      title: "Total Users",
      value: totalUsers,
      color: "text-green-500",
    },
    {
      icon: <FaDollarSign size={50} />,
      title: "Total Revenue",
      value: `₦${totalRevenue.toLocaleString()}`,
      color: "text-yellow-500",
    },
  ];

  return (
    <Layout>
      <div className="flex items-center justify-center mt-10">
        <h1 className="text-4xl font-bold text-white text-center">
          Admin Page
        </h1>
      </div>
      <section className="text-gray-600 body-font mt-10 mb-10">
        <div className="container px-5 mx-auto mb-10">
          <div className="flex flex-wrap -m-4 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-4 md:w-1/4 sm:w-1/2 w-full">
                <div
                  className="border-2 hover:shadow-lg shadow-[inset_0_0_10px_rgba(0,0,0,0.6)] bg-gray-100 border-gray-300 px-4 py-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1"
                  style={cardStyle}
                >
                  <div className={`${stat.color} w-12 h-12 mb-3 inline-block`}>
                    {stat.icon}
                  </div>
                  <h2
                    className="title-font font-medium text-3xl text-black"
                    style={{ color: mode === "dark" ? "white" : "" }}
                  >
                    {stat.value}
                  </h2>
                  <p
                    className={`font-bold ${stat.color}`}
                    style={{ color: mode === "dark" ? "white" : "" }}
                  >
                    {stat.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 📊 Detailed Tabs Section */}
        <DashboardTab />
      </section>
    </Layout>
  );
}

export default Dashboard;
