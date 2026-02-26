import { useContext } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import myContext from "../../../context/data/myContext";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaUser, FaCartPlus } from "react-icons/fa";
import { AiFillShopping } from "react-icons/ai";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import logo from "../../../assets/logo.png";
import html2canvas from "html2canvas";
import UsersTab from "./UsersTab";
import DisputeTab from "./DisputeTab";
import UnreleasedItemsTab from "./UnreleasedItemsTab";

function DashboardTab() {
  const context = useContext(myContext);
  const { mode, product, editHandle, deleteProduct, order, user } = context;

  // Converts Firestore Timestamp to a readable date string
  const timestampToDate = (timestamp) => {
    if (!timestamp) return ""; // no timestamp
    // Firestore Timestamp object
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }
    // Already a Date or string
    return new Date(timestamp).toLocaleString();
  };

  const add = () => {
    window.location.href = "/addproduct";
  };

  const noDataStyle = {
    color: mode === "dark" ? "white" : "black",
    backgroundColor: mode === "dark" ? "rgb(46 49 55)" : "#f9fafb",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    textAlign: "center",
    fontSize: "1.1rem",
    fontWeight: "500",
  };

  // ✅ Check if order date is today
  const isToday = (dateInput) => {
    if (!dateInput) return false;

    let orderDate;

    // Firestore Timestamp
    if (dateInput.seconds) {
      orderDate = new Date(dateInput.seconds * 1000);
    } else if (dateInput.toDate) {
      orderDate = dateInput.toDate();
    } else if (dateInput instanceof Date) {
      orderDate = dateInput;
    } else if (typeof dateInput === "string") {
      orderDate = new Date(dateInput);
      if (isNaN(orderDate.getTime())) return false;
    } else {
      return false; // unsupported type
    }

    const today = new Date();
    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  };

  // ✅ Generate Attractive PDF Receipt
  const downloadReceipt = async (orderIndex) => {
    const element = document.getElementById(`order-receipt-${orderIndex}`);
    if (!element) return;

    // ✅ Force desktop-like rendering so size looks same across all devices
    const canvas = await html2canvas(element, {
      scale: 2,
      width: 1200, // 👈 Force large width for consistent PDF size
      windowWidth: 1200, // 👈 Pretend the screen width is large
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190;
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // 🧾 Add Logo
    const logoWidth = 30;
    const logoHeight = 30;
    pdf.addImage(logo, "PNG", 15, 10, logoWidth, logoHeight);

    // 🛍️ Add Header
    pdf.setFontSize(18);
    pdf.setTextColor(40, 40, 40);
    pdf.text("ALLMART STORE", 105, 20, { align: "center" });
    pdf.setFontSize(12);
    pdf.text("Official Order Receipt", 105, 27, { align: "center" });
    pdf.line(15, 32, 195, 32);

    // 📦 Add Order Content Screenshot
    let position = 40;
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // ➕ Handle Multiple Pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // ❤️ Add Footer
    pdf.setFontSize(11);
    pdf.setTextColor(70, 70, 70);
    pdf.text("Thank you for shopping in AllMart Store!", 105, 290, {
      align: "center",
    });
    pdf.text("www.allmart.com.ng | allmart@gmail.com", 105, 296, {
      align: "center",
    });

    // 💾 Save PDF
    pdf.save(`Order_Receipt_${orderIndex + 1}.pdf`);
  };

  return (
    <div className="container mx-auto">
      <div className="tab container mx-auto">
        <Tabs defaultIndex={0}>
          {/* ===== Tabs Header ===== */}
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
                  <FaUser /> AllUsers
                </div>
              </button>
            </Tab>
            <Tab>
              <button
                type="button"
                className="font-medium border-b-2 border-red-500 bg-[#605d5d12] text-red-500 rounded-lg text-xl hover:shadow-red-700 shadow-[inset_0_0_8px_rgba(0,0,0,0.6)] px-5 py-1.5 text-center"
              >
                <div className="flex gap-2 items-center">
                  <FaUser /> Dispute
                </div>
              </button>
            </Tab>
            <Tab>
              <button
                type="button"
                className="font-medium border-b-2 border-orange-500 bg-[#605d5d12] text-orange-500 rounded-lg text-xl hover:shadow-orange-700 shadow-[inset_0_0_8px_rgba(0,0,0,0.6)] px-5 py-1.5 text-center"
              >
                Unreleased
              </button>
            </Tab>
          </TabList>

          {/* ===== Products Tab ===== */}
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
                  className="focus:outline-none text-white bg-pink-600 hover:bg-pink-700 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
                >
                  <div className="flex gap-2 items-center">
                    Add Product <FaCartPlus size={20} />
                  </div>
                </button>
              </div>

              {product.length === 0 ? (
                <div style={noDataStyle}>
                  🚀 No products available yet. Start adding some amazing items!
                </div>
              ) : (
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead
                      className="text-xs uppercase"
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
                      {product.map((item, index) => (
                        <tr
                          key={item.id || index}
                          style={{
                            backgroundColor:
                              mode === "dark" ? "rgb(46 49 55)" : "#fafafa",
                            color: mode === "dark" ? "white" : "",
                          }}
                        >
                          <td className="px-6 py-4">{index + 1}</td>
                          <td className="px-6 py-4">
                            <img
                              src={item.imageUrl}
                              className="w-16 h-16 rounded object-cover"
                            />
                          </td>
                          <td className="px-6 py-4">{item.title}</td>
                          <td className="px-6 py-4">₦{item.price}</td>
                          <td className="px-6 py-4">{item.category}</td>
                          <td className="px-6 py-4">{item.date}</td>
                          <td className="px-6 py-4 flex gap-3">
                            <button
                              onClick={() => deleteProduct(item)}
                              className="text-red-500 hover:text-red-700"
                            >
                              🗑️
                            </button>
                            <Link to="/updateproduct">
                              <button
                                onClick={() => editHandle(item)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                ✏️
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabPanel>

          {/* ===== Orders Tab ===== */}
          <TabPanel>
            <div className="relative overflow-x-auto mb-16 px-4 sm:px-0">
              <h1
                className="text-center mb-5 text-3xl font-semibold underline"
                style={{ color: mode === "dark" ? "white" : "" }}
              >
                Order Receipts
              </h1>

              {order.length === 0 ? (
                <div style={noDataStyle}>🛍️ No orders placed yet.</div>
              ) : (
                order.map((allorder, i) => (
                  <div key={i} className="mb-10">
                    <div className="flex justify-end -mb-3">
                      <button
                        onClick={() => downloadReceipt(i)}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 text-sm font-semibold shadow-md"
                      >
                        📄 Download Receipt
                      </button>
                    </div>

                    <div
                      id={`order-receipt-${i}`}
                      className="border rounded-xl p-6 shadow-lg bg-white"
                      style={{
                        backgroundColor:
                          mode === "dark" ? "rgb(46 49 55)" : "white",
                        color: mode === "dark" ? "white" : "black",
                      }}
                    >
                      {/* Header */}
                      <div className="text-center mb-6 border-b pb-4">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
                          alt="Logo"
                          className="mx-auto w-16 mb-2"
                        />
                        <h2 className="text-2xl font-bold text-pink-600">
                          ALLMART STORE
                        </h2>
                        <p className="text-gray-400 text-sm">
                          Ikeja, Lagos State Nigeria 🇳🇬
                        </p>
                      </div>

                      {/* Order Items */}
                      <table className="w-full text-sm text-left mb-4 border-t">
                        <thead className="bg-pink-100 text-gray-700">
                          <tr>
                            <th className="px-4 py-2">Item</th>
                            <th className="px-4 py-2">Category</th>
                            <th className="px-4 py-2">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allorder.cartItems.map((item, j) => (
                            <tr key={j} className="border-b">
                              <td className="px-4 py-3 flex items-center gap-3">
                                <img
                                  src={item.imageUrl}
                                  alt=""
                                  className="w-10 h-10 rounded object-cover"
                                />
                                <span>{item.title}</span>
                              </td>
                              <td className="px-4 py-3">{item.category}</td>
                              <td className="px-4 py-3 font-semibold">
                                ₦{item.price}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Customer + Order Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h3 className="font-semibold text-lg mb-1 text-pink-600">
                            Customer Details
                          </h3>
                          <p>
                            <strong>Name:</strong> {allorder.addressInfo?.name}
                          </p>
                          <p>
                            <strong>Address:</strong>{" "}
                            {allorder.addressInfo?.address}
                          </p>
                          <p>
                            <strong>Phone:</strong>{" "}
                            {allorder.addressInfo?.phoneNumber}
                          </p>
                          <p>
                            <strong>Email:</strong> {allorder.email}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1 text-pink-600">
                            Order Info
                          </h3>
                          <p>
                            <strong>Payment ID:</strong> {allorder.paymentId}
                          </p>
                          <p>
                            <strong>Date:</strong>{" "}
                            {timestampToDate(allorder.date)}
                          </p>

                          {isToday(allorder.date) && (
                            <p className="text-green-500 font-semibold mt-1">
                              🆕 New Order (Today)
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="border-t mt-6 pt-4 text-center">
                        <p className="text-pink-600 font-semibold">
                          Thank you for your purchase! 💖
                        </p>
                        <p className="text-gray-400 text-sm">
                          Your satisfaction is our priority.
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabPanel>

          {/* ===== Users Tab ===== */}
          <TabPanel>
            <UsersTab mode={mode} />
          </TabPanel>
          {/* ===== Dispute Tab ===== */}
          <TabPanel>
            <DisputeTab mode={mode} />
          </TabPanel>
          <TabPanel>
            <UnreleasedItemsTab mode={mode} />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}

export default DashboardTab;
