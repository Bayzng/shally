import ScrollToTop from "./ScrollToTop";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Order from "./pages/order/Order";
import Cart from "./pages/cart/Cart";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import NoPage from "./pages/nopage/NoPage";
import MyState from "./context/data/myState";
import Login from "./pages/registration/Login";
import Signup from "./pages/registration/Signup";
import ProductInfo from "./pages/productInfo/ProductInfo";
import AddProduct from "./pages/admin/page/AddProduct";
import UpdateProduct from "./pages/admin/page/UpdateProduct";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Allproducts from "./pages/allproducts/Allproducts";
import TransactionStatus from "./components/TransactionStatus/TransactionStatus";
import OrderHistory from "./components/OrderHistory/OrderHistory";
import PublicAddProduct from "./pages/admin/page/PublicAddProduct";
import Home from "./pages/home/Home";
import Creator from "./components/Creator/Creator";
import MyUploadedProducts from "./components/MyUploadedProducts/MyUploadedProducts";
import ProtectedRouteForAdmin from "./components/ProtectedRouteForAdmin/ProtectedRouteForAdmin";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import ProtectedRouteUser from "./components/ProtectedRouteUser/ProtectedRouteUser";
import UserDashboard from "./components/UserDashboard/UserDashboard";
import UserProfile from "./components/UserProfile/UserProfile";
import UserSettings from "./components/UserSettings/UserSettings";
import PrivacyTerms from "./components/PrivacyTerms";
import PublicUpdateProduct from "./pages/admin/page/PublicUpdateProduct";
import Disputes from "./components/Disputes/Disputes";

function App() {
  return (
    <MyState>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/allproducts" element={<Allproducts />} />
          <Route path="/cart" element={<Cart />} />

          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRouteForAdmin>
                <Dashboard />
              </ProtectedRouteForAdmin>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/productinfo/:id" element={<ProductInfo />} />

          <Route
            path="/addproduct"
            element={
              <ProtectedRouteForAdmin>
                <AddProduct />
              </ProtectedRouteForAdmin>
            }
          />

          <Route
            path="/updateproduct"
            element={
              <ProtectedRouteUser>
                <UpdateProduct />
              </ProtectedRouteUser>
            }
          />

          <Route
            path="/transaction-status"
            element={
              <ProtectedRoute>
                <TransactionStatus />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-history"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-products"
            element={
              <ProtectedRoute>
                <MyUploadedProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/public-add-product"
            element={
              <ProtectedRouteUser>
                <PublicAddProduct />
              </ProtectedRouteUser>
            }
          />
          <Route
            path="/public-update-product/:id"
            element={
              <ProtectedRouteUser>
                <PublicUpdateProduct />
              </ProtectedRouteUser>
            }
          />

          <Route
            path="/creator"
            element={
              <ProtectedRouteUser>
                <Creator />
              </ProtectedRouteUser>
            }
          />
          <Route
            path="/user-profile/:uid"
            element={
              <ProtectedRouteUser>
                <UserProfile />
              </ProtectedRouteUser>
            }
          />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRouteUser>
                <UserDashboard />
              </ProtectedRouteUser>
            }
          />
          <Route
            path="/user-settings"
            element={
              <ProtectedRouteUser>
                <UserSettings />
              </ProtectedRouteUser>
            }
          />
          <Route
            path="/disputes"
            element={
              <ProtectedRouteUser>
                <Disputes />
              </ProtectedRouteUser>
            }
          />

          <Route path="/*" element={<NoPage />} />
          <Route path="/privacy-terms" element={<PrivacyTerms />} />
        </Routes>

        <ToastContainer />
      </Router>
    </MyState>
  );
}

export default App;
