'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import img from "../../public/auth2.png";
import Image from 'next/image';
import Link from 'next/link';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase"; // make sure this is where your Firebase configuration is

function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [message, setMessage] = useState('');
  const [flag, setFlag] = useState(false);
  const [load, setLoad] = useState(false);
  const [inc, setInc] = useState(false);
  const [nf, setNF] = useState(false);
  const router = useRouter();

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  function handleChange(event) {
    setUsername(event.target.value);
  }

  function handleChange2(event) {
    setPass(event.target.value);
  }

  async function fetchCookie(e) {
    e.preventDefault();

    if (pass.length < 6) {
      setMessage('Password must be at least 6 characters.');
      setNF(true);
      return;
    }

    try {
      if (username !== '' && pass !== '') {
        setInc(false);
        setLoad(true);

        // Firebase Authentication login
        const userCredential = await signInWithEmailAndPassword(auth, username, pass);
        const user = userCredential.user;

        setLoad(false);
        setFlag(true);
        setTimeout(() => router.push('/'), 1000);
      } else {
        setInc(true);
      }
    } catch (error) {
      console.error('Error fetching cookie:', error);
      if (error.code === "auth/invalid-credential") {
        setMessage("No user found, please check again")
        setNF(true);
      } 
      else if(error.code == "auth/invalid-email"){
        setMessage('Please put a valid email');
        setNF(true);
      }
      else {
        setMessage('Error logging in');
        setNF(true)
      }
    }
  }

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      setLoad(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // User data after Google sign-in
      setLoad(false);
      setFlag(true);
      setTimeout(() => router.push('/'), 1000);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setMessage("Failed to sign in with Google.");
      setNF(true);
      setLoad(false);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setFlag(false);
  };

  const handleClose2 = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setInc(false);
  };

  const handleClose3 = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNF(false);
  };

  return (
    <div className='bg-grey-500'>
      <Snackbar
        open={flag}
        autoHideDuration={10000}
        onClose={handleClose}
        message="Success! You have been logged in!"
      />
      <Snackbar
        open={inc}
        autoHideDuration={5000}
        onClose={handleClose2}
        message="Please fill all the inputs"
      />
      <Snackbar
        open={nf}
        autoHideDuration={5000}
        onClose={handleClose3}
        message={message}
      />
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col lg:flex-row items-center bg-white rounded-lg shadow-lg border-1 overflow-hidden max-h-[680px] max-w-[910px] py-0">
          {/* Left side - Card */}
          <div className="w-full lg:w-1/2 p-8 h-fit">
            <div className="text-start">
              <h1 className="text-[30px] font-bold text-gray-800">Log In</h1>
              <p className="mt-3 text-lg text-[#949494]">
                Welcome back! Please login to your account to continue
              </p>
            </div>
            <form className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="john_doe"
                    className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    onChange={(e) => {
                      setUsername(e.target.value)
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="John@Doe"
                    className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    onChange={(e) => {
                      setPass(e.target.value)
                    }}
                  />
                </div>
              </div>
              <div className="mt-6 text-center">
                <button
                  className="w-[80%] bg-[#47afff] text-white py-3 rounded-lg hover:bg-[#2ba1fc] mt-[30px]"
                  onClick={fetchCookie}
                >
                  LOGIN
                </button>
              </div>
              <p className="text-center text-[#878686]">OR</p>
              <div className='flex justify-center'>
              <div className="text-center">
                <button
                  className="flex justify-center items-center gap-2 border px-5 py-2 rounded-lg"
                  onClick={handleGoogleSignIn}
                >
                  <img src="/google.png" className="w-[30px] h-[30px]" alt="Google" />
                  Sign in with Google
                </button>
              </div>
              </div>
              <div className="text-center" onClick={(e) => {
                e.preventDefault();
                router.push("/signup");
              }}>
                <button className="text-blue-600 hover:underline text-sm">New here? Click to Sign up!</button>
              </div>

              
            </form>
          </div>

          {/* Right side - Image */}
         <div className="hidden lg:block w-full lg:w-1/2 h-full py-0">
  <div className="h-full">
    <Image
      src={img}
      alt="Bubble Background"
      className="w-full h-full object-cover"
    />
  </div>
</div>
        </div>
      </div>
      {load && !inc && <p className="text-center text-[25px]">Loading...</p>}
    </div>
  );
}

export default Page;