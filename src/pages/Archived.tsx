import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import Note from '../components/Note.tsx';
import axios from 'axios';
import { fetchUser } from '../state/userSlice.ts';
import ErrorModal from '../components/Error.tsx';
import ActionModal from '../components/ActionModal.tsx';
import LoadingDisplay from '../components/Loading.tsx';
import { variant, slideVariant } from '../variants/variant.ts';
import { motion, AnimatePresence } from 'framer-motion';
import { TbNotesOff } from "react-icons/tb";
import { MoonLoader } from 'react-spinners';

const Archived = () => {
  const { user, loading, error} = useSelector(state => state.user);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [isActionModalOpen, setIsActionModalOpen] = useState<boolean>(false);
  const [isGetArchivedNotesPending, setIsGetArchivedNotesPending] = useState<boolean>(false);
  const dispatch = useDispatch();
  const location = useLocation();
  
  
  const getArchivedNotes = useCallback(async() => {
    
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/archive/notes`, {
        params: {
          userId: user._id
        }
      });
      setArchivedNotes(res?.data?.notes);
      
    }catch(e){
      
    }
  }, [user])
  
  
  
  useEffect(() => {
    getArchivedNotes();
    const timeOut = setTimeout(() => {
      setIsGetArchivedNotesPending(false);
    }, 200)
    return() => {
      clearTimeout(timeOut)
    }
  }, [user]);
  
  useEffect(() => {
    setIsGetArchivedNotesPending(true);
    dispatch(fetchUser());
  }, [])
  
  useEffect(() => {
    document.body.style.overflow = isActionModalOpen ? "hidden" : "";
    return() => {
      document.body.style.overflow = ""
    }
  }, [isActionModalOpen])
  
  const handlePushNote = useCallback((getNoteInfo) => {
    let cpySelectedNotes = [...selectedNotes];
    const isNoteExisting = cpySelectedNotes.length !== 0 ? selectedNotes.filter(item => item._id === getNoteInfo._id) : []
    
    if(isNoteExisting.length > 0){
        cpySelectedNotes = cpySelectedNotes.filter(item => item._id !== getNoteInfo._id);
    }else{
      cpySelectedNotes.push({ _id: getNoteInfo._id})
    }
    
    if(cpySelectedNotes.length === archivedNotes.length){
      setIsAllSelected(true);
    }else{
      setIsAllSelected(false)
    }
    setSelectedNotes(cpySelectedNotes)
  }, [selectedNotes])
  
  
  const onClose = () => {
    setIsEditing(false);
    setSelectedNotes([]);
    setIsActionModalOpen(false);
  };
  
  const handleSelect = () => {
    if(isAllSelected){
      setSelectedNotes([]);
     return setIsAllSelected(false);
    }
    if(archivedNotes.length === 0){
      return;
    }
    let cpySelectedNotes = [...selectedNotes];
      archivedNotes.forEach(item => cpySelectedNotes.push({ _id: item._id}))
    setSelectedNotes(cpySelectedNotes)
    
   return setIsAllSelected(true);
  }
  
  if(error){
    return <ErrorModal />
  }
  
  if(loading || isGetArchivedNotesPending){
    return <LoadingDisplay />
  }
  
 if(Object.keys(user).length > 0) return (
    <motion.div
    variants = {variant}
                        initial = "before"
                        animate = "after" 
                        
    className = "flex flex-col items-center gao-4"><AnimatePresence>{
      isActionModalOpen && <ActionModal selectedNotes = { selectedNotes} onClose = {onClose} onHide = {() => setIsActionModalOpen(false)} getAllNotes = {getArchivedNotes} />
    }
    </AnimatePresence>
            <nav className = "flex items-center w-full justify-between py-4 shadow-[#faf0e6] text-[#8B5E3C] dark:text-neutral-100 dark:shadow-[#1A1F2E] px-6 shadow-md"><NavLink to = "/home" >Back</NavLink>
            
            <section className = "flex items-center gap-4 responsive-sm">
              <button className = {` ${archivedNotes.length === 0 ? "text-[#e2cab5] dark:text-neutral-400" : "text-[#8B5E3C] dark:text-neutral-100"} `}onClick = {(isEditing && archivedNotes.length > 0) ? onClose : archivedNotes.length > 0 ? () => setIsEditing(true) : null}>{isEditing ? "Cancel" : "Edit"}</button>
              <h1 className = "text-[#8B5E3C] dark:text-neutral-100 ">Archived notes</h1>
            </section>
            </nav>
            <main className = "w-11/12">
              <section className = " my-4 h-6">
              <AnimatePresence>{
                isEditing ? <motion.section
                variants = {slideVariant}
                initial = "before"
                animate = "after" 
                exit = "before"
                className = "w-full justify-around flex items-center truncate responsive-sm ">
                  <button className = "text-[#8B5E3C] dark:text-neutral-100" onClick = { handleSelect}>{isAllSelected ? "Deselect All" : "Select All"}</button>
                  <button className = {` text-[#8B5E3C] dark:text-neutral-100 ${selectedNotes.length < 1 && "text-[#e2cab5] dark:text-gray-400"}`} onClick = {selectedNotes.length > 0 ? () => setIsActionModalOpen(true) : null}>Done</button>
                </motion.section> : <motion.p
                variants = {variant}
                initial = "before"
               animate = "after"
                exit = "before"
                className = "responsive-sm text-[#8B5E3C] dark:text-neutral-100  text-center"
                >Archived Notes</motion.p>
              }
              </AnimatePresence>
              </section>
              {
                archivedNotes.length < 1 ? <motion.div 
                variants = {variant} 
                initial = "before" 
                animate = "after" 
                
                className = "w-full flex flex-col items-center justify-center gap-4text-center my-5 inset-0 relative">
                  <TbNotesOff className = "text-[#8B5E3C] dark:text-neutral-100 size-16"/>
                  <p className = " responsive-sm text-[#8B5E3C] dark:text-neutral-100 ">Nothing to see here...</p></motion.div> : archivedNotes.map(item => <Note pushNote = {handlePushNote} selectedNotes = {selectedNotes} isEditing = {isEditing}  key = {item._id }noteInfo = {item} />)
              }
            </main>
    </motion.div>
  )
}

export default Archived