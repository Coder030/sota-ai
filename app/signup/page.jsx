"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FaGoogle } from "react-icons/fa";
import img from "../../public/bubbly.png";
import Image from "next/image";
import Link from "next/link";
import Snackbar from "@mui/material/Snackbar";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase"; // Ensure this is your Firebase config file
import { getDatabase, ref, set } from "firebase/database";

function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [message, setMessage] = useState("");
  const [flag, setFlag] = useState(false);
  const [load, setLoad] = useState(false);
  const [inc, setInc] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const router = useRouter();

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const writeUserData = (userId, name, email) => {
    const db = getDatabase(app);
    set(ref(db, "Main/users/" + userId), {
      username: name,
      email: email,
    });
  };

  const fetchCookie = async (e) => {
    e.preventDefault();

    const emailStr = String(email).trim();
    const passwordStr = String(pass).trim();

    if (passwordStr.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setErrorSnackbar(true);
      return;
    }

    try {
      if (emailStr !== "" && passwordStr !== "" && name !== "") {
        setInc(false);
        setLoad(true);

        // Sign up with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, emailStr, passwordStr);
        const user = userCredential.user;

        // Write user data to Firebase Realtime Database
        writeUserData(user.uid, name, emailStr);

        setLoad(false);
        setFlag(true);
        setTimeout(() => router.push("/"), 1000);
      } else {
        setInc(true);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setMessage(error.message || "Error signing up");
      setErrorSnackbar(true);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      setLoad(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Write user data to Firebase Realtime Database if new user
      writeUserData(user.uid, user.displayName, user.email);

      setLoad(false);
      setFlag(true);
      setTimeout(() => router.push("/"), 1000);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setMessage("Failed to sign in with Google.");
      setErrorSnackbar(true);
      setLoad(false);
    }
  };

  const handleCloseErrorSnackbar = () => setErrorSnackbar(false);

  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-200">
      <Snackbar open={errorSnackbar} autoHideDuration={5000} onClose={handleCloseErrorSnackbar} message={message} />
      <Snackbar
        open={flag}
        autoHideDuration={10000}
        onClose={() => setFlag(false)}
        message="Success! You have been signed up!"
      />
      <Snackbar
        open={inc}
        autoHideDuration={5000}
        onClose={() => setInc(false)}
        message="Please fill all the inputs"
      />
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col lg:flex-row items-center bg-white rounded-lg shadow-lg overflow-hidden max-h-[680px] max-w-[910px] py-[50px]">
          {/* Left side - Card */}
          <div className="w-full lg:w-1/2 p-8 h-fit">
            <div className="text-start">
              <h1 className="text-[30px] font-bold text-gray-800">Sign Up</h1>
              <p className="mt-3 text-lg text-[#949494]">Create a new account to get started</p>
            </div>
            <form className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Username (Name)
                  </label>
                  <input
                    id="name"
                    placeholder="John Doe"
                    className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="john_doe@gmail.com"
                    className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    onChange={(e) => setEmail(e.target.value)}
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
                    onChange={(e) => setPass(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-6 text-center">
                <button
                  className="w-[80%] bg-[#47afff] text-white py-3 rounded-lg hover:bg-[#2ba1fc] mt-[30px]"
                  onClick={fetchCookie}
                >
                  SIGN UP
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
              <div className="text-center mt-4">
                <button
                  className="text-blue-600 hover:underline text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/login");
                  }}
                >
                  Already have an account? Login
                </button>
              </div>
            </form>
          </div>

          {/* Right side - Image */}
          <div className="hidden lg:block w-full lg:w-1/2 bg-gradient-to-br from-purple-300 to-blue-200">
            <div className="h-full flex justify-center items-center">
              <Image
                src={img}
                alt="Bubble Background"
                className="max-w-full h-full object-cover"
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