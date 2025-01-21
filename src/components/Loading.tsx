
import { useSelector } from 'react-redux';
import { MoonLoader } from 'react-spinners';
const Loading = () => {
  const { theme } = useSelector(state => state.theme);
  
  return (
   
       <div className = "flex items-center justify-center fixed inset-0 "><MoonLoader size = "40" color = {`${ theme === "light" ? "#8B5E3C" : "white"}`}/></div>
    
  )
}

export default Loading