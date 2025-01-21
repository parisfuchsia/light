import { useEffect } from 'react';
import Signup from './pages/Signup.tsx';
import Login from './pages/Login.tsx';
import Home from './pages/Home.tsx';
import Archived from './pages/Archived.tsx';
import NotePage from './pages/NotePage.tsx';
import NotFound from './pages/NotFound.tsx';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from './state/userSlice.ts';
import { changeThemeTo } from './state/themeSlice.ts';


function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { theme } = useSelector(state => state.theme)
  
  useEffect(() => {
    if(location.pathname === "/" || location.pathname === "/register"){
      dispatch(reset())
    }
    dispatch(changeThemeTo(localStorage.getItem("theme") || "light"))
  }, [location, dispatch])
  
  useEffect(() => {
    document.body.style.backgroundColor = theme === "dark" ? "#2D2D30" : "#FAFAE6"
    document.body.style.color = theme === "dark" ? "#f5f5f5" : "#8B5E3C"
  }, [theme])

  return (
    <div className = {`ontainer  mx-auto ${theme === "dark" && "dark"}`}>
      <Routes>
        <Route path = "/register" element = {<Signup />} />
        <Route path = "/" element = {<Login />} />
        <Route path = "/home" element = { 
          <Home />
        } />
        <Route path = "/note/:id" element = { 
          <NotePage />
        } />
                <Route path = "/archive" element = { 
          <Archived /> }/>
          <Route path = "*" element = {
            <NotFound />
          }/>
    </Routes>
    
    </div>
  )
}

export default App
