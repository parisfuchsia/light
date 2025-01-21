import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { slideVariant, variant } from '../variants/variant.ts';
import { useSelector } from 'react-redux';
import { changeThemeTo } from '../state/themeSlice.ts';
import { Link } from 'react-router-dom';
import DarkMode from '../components/DarkMode.tsx';

const SearchBar = ({notes}) => {
  const [query, setQuery] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [filteredNotes, setFilteredNotes] = useState<string[]>([]);
  const { theme } = useSelector(state => state.theme);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    if(!query || !notes){
      return setIsDropdownOpen(false);
    }
    const handler = setTimeout(() => {
      const queryCharArray = query.split("");
      const filtered = notes.filter(note => {
        return queryCharArray.every(letter => note.title.includes(letter))
      })
      setFilteredNotes(filtered);
     setIsDropdownOpen(true);
    }, 200)
    
    return() => {
      clearTimeout(handler);
    }
    
  }, [query]);
  
  useEffect(() => {
    if(!isDropdownOpen){return};
    const handleClickOutside = (event) => {
      if((dropdownRef.current && !dropdownRef.current.contains(event.target))){
        setIsDropdownOpen(false);
      }
    }
    document.documentElement.addEventListener("touchstart", handleClickOutside);
    return() => {
      document.documentElement.removeEventListener("touchstart", handleClickOutside)
    }
    
  }, [isDropdownOpen])
  
  
  return (
    <motion.div
    variants = {slideVariant}
    initial = "before" 
    animate = "after" 
    exit = "before"
    className = "w-full ">
      <section className = "flex items-center w-full,">
      <DarkMode />
      <input value = {query} onChange = {(e) => setQuery(e.target.value)}type = "text" className = "w-full p-2 rounded-lg placeholder-[#8B5E3C70] dark:text-gray-700 dark:placeholder-[#2D2D3070] dark:outline-[#2D2D30] outline outline-[#8B5E3C50]" placeholder = "Search title keywords here..." />
      </section>
      <AnimatePresence>
        {
          isDropdownOpen && <motion.main 
          variants = {variant}
          ref = {dropdownRef}
          initial = "before" 
          animate = "after" 
          exit = "before"
          className = "w-full outline rounded-lg text-left  absolute responsive-sm">
            {
              filteredNotes.length > 0 ? filteredNotes.map(note => {
                return <Link to = {`/note/${note._id}`}><div className = "p-3  w-full dark:bg-[#2D2D30] hover:bg-[#E8E2C5] dark:hover:bg-[#1F1F21] flex items-center justify-between bg-[#F8F5D9]">
                  
                  <p className = "text-[#8B5E3C] dark:text-neutral-100 ">{note?.title}</p>
                  <p className = "text-[#8B5E3C] dark:text-neutral-100 ">{note.noteType.toLowerCase()}</p>
                </div>
                </Link>
              }) : <p className = "p-3 text-[#8B5E3C] dark:text-neutral-100 rounded-lg w-full dark:bg-[#2D2D30] bg-[#F8F5D9]">No notes found</p>
            }
          </motion.main>
        }
      </AnimatePresence>
    </motion.div>
  )
}

export default SearchBar