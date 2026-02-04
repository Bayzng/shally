import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // import icons
import myContext from "../../context/data/myContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, fireDB } from "../../fireabase/FirebaseConfig";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../components/loader/Loader";
import { doc, getDoc } from "firebase/firestore";

function Login() {
  const context = useContext(myContext);
  const { loading, setLoading } = context;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ toggle

  const navigate = useNavigate();

  const login = async () => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      const userRef = doc(fireDB, "users", result.user.uid);
      const userSnap = await getDoc(userRef);

      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        name: userSnap.exists()
          ? userSnap.data().name
          : result.user.displayName || "User",
      };

      localStorage.setItem("user", JSON.stringify(userData));

      toast.success("Login successful", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
      let errorMessage = "Something went wrong. Please try again.";
      if (error.code === "auth/invalid-email")
        errorMessage = "Invalid email format.";
      else if (error.code === "auth/user-not-found")
        errorMessage = "No user found with this email.";
      else if (error.code === "auth/wrong-password")
        errorMessage = "Incorrect email or password.";
      else if (error.code === "auth/too-many-requests")
        errorMessage = "Too many failed attempts. Try again later.";
      else if (error.code === "auth/network-request-failed")
        errorMessage = "Network error. Please check your connection.";

      toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4 sm:px-6">
      {loading && <Loader />}
      <div className="bg-gray-800 w-full max-w-md p-8 sm:p-10 rounded-xl shadow-lg">
        <h1 className="text-center text-white text-2xl sm:text-3xl mb-6 font-bold">
          Login
        </h1>

        <Toaster />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="bg-gray-700 mb-4 px-4 py-3 w-full rounded-lg text-white placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-yellow-500 transition"
        />

        {/* Password field with toggle */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-gray-700 px-4 py-3 w-full rounded-lg text-white placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-yellow-500 transition pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-yellow-500 transition"
          >
            {showPassword ? (
              <AiFillEyeInvisible size={20} />
            ) : (
              <AiFillEye size={20} />
            )}
          </button>
        </div>

        <button
          onClick={login}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition"
        >
          Login
        </button>

        <p className="text-center text-gray-300 mt-4 text-sm sm:text-base">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-yellow-500 font-bold hover:underline"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
