
import { motion } from 'framer-motion';
import { variant } from '../variants/variant.ts';
import DarkMode from '../components/DarkMode.tsx';


const Banner = () => {

  return (
     <motion.h1 
    variants = {variant}
    initial = "before"
      animate = "after"
    className = " absolute top-0 text-center p-6 flex justify-between items-center inset-x-0 font-[times] mb-7 italic"><p className = "responsive-xl text-[#8B5E3C] dark:text-neutral-100 ">Notes App</p><div className = "responsive-lg"> 
    <DarkMode />
    </div>
    </motion.h1>
  )
}

export default Banner