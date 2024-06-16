import { Link, useLocation } from "react-router-dom"


const Welcome = () => {
    const date = new Date()
    const today = new Intl.DateTimeFormat("en-Us", { dateStyle: "full", timeStyle: "long" }).format(date);

    // const { pathname } = useLocation();

    // let noteLink = "";
    //     if(pathname === "/dash"){
    //         noteLink = "notes"
    //     }else {
    //         noteLink = "dash/notes"
    //     }
    // let userLink = "";
    //     if(pathname === "/dash"){
    //         userLink = "users"
    //     }else {
    //         userLink = "dash/users"
    //     }

        
    
    const content = (
        <section className="welcome">
           <p>{today}</p>

           <h1>Welcome</h1>

           <p><Link to="/dash/notes"> View techNotes</Link></p>
           <p><Link to="/dash/notes/new"> Add New techNotes</Link></p>

           <p><Link to="/dash/users"> View User Setting</Link></p>
           <p><Link to="/dash/users/new"> Add New User</Link></p>
        </section>
    )

    return content
  
}

export default Welcome