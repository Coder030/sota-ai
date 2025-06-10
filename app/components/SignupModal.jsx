"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import Image from "next/image";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { getDatabase, ref, set } from "firebase/database";
import img from "../../public/bubbly.png";

export default function SignupModal({ isOpen, onClose, login }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [message, setMessage] = useState("");
  const [flag, setFlag] = useState(false);
  const [load, setLoad] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const router = useRouter();

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const writeUserData = (userId, name, email) => {
    const db = getDatabase(app);
    set(ref(db, "Main/users/" + userId), { username: name, email: email });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (pass.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setErrorSnackbar(true);
      return;
    }

    try {
      if (email.trim() && pass.trim() && name.trim()) {
        setLoad(true);
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass.trim());
        writeUserData(userCredential.user.uid, name, email.trim());
        setLoad(false);
        setFlag(true);
        setTimeout(() => {
          onClose();
          router.push("/");
        }, 1000);
      } else {
        setMessage("Please fill all the inputs.");
        setErrorSnackbar(true);
      }
    } catch (error) {
      setMessage(error.message || "Error signing up");
      setErrorSnackbar(true);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      setLoad(true);
      const result = await signInWithPopup(auth, provider);
      writeUserData(result.user.uid, result.user.displayName, result.user.email);
      setLoad(false);
      setFlag(true);
      setTimeout(() => {
        onClose();
        router.push("/");
      }, 1000);
    } catch (error) {
      setMessage("Failed to sign in with Google.");
      setErrorSnackbar(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50">
      <Snackbar open={flag} autoHideDuration={3000} message="Success! You have been signed up!" onClose={() => setFlag(false)} />
      <Snackbar open={errorSnackbar} autoHideDuration={3000} message={message} onClose={() => setErrorSnackbar(false)} />

      <div className="bg-white rounded-lg shadow-lg  min-w-[500px] w-fit px-6 py-6 flex flex-col text-center relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl text-gray-600">&times;</button>

        <h1 className="text-2xl font-bold">Sign Up</h1>
        <p className="text-gray-500 mt-2">Create a new account to get started</p>

        <form className="mt-6 space-y-4">
          <div>
            <label className="block text-sm">Username</label>
            <input
              type="text"
              className="w-[80%] border px-4 py-2 rounded"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input
              type="email"
              className="w-[80%] border px-4 py-2 rounded"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input
              type="password"
              className="w-[80%] border px-4 py-2 rounded"
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <button className="w-[80%] bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600" onClick={handleSignup}>
            SIGN UP
          </button>
          <p className="text-center text-gray-500">OR</p>
          <div className="flex justify-center">
          <button className="w-[80%] border py-2 rounded flex items-center justify-center gap-2" onClick={handleGoogleSignIn}>
            <img src="/google.png" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <button className="text-blue-600 hover:underline text-sm" onClick={() => {
            onClose();
            login();
          }}>
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
}
