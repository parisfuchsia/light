
import { useSelector, useDispatch } from 'react-redux';
import { changeThemeTo } from '../state/themeSlice.ts';
import { MdOutlineLightMode, MdOutlineNightlightRound } from "react-icons/md";

const DarkMode = () => {
  const { theme } = useSelector(state => state.theme)
  const dispatch = useDispatch();
  
  const handleChangeTheme = () => {
    localStorage.setItem("theme", theme === "light" ? "dark" : "light");
    dispatch(changeThemeTo(theme === "light" ? "dark" : "light"));
  }
  
  return (
          <button onClick = {handleChangeTheme} className = "p-2 text-gray-700 dark:text-neutral-100 delay-0 pl-0 responsive-xl">
        {
          theme === "dark" ? <MdOutlineLightMode /> : <MdOutlineNightlightRound />
        }
      </button>
  )
}

export default DarkMode