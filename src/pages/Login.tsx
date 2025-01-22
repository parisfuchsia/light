 import { useState, useEffect } from 'react';
import { FaRegEye, FaRegEyeSlash} from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fromTopVariant, variant } from '../variants/variant.ts';
import axios from 'axios';
import Banner from '../components/Banner.tsx';
import { MoonLoader } from 'react-spinners';

const Login = () => {
  
  const [userForm, setUserForm] = useState<{
    username: string,
    password: string,
  }>({
    username: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState({});
  const { theme } = useSelector(state => state.theme);
  const nav = useNavigate();
  
  
  const handleChange = (e) => {
    const {name, value } = e.target; 
    setUserForm(prev => {
      return {
        ...prev, [name] : value
      }
    })
    setMessage(prev => {
      return {
        ...prev,
      message: "",
      error: false
    }
    })
  }
  const [message, setMessage] = useState<{
    message: string,
    error: boolean
  }>({
    message: "",
    error: false
  });
  
  const lookForSession = async() => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/checksession`, {
        withCredentials: true
      });
      
      if(res?.data?.user){
        setUser(res.data.user)
      }
    }catch(e){
      
    }
  }
  
  useEffect(() => {
    lookForSession();
  }, [nav])
  
  
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
      if(username.length < 8 || username.length > 12 || password.length < 8){
   return setMessage(prev => {
      return {
        ...prev,
      message: "Invalid username or password",
      error: true
    }
    })
  }
  setLoading(true);
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, { username: username.trim(), password: password.trim()}, {
      withCredentials: true
    });
  
    
    setMessage(prev => {
      return {
        ...prev, 
        message: res?.data?.message,
        error: !res?.data?.success 
      }
    })
    if(res?.data?.success){
      setLoading(false);
      nav("/home");
    }
  }catch({response}){
    setLoading(false);
    setMessage(prev => {
      return {
        ...prev, 
        message: response?.data.message,
        error: !response?.data.success 
      }
    })
  }
  }
  
  
  return (
    <div className = "absolute w-full inset-0 flex items-center justify-center bg-[#fafae6] dark:bg-[#2D2D30] flex-col gap-4"> 
    <Banner />
    <motion.main 
    variants = {fromTopVariant}
    initial = "before" 
    animate = "after"
    className = "p-3 bg-[#F0ECCF] dark:bg-[#262629] dark:shadow-[#1A1F2E] z-20 w-10/12 shadow-[#FAF5E6] rounded md:w-8/12 lg:w-6/12 xl:w-4/12 shadow-md">
      <h1 className = "text-[#8B5E3C] dark:text-neutral-100 responsive-xl font-bold my-2">Login</h1>
      <section className = "flex flex-col gap-2 my-2">
        <label className = "text-[#8B5E3C] dark:text-neutral-100 responsive-xs">Username</label>
        <input className = "p-2 text-[#8B5E3C]  outline-none dark:text-[#262629]  rounded shadow-md"name = "username" onChange = {handleChange}  />
      </section>
      <section className = "flex flex-col gap-2 my-2">
                <label className = "text-[#8B5E3C] dark:text-neutral-100 responsive-xs">Password</label>
                <section className = "items-center flex gap-1 w-full">
                          <input className = "p-2 rounded text-[#8B5E3C] w-full dark:text-[#262629]  outline-none shadow-md"name = "password" onChange = {handleChange} type = {showPassword ? "text" : "password"} />
                          <div className = "p-1"onClick = {!loading ? () => setShowPassword(prev => !prev) : null}>
                            {
                              loading ? <MoonLoader color = {theme === "light" ? "black" : "white"} size = "16" /> : showPassword ? <FaRegEye className = "size-5 text-gray-700 dark:text-neutral-100"/> : <FaRegEyeSlash className = "size-5 text-gray-700 dark:text-neutral-100" />
                            }
                          </div>
                </section>
                <p className = {`responsive-xs min-h-4 text-red-500 `}>{(message.message && message.error) && message.message}</p>
      </section>
      <section className = "items-center gap-3 w-full flex justify-end">
        <p className = "responsive-xs text-[#8B5E3C] dark:text-neutral-100 ">Doesn't have an account? <NavLink className = "text-blue-400" to = "/register" >Register</NavLink> </p>
        <button onClick = {handleSubmit} className = " min-w-20 text-[#8B5E3C] dark:text-neutral-100 responsive-base p-2 shadow-md rounded  hover:scale-105">
          Login
        </button>
      </section>
    </motion.main>
    <div className = "min-h-4">
    {
      Object.keys(user).length > 0 &&     <motion.div  
      initial = {{opacity: 0}} 
      animate = {{opacity: 1, transition: {
        duration: 1
      }}} ><NavLink to = "/home" className = "responsive-xs text-[#d4b5a3] dark:text-neutral-400" >Or continue as @{user?.username}</NavLink></motion.div>
    }
    </div>
    </div>
  )
}

export default Login;