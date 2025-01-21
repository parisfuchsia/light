
import axios from 'axios';
import { useState } from 'react';
import { reset } from '../state/userSlice.ts';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { variant } from '../variants/variant.ts';
import { motion } from 'framer-motion';
import { MoonLoader } from 'react-spinners';

const LogoutConfirmationModal = ({onClose}) => {
  
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { theme } = useSelector(state => state.theme);
  const nav = useNavigate();
  
  const logOut = async () => {
    setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
                withCredentials: true
            });
            
            if (res.data.success) {
                nav("/");
                dispatch(reset());
                setLoading(false);
                onClose();
            }
        } catch (e) {
            setMessage(e?.response?.data?.message);
            setLoading(false);
        }
    };
    
    
  return (
    <motion.div
    variants = {variant} 
      initial = "before" 
      animate = "after" 
      exit = "before"
    onClick = {onClose} className = "fixed inset-0 flex justify-center items-center bg-[#00000085] z-30">
      <main
      
      onClick = {e => e.stopPropagation()}
      className = "p-4 bg-[#F0ECCF] dark:bg-[#2D2D30] rounded-lg w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12 flex flex-col items-center gap-8"
      >
        <h5 className = "text-center text-[#8B5E3C] dark:text-neutral-100 responsive-sm">Log out</h5>
      <section className = "text-center">  <h1 className = "text-[#8B5E3C] dark:text-neutral-100 font-bold responsive-2xl">
          Are you sure?
        </h1>
        <p className = "text-[#8B5E3C] dark:text-neutral-100 responsive-xs">The changes will automatically be saved.</p>
        </section>
 
          <button onClick = {logOut}className = "p-2 dark:text-gray-700 w-20 rounded shadow-md bg-neutral-100">{ loading ? <MoonLoader size = "16" color = {theme === "light" ? "#8B5E3C" : "black"}/> : "Log Out"}</button>
          {
            message && <p className = "text-center responsive-xs text-red-500">{message}</p>
          }
      </main>
    </motion.div>
  )
}

export default LogoutConfirmationModal