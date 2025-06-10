'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import Image from 'next/image';
import Snackbar from '@mui/material/Snackbar';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";

export default function LoginModal({ isOpen, onClose, signup }) {
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

  const handleLogin = async (e) => {
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
        await signInWithEmailAndPassword(auth, username, pass);
        setLoad(false);
        setFlag(true);
        setTimeout(() => {
          onClose();
          router.push('/');
        }, 1000);
      } else {
        setInc(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === "auth/invalid-credential") {
        setMessage("No user found, please check again");
      } else if (error.code === "auth/invalid-email") {
        setMessage('Please use a valid email');
      } else {
        setMessage('Error logging in');
      }
      setNF(true);
      setLoad(false);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      setLoad(true);
      await signInWithPopup(auth, provider);
      setLoad(false);
      setFlag(true);
      setTimeout(() => {
        onClose();
        router.push('/');
      }, 1000);
    } catch (error) {
      console.error('Google sign-in error:', error);
      setMessage("Failed to sign in with Google.");
      setNF(true);
      setLoad(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50">
      <Snackbar open={flag} autoHideDuration={3000} message="Logged in!" onClose={() => setFlag(false)} />
      <Snackbar open={nf} autoHideDuration={3000} message={message} onClose={() => setNF(false)} />
      <Snackbar open={inc} autoHideDuration={3000} message="Please fill all the inputs" onClose={() => setInc(false)} />

     <div className="bg-white rounded-lg shadow-lg w-fit max-w-md px-6 py-6 flex flex-col overflow-hidden relative text-center">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl text-gray-600">&times;</button>
        {/* Left Section */}
        <div className="w-full p-8">
          <h1 className="text-2xl font-bold">Log In</h1>
          <p className="text-gray-500 mt-2">Welcome back! Please login to continue.</p>
          <form className="mt-6 space-y-4">
            <div>
              <label className="block text-sm">Email</label>
              <input
                type="email"
                className="w-full border px-4 py-2 rounded"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm">Password</label>
              <input
                type="password"
                className="w-full border px-4 py-2 rounded"
                onChange={(e) => setPass(e.target.value)}
              />
            </div>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              onClick={handleLogin}
            >
              LOGIN
            </button>
            <p className="text-center text-gray-500">OR</p>
            <button
              className="w-full border py-2 rounded flex items-center justify-center gap-2"
              onClick={handleGoogleSignIn}
            >
              <img src="/google.png" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>
          </form>
          <div className="text-center mt-4">
          <button className="text-blue-600 hover:underline text-sm" onClick={() => {
            onClose();
            signup();
          }}>
            New here? Sign up
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
