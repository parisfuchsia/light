
import { useNavigate } from 'react-router-dom';
import { months } from '../data/index.ts';
import { motion, AnimatePresence } from 'framer-motion';
import { variant, slideVariant } from '../variants/variant.ts';

const Note = ({noteInfo, pushNote, isEditing, selectedNotes}) => {
  const { createdAt, note, title, noteType, _id, userId } = noteInfo;
  const [year, month, day] = createdAt.split("T")[0].split("-").map(Number);
  const nav = useNavigate();
  
    
    const handleRouting = () => {
      nav(`/note/${_id}`)
    }
  
  return (
    <motion.li
    variants = {variant} 
    initial = "before" 
    animate = "after"
    onClick = { isEditing ? () => pushNote({ _id, noteType}) : handleRouting} key = {note._id} className = "w-full dark:bg-[#262629] bg-[#F0ECCF] md:w-10/12 lg:w-8/12 xl:w-7/12 rounded shadow-md dark:shadow-[#1A1F2E] shadow-[#faf0e6] hover:bg-[#E8E2C5] dark:hover:bg-[#1F1F21] px-6 py-2 min-h-24 flex items-center my-1 ">
      <AnimatePresence>
      {
        isEditing && <motion.input
        initial = {{ opacity: 0, width: 0, marginRight:0 }}
    animate = {{ opacity: 1,  width: "auto", marginRight: "10px" }}
    exit = {{ opacity: 0, width: 0, marginRight: 0 }}
    
        checked = {selectedNotes.some(item => item._id === _id)} type = "checkbox" />
      }
      </AnimatePresence>

<section className = "flex flex-col h-full justify-between w-full">
        <p className = "responsive-base truncate w-full text-[#8B5E3C] dark:text-neutral-100 ">{title || note}</p>
      <p className = "responsive-xs text-[#8B5E3C] dark:text-neutral-100  "> {`${year} ${months[month - 1]} ${day}` + " | " + createdAt.split("T")[1].split(".")[0]}</p>
</section>
    </motion.li>
  )
}

export default Note