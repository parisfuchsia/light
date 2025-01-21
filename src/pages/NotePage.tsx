import { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { months } from '../data/index.ts';
import axios from 'axios';
import { fetchUser } from '../state/userSlice.ts';

import ErrorModal from '../components/Error.tsx';
import { motion } from 'framer-motion';
import { variant } from '../variants/variant.ts';
import LoadingDisplay from '../components/Loading.tsx';

const NotePage = () => {
  const { id } = useParams();
  
  const [noteFormat, setNoteFormat] = useState<{
    title: string,
    note: string,
    noteId: string,
    createdAt: string,
    updatedAt: string
  }>({
    title: "",
    note: "",
    noteId: "",
    createdAt: "",
    updatedAt: ""
  });
  const [isFetchingNotePending, setIsFetchingNotePending] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  
  const { user, error, loading } = useSelector(state => state.user);
  const textAreaRef = useRef(null);
  const dispatch = useDispatch();
  const nav = useNavigate();
 
  const handleChange = e => {
    const { name, value } = e.target; 
    setNoteFormat(prev => {
      return {
        ...prev, [name] : value
      }
    })
  };
  
  useEffect(() => {
    dispatch(fetchUser());
  }, [id]) 
  
  useEffect(() => {
    if(id !== "new"){
      setIsFetchingNotePending(true)
      fetchSpecificNote();
    }
  }, [user, id])
  
  useEffect(() => {
    const { current } = textAreaRef;
    if(current){
      current.style.height = "auto";
      const totalHeight = current.scrollHeight;
      current.style.height = `${totalHeight}px`
    }
  }, [noteFormat]);
  
  const postNote = async() => {
    try {
      const { title, note } = noteFormat;
      if(!title || !note){
        return;
      }
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/add/note`, {
        title,
        note,
        userId: user._id
      })
      if(res?.data?.success){
        
        nav("/home")
      }
    }catch(e){
       
    }
  };
  
  const fetchSpecificNote = async() => {
    
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/specific/note/${id}`, {
        params: {
          userId: user._id
        }
      })
      const { title, _id, note, createdAt, updatedAt} = res.data.notes;
      
      setNoteFormat({title, note, noteId: _id, createdAt, updatedAt})
      
      setIsFetchingNotePending(false)
      
    }catch(e){
      
      
      
      setIsFetchingNotePending(false)
      
    }
  }
  
  const updateNote = async() => {
    try {
      const { title, note } = noteFormat;
      if(!title || !note){
        return;
      }
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/update/note/${id}`, {
        title,
        note,
        userId: user._id
      })
      if(res.data.success){
        nav("/home")
      }
    }catch(e){
   
    }
  }
  
  const wordLength = useMemo(() => {
    const getValidWordLength = (getType) => {
      const words = getType === "note" ? noteFormat.note.split(" ") : noteFormat.title.split(" ");
    const validWords = words.filter(wrd => wrd.length > 0);
    return validWords.length;
    }
    return getValidWordLength
  }, [noteFormat])
  
  const dateFormatOf = useMemo(() => {
    const getDateFormat = (getType: "createdAt" | "updatedAt" | "dateNow") => {
      if(getType === "dateNow"){
        const today = new Date();
        return `${months[today.getMonth() ]} ${today.getDate()}, ${today.getFullYear()}`
      }
      const [year, month, date] = getType === "createdAt" ? noteFormat.createdAt.split("T")[0].split("-").map(Number) : noteFormat.updatedAt.split("T")[0].split("-").map(Number);
      return `${months[month - 1]} ${date}, ${year}`
    }
    return getDateFormat;
  }, [noteFormat.createdAt, noteFormat.updatedAt])
  
  const handleCopy = () => {
    navigator.clipboard.writeText(noteFormat.note);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }
  
  if(error ){
    return <ErrorModal/>
  }
  
  if((id !== "new" && !noteFormat.noteId) || Object.keys(user).length === 0 || loading || isFetchingNotePending){
      return <LoadingDisplay />
  }
  
  
 
  if(Object.keys(user).length > 0) return (
    <motion.div
    variants = {variant}
                        initial = "before"
                        animate = "after" 
                        
    className = "overflow-hidden flex flex-col w-full gap-8 items-center pb-8">

      <nav className = "flex items-center w-full justify-between py-4 dark:shadow-[#1A1F2E] shadow-[#faf0e6] px-6 shadow-md"><NavLink to = {-1} className = "responsive-sm text-[#8B5E3C] dark:text-neutral-100 ">Back</NavLink><button className = {`responsive-sm text-[#8B5E3C] dark:text-neutral-100 ${(!wordLength("note") || !wordLength("title")) && "text-[#D3B396] dark:text-neutral-400"}`} onClick = {id === "new" ? postNote : updateNote}>{
        id === "new" ? "Post" : "Update"
      }</button></nav>
      <main className = "flex flex-col pr-2 w-11/12 rounded-lg  pb-4  ">
 
        <input value = {noteFormat.title} onChange = {handleChange} name = "title" placeholder = "Input title" type = "text" className = " bg-[#FAFAE6] dark:bg-[#2D2D30] text-[#8B5E3C] dark:text-neutral-100  responsive-3xl placeholder-[#e2cab5] dark:placeholder-neutral-400 rounded outline-none pb-3 py-6"/>
                  <section className = "flex items-center justify-between">
          <p className = " responsive-sm text-[#d4b5a3] dark:text-neutral-100 ">
            { wordLength("note")} words | {
              id !== "new" ? `Last updated:  ${dateFormatOf("updatedAt")}` : dateFormatOf("dateNow")
            }
          </p>
          <button onClick = {handleCopy} className = "responsive-xs text-[#8B5E3C] dark:text-neutral-100  mr-2">{isCopied ? "Copied!" : "Copy"}</button>
        </section>
        <div className = "w-full mt-2 h-[1px] bg-[#d4b5a3] opacity-20 "></div>
        <textarea value = {noteFormat.note} ref = {textAreaRef} onChange = {handleChange}  name = "note"placeholder = "Start typing your notes here..." type = "text" className = "bg-[#FAFAE6] text-[#8B5E3C] dark:text-neutral-100  dark:placeholder-neutral-400 dark:bg-[#2D2D30] my-6 rounded-md  placeholder-[#e2cab5] responsive-base w-full outline-none p-2"/>
      </main>
    </motion.div>
  )
}

export default NotePage