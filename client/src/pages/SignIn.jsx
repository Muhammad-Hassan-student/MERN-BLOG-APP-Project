import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useDispatch,useSelector } from "react-redux";
import { signInStart,signInSuccess,signInFailure } from "../redux/user/userSlice";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const {loading,error:errorMessage}= useSelector((state) => state.user);
  const navigate = useNavigate();
  {/* use redux in function so first dispatch to use userSlice */}
  const dispatch= useDispatch();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (  !formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all fields"));
    }
    try {
     dispatch(signInStart());
      const res = await fetch("/api/v1/auth/signIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        return dispatch(signInFailure(data.message));
      }
     
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(data.message));
     
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/*Left Side Of Sign Up*/}
        <div className="flex-1">
          <Link to={"/"} className="font-bold dark:text-white text-4xl">
            <span className="px-1 py-1 bg-gradient-to-r from-green-500 via-teal-400 to-indigo-400 rounded-lg text-white">
              Hassan's
            </span>
            BLOG
          </Link>
          <p className=" mt-5 text-sm">
            This is a Hassan's Blog. You can sign in with email or password or
            with google.
          </p>
        </div>
        {/*On the right side of sign up */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
           
            <div>
              <Label value="Your email" />
              <TextInput
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                placeholder="*********"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone={"greenToBlue"}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>Loading ...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <div className="flex gap-2 text-sm mt-4">
              <span>Don't have an account?</span>
              <Link to={"/sign-up"} className="text-blue-500">
                Sign Up
              </Link>
            </div>
            {errorMessage && (
              <>
                <Alert className="mt-5" color={"failure"}>
                  {errorMessage}
                </Alert>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
