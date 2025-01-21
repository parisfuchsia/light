import { useState, useEffect, useMemo, useCallback } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, reset } from "../state/userSlice.ts";
import Note from "../components/Note.tsx";
import axios from "axios";
import ErrorModal from "../components/Error.tsx";
import Options from "../components/Options.tsx";
import ActionModal from '../components/ActionModal.tsx';
import LoadingDisplay from '../components/Loading.tsx';
import SearchDropdown from '../components/SearchBar.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { variant, slideVariant } from '../variants/variant.ts';
import { MoonLoader } from 'react-spinners';
import LogoutConfirmation from '../components/LogoutConfirmationModal.tsx';


const Home = () => {
    const { user, loading, error } = useSelector(state => state.user);
    const { theme } = useSelector(state => state.theme);
    const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
    const [isActionModalOpen, setIsActionModalOpen] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [notes, setNotes] = useState([]);
    const [selectedType, setSelectedType] = useState<{
        NOTE: boolean;
        PIN: boolean;
        ALL: boolean;
    }>({
        NOTE: false,
        PIN: false,
        ALL: false
    });
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
    const dispatch = useDispatch();
    const nav = useNavigate();
    const location = useLocation();

    const getAllNotes = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/all/notes`, {
                params: {
                    userId: user._id
                }
            });
            
            setNotes(res.data.notes);
        } catch (e) {
            
        }
    };

    useEffect(() => {
        dispatch(fetchUser());
    }, []);

    useEffect(() => {
        getAllNotes();
    }, [user]);
    
    const noteByType = getType => {
        const note = notes.reduce((acc, prev) => {
          if(getType === "ALL"){
            acc.push(prev);
       
          }else if (prev.noteType === getType) {
                acc.push(prev);
            }
            return acc;
        }, []);
        return note;
    };

    const handlePushNote = useCallback(
        getNoteObj => {
            let cpySelectedNotes = [...selectedNotes];

                const index = cpySelectedNotes.findIndex(
                    item => item._id === getNoteObj._id
                );
              if(index > -1){ 
                cpySelectedNotes.splice(index, 1);
                const { noteType } = getNoteObj;
                setSelectedType(prev => {
                  return {
                    ...prev, [noteType] : false
                  }
                })
              }else{
                cpySelectedNotes.push(getNoteObj);
              }
              
            setSelectedNotes(cpySelectedNotes);
        },
        [selectedNotes]
    );


    const selectAllNotesByType = getType => {
        //getType: either NOTE OR PIN
        const note = notes.filter(item => item.noteType === getType);
        setSelectedNotes(prev => {
            return [...prev,  ...note];
        });
        setSelectedType(prev => {
            return {
                ...prev,
                [getType]: true
            };
        });
    };

    const deselectAllNotesByType = getType => {
        //getNoteType: either pIN or NOTE
        const notGetType = selectedNotes.filter(item => item.noteType !== getType)
        
        setSelectedNotes([...notGetType]);
        setSelectedType(prev => {
            return { ...prev, [getType]: false };
        });
    };
    
    const selectAllNotes = () => {
      const noteHandler = notes.reduce((acc, prev) => {
        const { _id, noteType } = prev;
        acc.push({ _id, noteType });
        return acc;
      }, [...selectedNotes])
      setSelectedNotes([...noteHandler]);
      setSelectedType(prev => {
        return {...prev, ALL: true, NOTE: true, PIN: true}
      })
    }
    
    const deselectAllNotes = () => {
      setSelectedNotes([]);
      setSelectedType(prev => {
        return {...prev, ALL: false, NOTE: false, PIN: false}
      })
    }
    
    const cancelEdit = () => {
      deselectAllNotes();
        setIsEditing(false);
        setIsActionModalOpen(false)
    };
    
    
    useEffect(() => {
      const types = ["NOTE", "PIN"]
      if(notes.length > 0){
        types.forEach(type => {
        const filteredNotesType = notes.filter(item => item.noteType === type); 
        const filteredSelectedNotes = selectedNotes.filter(item => item.noteType === type);
        if(filteredNotesType.length === filteredSelectedNotes.length){
          setSelectedType(prev => {
            return {
              ...prev, [type] : true
            }
          })
        }
      })
      }
    }, [selectedNotes])
    
    useEffect(() => {
      document.body.style.overflow = isActionModalOpen ? "hidden" : "";
      return() => {
        document.body.style.overflow = "";
      }
    }, [isActionModalOpen])
    
    

    if (loading) {
          return <LoadingDisplay />
    }

    if (error) {
        return <ErrorModal/>;
    }

   if(Object.keys(user).length > 0){ return (
        <motion.div 
        variants = {variant} 
        initial = "before" 
        animate = "after" 
        className="flex flex-col gap-2 items-center">
          <AnimatePresence>
            
          </AnimatePresence>
          <AnimatePresence>
                      {
                      isLogoutModalOpen ? <LogoutConfirmation onClose = {() => setIsLogoutModalOpen(false)} /> : 
           (isActionModalOpen && <ActionModal selectedNotes = {selectedNotes} onClose = {cancelEdit} onHide = {() => setIsActionModalOpen(false)} getAllNotes = {getAllNotes} />)
          }
          </AnimatePresence>
            <nav className="absolute inset-x-0 py-5 px-8 flex shadow-md dark:shadow-[#1A1F2E] shadow-[#faf0e6]  items-center justify-between">
                <h1 className="dark:text-neutral-100 text-[#8B5E3C] responsive-lg">Notes</h1>
                <section className="flex items-center gap-2 responsive-xs">
                    <Options handleEdit={() => setIsEditing(true)} pinnedNotes = {noteByType("PIN")} notes = {noteByType("NOTE")}/>
                    <p className="dark:text-gray-400 text-[#D3B396]">{user.username}</p>
                    <button className = "text-[#8B5E3C] dark:text-neutral-100"onClick={() => setIsLogoutModalOpen(true)}>Logout</button>
                </section>
            </nav>
            <main className="relative top-20 w-11/12 flex flex-col items-center gap-1">
                <div className="w-full justify-end">
                  <div className = "min-h-6">
                  <AnimatePresence>
                    {isEditing ? (
                        <motion.div
                        variants = {slideVariant}
                        initial = "before"
                        animate = "after"
                        exit = "before"
                        className="w-full truncate flex items-center responsive-sm justify-between">
                            <button className = "text-[#8B5E3C] dark:text-neutral-100 " onClick={cancelEdit}>Cancel</button>
                            <button className = "text-[#8B5E3C] dark:text-neutral-100" onClick = {selectedType.ALL  || selectedNotes.length === (noteByType("PIN").length + noteByType("NOTE").length ) ? deselectAllNotes : selectAllNotes}>{
                              selectedType.ALL || selectedNotes.length === (noteByType("PIN").length + noteByType("NOTE").length ) ? "Deselect All" : "Select All"
                            }</button>
                            <button className = {`  ${selectedNotes.length === 0 ? "text-[#e2cab5] dark:text-neutral-400" : "text-[#8B5E3C] dark:text-neutral-100"}`} onClick = {selectedNotes.length > 0 ? () => setIsActionModalOpen(true) : null}>Done</button>
                        </motion.div>
                    ) : <SearchDropdown notes = {notes}/>}
                    </AnimatePresence>
                    </div>
                </div>
                <main className="w-full my-5 flex flex-col gap-8">
                    <section className="w-full">
                        <section className="flex items-center gap-2 w-full text-left mb-4">
                            {isEditing && noteByType("PIN").length > 0 && (
                                <input
                                    checked={selectedType.PIN && selectedNotes.length > 0}
                                    onChange={
                                        selectedType.PIN
                                            ? () => deselectAllNotesByType("PIN")
                                            : () => selectAllNotesByType("PIN")
                                    }
                                    type="checkbox"
                                />
                            )}
                            <p className=" responsive-xs text-[#8B5E3C] dark:text-neutral-100 ">Pinned</p>
                        </section>
                        {noteByType("PIN").length > 0 ? (
                            noteByType("PIN").slice().reverse().map(note => (
                                <Note
                                    key={note._id}
                                    isEditing={isEditing}
                                    selectedNotes={selectedNotes}
                                    pushNote={handlePushNote}
                                    noteInfo={note}
                                />
                            ))
                        ) : (
                            <div className="h-[0.3px] w-full bg-gray-700"></div>
                        )}
                    </section>
                    <section className="w-full">
                        <section className=" flex items-center gap-2 mb-4 w-full text-left ">
                            {isEditing && noteByType("NOTE").length > 0 && (
                                <input
                                    checked={selectedType.NOTE && selectedNotes.length > 0}
                                    onChange={
                                        selectedType.NOTE
                                            ? () => deselectAllNotesByType("NOTE")
                                            : () => selectAllNotesByType("NOTE")
                                    }
                                    type="checkbox"
                                />
                            )}
                            <p className=" responsive-xs text-[#8B5E3C] dark:text-neutral-100 ">Notes</p>
                        </section>
                        {noteByType("NOTE").length > 0 ? (
                            noteByType("NOTE").slice().reverse().map(note => (
                                <Note
                                    key={note._id}
                                    isEditing={isEditing}
                                    selectedNotes={selectedNotes}
                                    pushNote={handlePushNote}
                                    noteInfo={note}
                                />
                            ))
                        ) : (
                            <div className="h-[0.3px] w-full bg-gray-700"></div>
                        )}
                    </section>
                </main>
            </main>
        </motion.div>
    )} 
};

export default Home;
