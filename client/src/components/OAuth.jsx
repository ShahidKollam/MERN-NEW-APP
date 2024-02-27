import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice"; 
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      console.log("data",res);

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/')
      console.log("OK",result);
    } catch (error) {
      console.log("Could not login with google", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-90"
    >
      Continue with google
    </button>
  );
}
