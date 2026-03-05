import { useContext } from "react";
import ScrollToTop from "./ScrollToTop";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MyState from "./context/data/myState";
import myContext from "./context/data/myContext";

import Home from "./pages/home/Home";
import Allproducts from "./pages/allproducts/Allproducts";
import Cart from "./pages/cart/Cart";
import Order from "./pages/order/Order";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Login from "./pages/registration/Login";
import Signup from "./pages/registration/Signup";
import ProductInfo from "./pages/productInfo/ProductInfo";
import AddProduct from "./pages/admin/page/AddProduct";
import UpdateProduct from "./pages/admin/page/UpdateProduct";
import PublicAddProduct from "./pages/admin/page/PublicAddProduct";
import PublicUpdateProduct from "./pages/admin/page/PublicUpdateProduct";
import TransactionStatus from "./components/TransactionStatus/TransactionStatus";
import OrderHistory from "./components/OrderHistory/OrderHistory";
import Creator from "./components/Creator/Creator";
import MyUploadedProducts from "./components/MyUploadedProducts/MyUploadedProducts";
import UserDashboard from "./components/UserDashboard/UserDashboard";
import UserProfile from "./components/UserProfile/UserProfile";
import UserSettings from "./components/UserSettings/UserSettings";
import PrivacyTerms from "./components/PrivacyTerms";
import Disputes from "./components/Disputes/Disputes";
import SellerChatDashboard from "./components/SellerChat/SellerChatDashboard";
import ProtectedRouteForAdmin from "./components/ProtectedRouteForAdmin/ProtectedRouteForAdmin";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import ProtectedRouteUser from "./components/ProtectedRouteUser/ProtectedRouteUser";
import PullToRefreshWrapper from "./PullToRefreshWrapper";

function App() {
  return (
    <MyState>
      <AppRoutes />
    </MyState>
  );
}

function AppRoutes() {
  const { currentUser, product } = useContext(myContext);

  // Check if current user has created at least one product
  const isSeller = currentUser
    ? product.some((p) => p.userid === currentUser.uid)
    : false;

  return (
    <PullToRefreshWrapper>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/allproducts" element={<Allproducts />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/productinfo/:id" element={<ProductInfo />} />
          <Route path="/privacy-terms" element={<PrivacyTerms />} />
          {/* <Route path="/privacy-terms" element={<Sel />} /> */}

          {/* <Route path="/*" element={<NoPage />} /> */}

          {/* Protected Routes for logged-in users */}
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
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

          {/* Protected Routes for Admin */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRouteForAdmin>
                <Dashboard />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/addproduct"
            element={
              <ProtectedRouteForAdmin>
                <AddProduct />
              </ProtectedRouteForAdmin>
            }
          />

          {/* Protected Routes for Users */}
          <Route
            path="/updateproduct"
            element={
              <ProtectedRouteUser>
                <UpdateProduct />
              </ProtectedRouteUser>
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

          {/* Seller Chat - Only visible to users who created products */}
          {/* Always define /chat */}
          <Route
            path="/chat"
            element={
              <ProtectedRouteUser>
                <SellerChatDashboard />
              </ProtectedRouteUser>
            }
          />
        </Routes>

        <ToastContainer />
      </Router>
    </PullToRefreshWrapper>
  );
}

export default App;
