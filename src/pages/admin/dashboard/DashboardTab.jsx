import { useContext } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import myContext from "../../../context/data/myContext";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaUser, FaCartPlus } from "react-icons/fa";
import { AiFillShopping } from "react-icons/ai";
import { Link } from "react-router-dom";

function DashboardTab() {
  const context = useContext(myContext);
  const { mode, product, edithandle, deleteProduct, order, user } = context;

  const add = () => {
    window.location.href = "/addproduct";
  };

  return (
    <div className="container mx-auto">
      <div className="tab container mx-auto">
        <Tabs defaultIndex={0}>
          {/* Tab Headers */}
          <TabList className="md:flex md:space-x-8 grid grid-cols-2 text-center gap-4 md:justify-center mb-10">
            <Tab>
              <button
                type="button"
                className="font-medium border-b-2 hover:shadow-purple-700 border-purple-500 text-purple-500 rounded-lg text-xl shadow-[inset_0_0_8px_rgba(0,0,0,0.6)] px-5 py-1.5 text-center bg-[#605d5d12]"
              >
                <div className="flex gap-2 items-center">
                  <MdOutlineProductionQuantityLimits /> Products
                </div>
              </button>
            </Tab>
            <Tab>
              <button
                type="button"
                className="font-medium border-b-2 border-pink-500 bg-[#605d5d12] text-pink-500 hover:shadow-pink-700 rounded-lg text-xl shadow-[inset_0_0_8px_rgba(0,0,0,0.6)] px-5 py-1.5 text-center"
              >
                <div className="flex gap-2 items-center">
                  <AiFillShopping /> Orders
                </div>
              </button>
            </Tab>
            <Tab>
              <button
                type="button"
                className="font-medium border-b-2 border-green-500 bg-[#605d5d12] text-green-500 rounded-lg text-xl hover:shadow-green-700 shadow-[inset_0_0_8px_rgba(0,0,0,0.6)] px-5 py-1.5 text-center"
              >
                <div className="flex gap-2 items-center">
                  <FaUser /> Users
                </div>
              </button>
            </Tab>
          </TabList>

          {/* Products Tab */}
          <TabPanel>
            <div className="px-4 md:px-0 mb-16">
              <h1
                className="text-center mb-5 text-3xl font-semibold underline"
                style={{ color: mode === "dark" ? "white" : "" }}
              >
                Product Details
              </h1>
              <div className="flex justify-end">
                <button
                  onClick={add}
                  type="button"
                  className="focus:outline-none text-white bg-pink-600 shadow-[inset_0_0_10px_rgba(0,0,0,0.6)] border hover:bg-pink-700 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
                  style={{
                    backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
                    color: mode === "dark" ? "white" : "",
                  }}
                >
                  <div className="flex gap-2 items-center">
                    Add Product <FaCartPlus size={20} />
                  </div>
                </button>
              </div>

              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead
                    className="text-xs border border-gray-600 text-black uppercase bg-gray-200 shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]"
                    style={{
                      backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
                      color: mode === "dark" ? "white" : "",
                    }}
                  >
                    <tr>
                      <th className="px-6 py-3">S.No</th>
                      <th className="px-6 py-3">Image</th>
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3">Price</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.map((item, index) => {
                      const { title, price, imageUrl, category, date } = item;
                      return (
                        <tr
                          key={item.id || index}
                          className="bg-gray-50 border-b dark:border-gray-700"
                          style={{
                            backgroundColor:
                              mode === "dark" ? "rgb(46 49 55)" : "",
                            color: mode === "dark" ? "white" : "",
                          }}
                        >
                          <td className="px-6 py-4">{index + 1}.</td>
                          <td className="px-6 py-4">
                            <img
                              className="w-16 rounded"
                              src={imageUrl}
                              alt="product"
                            />
                          </td>
                          <td className="px-6 py-4">{title}</td>
                          <td className="px-6 py-4">#{price}</td>
                          <td className="px-6 py-4">{category}</td>
                          <td className="px-6 py-4">{date}</td>
                          <td className="px-6 py-4 flex gap-3">
                            <button
                              onClick={() => deleteProduct(item)}
                              className="text-red-500 hover:text-red-700"
                            >
                              🗑️
                            </button>
                            <Link to="/updateproduct">
                              <button
                                onClick={() => edithandle(item)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                ✏️
                              </button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </TabPanel>

          {/* Orders Tab */}
          <TabPanel>
            <div className="relative overflow-x-auto mb-16">
              <h1
                className="text-center mb-5 text-3xl font-semibold underline"
                style={{ color: mode === "dark" ? "white" : "" }}
              >
                Order Details
              </h1>

              {order.map((allorder, i) => (
                <table
                  key={i}
                  className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-8"
                >
                  <thead
                    className="text-xs text-black uppercase bg-gray-200"
                    style={{
                      backgroundColor:
                        mode === "dark" ? "rgb(46 49 55)" : "",
                      color: mode === "dark" ? "white" : "",
                    }}
                  >
                    <tr>
                      <th className="px-6 py-3">Payment Id</th>
                      <th className="px-6 py-3">Image</th>
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3">Price</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Address</th>
                      <th className="px-6 py-3">Pincode</th>
                      <th className="px-6 py-3">Phone</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allorder.cartItems.map((item, j) => (
                      <tr
                        key={j}
                        className="bg-gray-50 border-b dark:border-gray-700"
                        style={{
                          backgroundColor:
                            mode === "dark" ? "rgb(46 49 55)" : "",
                          color: mode === "dark" ? "white" : "",
                        }}
                      >
                        <td className="px-6 py-4">{allorder.paymentId}</td>
                        <td className="px-6 py-4">
                          <img
                            className="w-16 rounded"
                            src={item.imageUrl}
                            alt="order"
                          />
                        </td>
                        <td className="px-6 py-4">{item.title}</td>
                        <td className="px-6 py-4">#{item.price}</td>
                        <td className="px-6 py-4">{item.category}</td>
                        <td className="px-6 py-4">
                          {allorder.addressInfo?.name}
                        </td>
                        <td className="px-6 py-4">
                          {allorder.addressInfo?.address}
                        </td>
                        <td className="px-6 py-4">
                          {allorder.addressInfo?.pincode}
                        </td>
                        <td className="px-6 py-4">
                          {allorder.addressInfo?.phoneNumber}
                        </td>
                        <td className="px-6 py-4">{allorder.email}</td>
                        <td className="px-6 py-4">{allorder.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}
            </div>
          </TabPanel>

          {/* Users Tab */}
          <TabPanel>
            <div className="relative overflow-x-auto mb-10">
              <h1
                className="text-center mb-5 text-3xl font-semibold underline"
                style={{ color: mode === "dark" ? "white" : "" }}
              >
                User Details
              </h1>
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead
                  className="text-xs text-black uppercase bg-gray-200"
                  style={{
                    backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "",
                    color: mode === "dark" ? "white" : "",
                  }}
                >
                  <tr>
                    <th className="px-6 py-3">S.No</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">UID</th>
                  </tr>
                </thead>
                <tbody>
                  {user.map((item, index) => (
                    <tr
                      key={item.uid || index}
                      className="bg-gray-50 border-b dark:border-gray-700"
                      style={{
                        backgroundColor:
                          mode === "dark" ? "rgb(46 49 55)" : "",
                        color: mode === "dark" ? "white" : "",
                      }}
                    >
                      <td className="px-6 py-4">{index + 1}.</td>
                      <td className="px-6 py-4">{item.name}</td>
                      <td className="px-6 py-4">{item.email}</td>
                      <td className="px-6 py-4">{item.date}</td>
                      <td className="px-6 py-4">{item.uid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}

export default DashboardTab;
