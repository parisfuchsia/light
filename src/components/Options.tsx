import { useState, useRef, useEffect } from 'react'
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion';
import { variant } from '../variants/variant.ts';

const Options = ({handleEdit, notes, pinnedNotes}) => {
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const optionRef = useRef(null);
  const controllerRef = useRef(null);
  
  const dispatchEdit = () => {
    setIsOpen(false);
    handleEdit();
  }
  
  useEffect(() => {
    if(!isOpen) return;
    
    const handleClickOutside = event => {
    if((optionRef.current && !optionRef.current.contains(event.target)) && !controllerRef.current.contains(event.target)){
      setIsOpen(false);
    }}
    
    document.documentElement.addEventListener("touchstart", handleClickOutside)
    
  return() => {
    document.documentElement.removeEventListener("touchstart", handleClickOutside);
  }
  }, [isOpen])
  
  return (
    <div
    className = "flex items-center z-20">
      <div className = "text-gray-700 dark:text-neutral-100 "ref = {controllerRef} onClick = {() => setIsOpen(prev => !prev)}>
        {
          isOpen ? <CiCircleMinus className = "size-5"/> :       <CiCirclePlus className = "size-5"/>
        }
      </div>
      <AnimatePresence>
      {
        isOpen &&  <motion.section 
        variants = {variant}
        ref = {optionRef}
                        initial = "before"
                        animate = "after" 
                        exit = "before"
        className = "absolute top-12 bg-neutral-100  rounded-lg overflow-hidden dark:bg-[#2D2D30] flex flex-col divide-y-solid divide-y responsive-base items-start shadow-lg">
        <NavLink to = "/note/new" className = "text-left w-full p-3 dark:bg-[#262629] bg-neutral-100 text-[#8B5E3C] dark:text-neutral-100 dark:hover:bg-[#1F1F21] hover:bg-neutral-200 ">Add note</NavLink>
        <NavLink className = "text-[#8B5E3C] dark:text-neutral-100 text-left w-full p-3 bg-neutral-100 dark:hover:bg-[#1F1F21] dark:bg-[#262629] hover:bg-neutral-200 " to = "/archive">Archive</NavLink>
        <button onClick = {notes.length > 0 || pinnedNotes.length > 0 ?  dispatchEdit : null}className = {`text-left w-full text-[#8B5E3C] dark:text-neutral-100  dark:hover:bg-[#1F1F21] dark:bg-[#262629] bg-neutral-100 p-3  hover:bg-neutral-200 ${(notes.length + pinnedNotes.length) === 0 ? "text-[#e2cab5] dark:text-neutral-400" : "text-[#8B5E3C] dark:text-neutral-100  "}`}>Edit</button>

      </motion.section>
      }
      </AnimatePresence>
    </div>
  )
}

export default Options