// import { useContext, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import myContext from '../../context/data/myContext';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth, fireDB } from '../../fireabase/FirebaseConfig';
// import { doc, getDoc } from 'firebase/firestore';
// import { toast } from 'react-toastify';
// import Loader from '../../components/loader/Loader';

// function Login() {
//   const context = useContext(myContext);
//   const { loading, setLoading } = context;

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const navigate = useNavigate();

//   const login = async () => {
//     setLoading(true);
//     try {
//       // ✅ Sign in with Firebase Auth
//       const result = await signInWithEmailAndPassword(auth, email, password);

//       // ✅ Fetch extra user info from Firestore
//       const userRef = doc(fireDB, 'users', result.user.uid);
//       const userSnap = await getDoc(userRef);

//       let userData = {
//         uid: result.user.uid,
//         email: result.user.email,
//         name: result.user.displayName || '', // fallback if displayName exists
//       };

//       if (userSnap.exists()) {
//         userData = { ...userData, ...userSnap.data() };
//       }

//       // ✅ Store simplified user in localStorage
//       localStorage.setItem('user', JSON.stringify(userData));

//       toast.success('Login successful', {
//         position: 'top-right',
//         autoClose: 2000,
//         hideProgressBar: true,
//         theme: 'colored',
//       });

//       navigate('/');
//       setLoading(false);
//     } catch (error) {
//       console.log(error);

//       // ✅ Friendly error messages
//       let errorMessage = 'Something went wrong. Please try again.';
//       if (error.code === 'auth/invalid-email') errorMessage = 'Invalid email format.';
//       else if (error.code === 'auth/user-not-found') errorMessage = 'No user found with this email.';
//       else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential')
//         errorMessage = 'Incorrect email or password. Please try again.';
//       else if (error.code === 'auth/too-many-requests') errorMessage = 'Too many failed attempts. Try again later.';
//       else if (error.code === 'auth/network-request-failed') errorMessage = 'Network error. Please check your connection.';

//       toast.error(errorMessage, {
//         position: 'top-right',
//         autoClose: 3000,
//         hideProgressBar: true,
//         theme: 'colored',
//       });

//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       {loading && <Loader />}
//       <div className="bg-gray-800 px-10 py-10 rounded-xl">
//         <div>
//           <h1 className="text-center text-white text-xl mb-4 font-bold">Login</h1>
//         </div>
//         <div>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             name="email"
//             className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
//             placeholder="Email"
//           />
//         </div>
//         <div>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
//             placeholder="Password"
//           />
//         </div>
//         <div className="flex justify-center mb-3">
//           <button
//             onClick={login}
//             className="bg-yellow-500 w-full text-black font-bold px-2 py-2 rounded-lg"
//           >
//             Login
//           </button>
//         </div>
//         <div>
//           <h2 className="text-white">
//             Do not have an account{' '}
//             <Link className="text-yellow-500 font-bold" to={'/signup'}>
//               Signup
//             </Link>
//           </h2>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;





import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import myContext from '../../context/data/myContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, fireDB } from '../../fireabase/FirebaseConfig';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../../components/loader/Loader';
import { doc, getDoc } from 'firebase/firestore';

function Login() {
  const context = useContext(myContext);
  const { loading, setLoading } = context;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const login = async () => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Fetch Firestore user data
      const userRef = doc(fireDB, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);

      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        name: userSnap.exists()
          ? userSnap.data().name
          : result.user.displayName || 'User',
      };

      localStorage.setItem('user', JSON.stringify(userData));

      toast.success('Login successful', { position: 'top-right', autoClose: 2000, hideProgressBar: true, theme: 'colored' });
      navigate('/');
    } catch (error) {
      console.log(error);
      let errorMessage = 'Something went wrong. Please try again.';

      if (error.code === 'auth/invalid-email') errorMessage = 'Invalid email format.';
      else if (error.code === 'auth/user-not-found') errorMessage = 'No user found with this email.';
      else if (error.code === 'auth/wrong-password') errorMessage = 'Incorrect email or password.';
      else if (error.code === 'auth/too-many-requests') errorMessage = 'Too many failed attempts. Try again later.';
      else if (error.code === 'auth/network-request-failed') errorMessage = 'Network error. Please check your connection.';

      toast.error(errorMessage, { position: 'top-right', autoClose: 3000, hideProgressBar: true, theme: 'colored' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-900 px-4 sm:px-6'>
      {loading && <Loader />}
      <div className='bg-gray-800 w-full max-w-md p-8 sm:p-10 rounded-xl shadow-lg'>
        <h1 className='text-center text-white text-2xl sm:text-3xl mb-6 font-bold'>Login</h1>

        <Toaster />

        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
          className='bg-gray-700 mb-4 px-4 py-3 w-full rounded-lg text-white placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-yellow-500 transition'
        />

        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          className='bg-gray-700 mb-4 px-4 py-3 w-full rounded-lg text-white placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-yellow-500 transition'
        />

        <button
          onClick={login}
          className='w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition'
        >
          Login
        </button>

        <p className='text-center text-gray-300 mt-4 text-sm sm:text-base'>
          Don’t have an account?{' '}
          <Link to='/signup' className='text-yellow-500 font-bold hover:underline'>
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;