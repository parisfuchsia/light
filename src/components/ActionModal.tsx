
import axios from 'axios';
import { motion } from 'framer-motion';
import { variant } from '../variants/variant.ts';

const ActionModal = ({ selectedNotes, onClose, getAllNotes, onHide }) => {
  
  const handleDelete = async() => {
    const selectedIds = selectedNotes.reduce((acc, prev) => {
      acc.push(prev._id);
      return acc;
    }, []);
    
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/delete/notes`, {
        params: {
          selectedIds
        }
      })
      onClose();
      getAllNotes();
    }catch(e){
    }
  }
  const handleUpdate = async(getPayload) => {
    const selectedIds = selectedNotes.reduce((acc, prev) => {
      if(prev.noteType !== getPayload){
      acc.push(prev._id);
      }
      return acc;
    }, []);
    
    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/update/notes`, {
          selectedIds,
          changeTo: getPayload
      });
      onClose();
      getAllNotes();
    }catch(e){
    }
  }
  
  return (
    <motion.div
    variants = {variant}
    initial = "before"
    animate = "after" 
    exit = "before"
    
    onClick = {onHide}className = "flex flex-col gap-4 z-50 fixed inset-0 bg-[#00000095] items-center justify-center">
      <main onClick = {(e) => e.stopPropagation()}className = "w-10/12 flex flex-col  p-4 rounded dark:bg-[#2D2D30] bg-[#F8F5D9]">
        <div className = "w-full responsive-xs dark:text-neutral-400  text-center">Actions</div>
        <section className = "flex flex-col gap-1 items-start responsive-sm">
                  <button onClick = {() => handleUpdate("PIN")} className = "hover:bg-[#E8E2C5] text-[#8B5E3C] dark:text-neutral-100 dark:hover:bg-[#26262B] w-full text-left rounded p-2">Pin</button>
                  <button onClick = {() => handleUpdate("NOTE")} className = " text-[#8B5E3C] dark:text-neutral-100  dark:hover:bg-[#26262B] w-full text-left hover:bg-[#E8E2C5] rounded p-2">Unpin</button>
        <button onClick = {() => handleUpdate("ARCHIVE")}className = " w-full text-left text-[#8B5E3C] dark:text-neutral-100  dark:hover:bg-[#26262B] hover:bg-[#E8E2C5] rounded p-2">Move to archive</button>
        <button onClick = { handleDelete}className = "text-red-500  w-full text-left dark:hover:bg-[#26262B] hover:bg-[#E8E2C5] rounded p-2">Delete</button>
        </section>
      </main>
    </motion.div>
  )
}

export default ActionModal