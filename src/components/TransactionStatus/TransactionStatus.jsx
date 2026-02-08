import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import allMartLogo from "../../assets/logo.png";

function TransactionStatus() {
  const location = useLocation();
  const navigate = useNavigate();

  const { status, reference, total, cartItems, addressInfo } =
    location.state || {};

  // 🔹 Toast for transaction status
  useEffect(() => {
    if (!status) return;

    if (status === "success") {
      toast.success("✅ Payment Successful!", {
        style: {
          minWidth: "300px",
          fontSize: "16px",
          textAlign: "center",
        },
      });
    } else if (status === "failed") {
      toast.error("❌ Payment Failed");
    } else if (status === "cancelled") {
      toast("⚠️ Payment Cancelled");
    }
  }, [status]);

  const downloadReceipt = () => {
    const doc = new jsPDF();
    const imgWidth = 40;
    const imgHeight = 40;
    doc.addImage(allMartLogo, "PNG", 20, 10, imgWidth, imgHeight);

    doc.setFontSize(20);
    doc.setTextColor("#1d4ed8");
    doc.text("AllMart Store", 105, 25, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor("#000000");
    doc.text("Payment Receipt", 105, 50, { align: "center" });

    const currentDate = new Date();
    const deliveryDate = new Date();
    deliveryDate.setDate(currentDate.getDate() + 7);

    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const formatDate = (date) =>
      `${weekdays[date.getDay()]}, ${date.getDate().toString().padStart(2, "0")}-${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;

    doc.setFontSize(12);
    doc.setTextColor(
      status === "success"
        ? "#16a34a"
        : status === "failed"
          ? "#dc2626"
          : "#ca8a04",
    );
    doc.text(`Transaction Status: ${status}`, 20, 70);
    doc.setTextColor("#000000");
    doc.text(`Reference: ${reference}`, 20, 78);
    doc.text(`Total Paid: #${total}`, 20, 86);
    doc.text(`Payment Date: ${formatDate(currentDate)}`, 20, 94);
    doc.text(`Estimated Delivery: ${formatDate(deliveryDate)}`, 20, 102);

    doc.text("Customer Details:", 20, 115);
    doc.text(`Name: ${addressInfo?.name}`, 20, 123);
    doc.text(`Phone: ${addressInfo?.phoneNumber}`, 20, 131);
    doc.text(`Address: ${addressInfo?.address}`, 20, 139);
    // doc.text(`Postal Code: ${addressInfo?.pincode}`, 20, 147);
    doc.text(`Delivery Type: ${addressInfo?.deliveryType}`, 20, 155);

    const tableColumn = ["Item", "Price"];
    const tableRows = cartItems.map((item) => [item.title, `#${item.price}`]);

    autoTable(doc, {
      startY: 165,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [29, 78, 216], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 165;

    doc.setFontSize(12);
    doc.setTextColor("#6b7280");
    doc.text("Thank you for shopping in AllMart Store!", 105, finalY + 15, {
      align: "center",
    });

    doc.save(`receipt_${reference}.pdf`);
  };

  const redirectHome = () => {
    localStorage.removeItem("fromPayment"); // clear the flag
    navigate("/"); // go to home
  };

  return (
    <>
      <Toaster /> {/* 🔹 Add this */}
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-green-100 to-blue-100 p-5">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center">
          <h1
            className={`text-3xl font-bold mb-4 ${
              status === "success"
                ? "text-green-600"
                : status === "failed"
                  ? "text-red-600"
                  : status === "cancelled"
                    ? "text-yellow-600"
                    : "text-black"
            }`}
          >
            {status === "success" && "✅ Payment Successful!"}
            {status === "failed" && "❌ Payment Failed"}
            {status === "cancelled" && "⚠️ Payment Cancelled"}
          </h1>

          {status === "success" && (
            <>
              <p className="mb-4 text-gray-700 font-medium">
                Reference: {reference}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
                <button
                  onClick={downloadReceipt}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto"
                >
                  Download Receipt (PDF)
                </button>
                <button
                  onClick={redirectHome}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 w-full sm:w-auto"
                >
                  Back to Home
                </button>
              </div>
              <p className="text-gray-600 text-sm mt-2">
                💡 Kindly download and keep your receipt for your payment
                record.
              </p>
            </>
          )}

          {(status === "failed" || status === "cancelled") && (
            <button
              onClick={redirectHome}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
            >
              Back to Home
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default TransactionStatus;
