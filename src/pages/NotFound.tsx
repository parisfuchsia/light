
import { NavLink } from 'react-router-dom';
import Footer from '../components/Footer.tsx';
const NotFound = () => {
  
  
  
  return (
    <div className = "container absolute inset-0 flex flex-col items-center justify-between ">
      <div className = "min-h-screen flex items-center justify-center flex-col gap-4 w-full ">
      <main className = "flex justify-center items-center gap-4">
      <h1 className = "responsive-4xl text-[#8B5E3C] dark:text-neutral-100 ">404</h1> 
      <h5 className = "text-[#8B5E3C] dark:text-neutral-100 ">|</h5>
      <h3 className = "responsive-base text-[#8B5E3C] dark:text-neutral-100 ">
        Page not found
      </h3>
      </main>
      <NavLink className = "text-[#8B5E3C] underline dark:text-neutral-100 " to = "/" >Login</NavLink>
      </div>
      <Footer />
    </div>
  )
}

export default NotFound