import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import myContext from '../../context/data/myContext';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, fireDB } from '../../fireabase/FirebaseConfig';
import { Timestamp, doc, setDoc } from 'firebase/firestore';
import Loader from '../../components/loader/Loader';

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const context = useContext(myContext);
  const { loading, setLoading } = context;

  const signup = async () => {
    setLoading(true);

    if (!name || !email || !password) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      // Create user in Firebase Auth
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Save user info in Firestore
      await setDoc(doc(fireDB, "users", result.user.uid), {
        name,
        email: result.user.email,
        uid: result.user.uid,
        createdAt: Timestamp.now()
      });

      // Save user info locally for dashboard
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: result.user.uid,
          name,
          email: result.user.email
        })
      );

      toast.success("Signup Successful");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-900 px-4 sm:px-6'>
      {loading && <Loader />}
      <div className='bg-gray-800 w-full max-w-md p-8 sm:p-10 rounded-xl shadow-lg'>
        <h1 className='text-center text-white text-2xl sm:text-3xl mb-6 font-bold'>Signup</h1>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Name'
          className='bg-gray-700 mb-4 px-4 py-3 w-full rounded-lg text-white placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-red-500 transition'
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
          className='bg-gray-700 mb-4 px-4 py-3 w-full rounded-lg text-white placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-red-500 transition'
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password (min. 8 characters)'
          className='bg-gray-700 mb-4 px-4 py-3 w-full rounded-lg text-white placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-red-500 transition'
        />

        <button
          onClick={signup}
          className='w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition mb-3'
        >
          Signup
        </button>

        <p className='text-center text-gray-300 mt-4 text-sm sm:text-base'>
          Already have an account?{' '}
          <Link to='/login' className='text-red-500 font-bold hover:underline'>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
