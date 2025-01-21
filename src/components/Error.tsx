
import { NavLink } from 'react-router-dom';

const Error = ({msg = ["Session Expired"]}) => {
  return (
    <div className = "bg-[#00000085] inset-0 fixed flex justify-center items-center">
      <main className = "p-4 w-10/12 md:w-8/12 lg:w-7/12 xl:w-6/12 rounded-lg bg-gray-700 text-neutral-100 responsive-base">
        <p className = "w-full text-center responsive-xs">Something unexpected happened</p>
        <section className = "my-4">
          <p >Possible reasons:</p>
          <ul className = "ml-2 mb-4 responsive-sm">
            {
              msg.map(message => <li>
                {message}
              </li>)
            }
          </ul>
          </section>
          <section className = "w-full justify-end flex gap-4 items-center">
            <NavLink className = "px-2 py-1 rounded bg-white text-gray-700 responsive-sm" to = "/">Login</NavLink>
            <button className = "responsive-sm px-2 py-1 rounded bg-white text-gray-700" onClick = {() => window.location.reload()}>Retry</button>
          </section>
     
      </main>
    </div>
  )
}

export default Error