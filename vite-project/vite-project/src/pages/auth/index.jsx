import React, { useState } from 'react';
import { TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Tabs } from "../../components/ui/tabs";
import Victory from "../../assets/victory.svg";
import { Input } from "../../components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "../../lib/api-client.js";
import { SIGNUP_ROUTE, LOGIN_ROUTE } from "@/utils/constants";
import { useActionData, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';

const Auth = () => {
  const navigate = useNavigate();
  const {setUserInfo} =useAppStore;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  // Validate Signup
  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    if (!confirmPassword.length) {
      toast.error("Confirm Password is required.");
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address!');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return false;
    }
    
    return true;
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (validateSignup()) {
      try {
        const response = await apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true });
        if (response && response.status==201) {
          setUserInfo(response.data.user);
          toast.success('Signup successful!');
          navigate("/profile");
        } else {
          toast.error('Unexpected server response.');
        }

      } catch (error) {
        console.error('Signup error:', error);
        toast.error('Signup failed.');
      }
    }
  };

  // Validate Login
  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address!');
      return false;
    }
    
    return true;
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateLogin()) {
      try {
        const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
        if (response.data.user._id) {
          setUserInfo(response.data.user);

          toast.success('Login successful!');
          if(response.data.user.profileSetup){
            navigate("/chat");
          }else{
            navigate("/proofile");
          }

        } else {
          toast.error('Unexpected server response.');
        }
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Login failed.');
      }
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="relative h-[80vh] bg-white bottom-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid grid-cols-1 xl:grid-cols-2 gap-6 p-6 xl:gap-12 xl:py-10 transition-all duration-500 ease-in-out">

        {/* Left Side - Text Section */}
        <div className="flex flex-col gap-8 items-center justify-center text-center transition-all duration-500 ease-in-out xl:pr-10 xl:border-r xl:border-gray-300 h-full">
          <div className="space-y-1">
            <div className="flex items-center justify-center flex-row ">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">Welcome</h1>
              <img src={Victory} alt="Victory Emoji" className="h-[50px] md:h-[60px]" />
            </div>
            <p className="font-medium text-lg md:text-xl xl:text-2xl text-gray-600 leading-relaxed">
              Fill in the details to get started with the best chat app experience!
            </p>
          </div>
        </div>

        {/* Right Side - Tabs/Form Section */}
        <div className="flex flex-col items-center justify-start w-full gap-6 transition-all duration-500 ease-in-out">
          <Tabs className="w-3/4" defaultValue='login'>
            <TabsList className="bg-transparent rounded-none w-full flex justify-around mt-4">
                        <TabsTrigger 
              value="login" 
              className="text-black text-opacity-90 border-b-2 rounded-none w-full p-3 transition-all duration-300 
                        hover:text-opacity-100 hover:border-b-purple-500 
                        data-[state=active]:text-black data-[state=active]:border-b-purple-600"
            >
              Login
            </TabsTrigger>

            <TabsTrigger 
              value="signup" 
              className="text-black text-opacity-90 border-b-2 rounded-none w-full p-3 transition-all duration-300 
                        hover:text-opacity-100 hover:border-b-purple-500 
                        data-[state=active]:text-black data-[state=active]:border-b-purple-600"
            >
              Signup
            </TabsTrigger>


            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <form className="flex flex-col gap-2">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6 mt-2"
                  value={email}
                  onChange={handleEmailChange}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6 mt-1"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <Button
                  type="submit"
                  className="bg-purple-600 text-white rounded-full p-6 mt-2"
                  onClick={handleLogin}
                >
                  Submit
                </Button>
              </form>
            </TabsContent>

            {/* Signup Form */}
            <TabsContent value="signup">
              <form className="flex flex-col gap-2">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6 mt-2"
                  value={email}
                  onChange={handleEmailChange}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6 mt-1"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6 mt-1"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
                <Button
                  type="submit"
                  className="bg-purple-600 text-white rounded-full p-6 mt-2"
                  onClick={handleSignup}
                >
                  Signup
                </Button>
              </form>
            </TabsContent>

          </Tabs>
        </div>

      </div>
    </div>
  );
};

export default Auth;
