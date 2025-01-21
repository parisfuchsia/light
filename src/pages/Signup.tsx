import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { fromTopVariant } from '../variants/variant.ts';
import { useSelector } from 'react-redux';
import { MoonLoader } from 'react-spinners';
import Banner from '../components/Banner.tsx';

const Signup = () => {
  const [userForm, setUserForm] = useState<{
    username: string,
    password: string,
  }>({
    username: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    message: string,
    error: boolean
  }>({
    message: "",
    error: false
  })
  const [loading, setLoading] = useState<boolean>(false);
  const { theme } = useSelector(state => state.theme);
  
  const handleChange = async(e) => {
    const {name, value } = e.target; 
    setUserForm(prev => {
      return {
        ...prev, [name] : value
      }
    });
    
    setMessage(prev => {
      return {
        ...prev,
      message: "",
      error: false
    }
    })
  }
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    const { username, password } = userForm;
    if(!username || !password){
     return setMessage(prev => {
      return {
        ...prev,
      message: "Please fill up the required documents",
      error: true
    }
    })
    }
      if(username.length < 8 || username.length > 12){
   return setMessage(prev => {
      return {
        ...prev,
      message: "Username should be at least 8-12 characters",
      error: true
    }
    })
  }
  if(password.length < 8){
   return setMessage(prev => {
      return {
        ...prev,
      message: "Password should be atleast 8 characters",
      error: true
    }
    })
  }
  setLoading(true);
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/register`, { username, password });
    setMessage(prev => {
      return {
        ...prev, 
        message: res.data.message,
        error: !res.data.success 
      }
    })
    setLoading(false);
  }catch(e){
   
    setMessage(prev => {
      return {
        ...prev, 
        message: e?.response?.data?.message,
        error: !e?.response?.data?.success 
      }
    })
    setLoading(false);
  }
  }
  
  
  return (
    <div className = "w-full absolute inset-0 flex items-center justify-center  flex-col"> 
    <Banner />
    <motion.main 
    variants = {fromTopVariant}
    initial = "before" 
    animate = "after"
    className = "p-3 w-10/12 z-20 dark:bg-[#262629] dark:shadow-[#1A1F2E] bg-[#F0ECCF] md:w-8/12 lg:w-6/12 xl:w-4/12 rounded shadow-[#FAF5E6] shadow-md">
      <h1 className = "responsive-xl text-[#8B5E3C] dark:text-neutral-100  font-bold my-2">Register</h1>
      <section className = "flex flex-col gap-2 my-2">
        <label className = "text-[#8B5E3C] dark:text-neutral-100 responsive-xs">Username<span className = "text-red-500">*</span></label>
        <input className = "p-2 outline-none rounded shadow-md dark:text-[#262629]"name = "username" onChange = {handleChange} type = "text" />

      </section>
      <section className = "flex flex-col gap-2 my-2">
                <label className = "text-[#8B5E3C] dark:text-neutral-100 responsive-xs">Password<span className = "text-red-500">*</span></label>
                <section className = "items-center flex gap-1 w-full">
                          <input className = "p-2 rounded outline-none w-full dark:text-[#262629]  shadow-md"name = "password" onChange = {handleChange} type = {showPassword ? "text" : "password"} />
                          <div className = "p-1"onClick = {() => setShowPassword(prev => !prev)}>
                            
                            {
                             loading ? <MoonLoader color = {theme === "light" ? "black" : "white" } size = "16" /> : showPassword ? <FaRegEye className = "size-5 text-gray-700 dark:text-neutral-100"/> : <FaRegEyeSlash className = "text-gray-700 dark:text-neutral-100 size-5" />
                            }
                          </div>

                </section>
             <div className = "min-h-4">          
          { 
          message.message && message.error ? <p className = "responsive-xs   text-red-500 ">{message.message}</p>
          : message.message && <p className = "responsive-xs  text-green-500 ">{message.message}</p>
          }
          </div>
        
      </section>
      <section className = "items-center gap-3 w-full flex justify-end">
        <p className = "responsive-xs text-[#8B5E3C] dark:text-neutral-100 ">Already have an account? <NavLink className = "text-blue-400" to = "/" >Login</NavLink> </p>
        <button onClick = {handleSubmit}className = "responsive-base p-2 text-[#8B5E3C] dark:text-neutral-100  shadow-md rounded min-w-20 hover:scale-105">
          Register
        </button>
      </section>
    </motion.main>
    
    </div>
  )
}

export default Signup