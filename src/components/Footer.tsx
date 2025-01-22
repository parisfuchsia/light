
import { FaGithub, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className = "bg-[#F0ECCF] inset-x-0 relative dark:bg-[#1F1F21] flex flex-col gap-8 items-center justify-center w-[100vw] bottom-0 p-4">
      <main className = "flex gap-4 items-center justify-center ">
        <h1 className = "text-[#8B5E3C] dark:text-neutral-300 ">© 2025 Parisfuchsia </h1>
        <h5 className = "text-[#8B5E3C] dark:text-neutral-300 ">|</h5>
        <section className = "flex items-center gap-2 ">
          <a href = "https://github.com/parisfuchsia"><FaGithub className = "text-[#8B5E3C]  dark:text-neutral-300  size-10" /></a>
          <a href = "https://www.facebook.com/a.hopelieswithin?mibextid=ZbWKwL"><FaFacebook className = " text-[#8B5E3C] dark:text-neutral-300 size-10"/></a>
        </section>
      </main>
      <p className = "text-[#8B5E3C] dark:text-neutral-300 responsive-sm">Made with MERN Stack</p>
    </footer>
  )
}

export default Footer