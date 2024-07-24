import React from 'react'
import { NavLink , Outlet} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'


const SideBar = ({onLogout})=>{
    
    
    const menuItem = [
        {
            "path" : "/",
            "name" : "Dashboard",
           
        },
        {
            "path" : "/members",
            "name" : "Members",
            
        },
        {
            path : "/programs",
            name : "Programs",
           
        },
        {
            path : "/settings",
            name : "Settings",
            
        }
    ]

    const handleLogout  = async() =>{
        try {
            
            const res =  await fetch('http://127.0.0.1:8000/logout/', {
                method : "POST",
                headers: {
                    'Content-Type': 'application/json',
                }  
            })

            if (res.ok){
                onLogout()
            }else{
                console.log("Something went wrong")
            }


        } catch (error) {
            console.log(error)
        }
    }

 
    return (
        <div className='container'>
            <div className="sidebar">
                <div className="top-section">
                   
                    <h1 className="title">KMCS</h1>
                   
                </div>
                <div className='nav'>
                {
                    menuItem.map((item, index)=>(
                        <NavLink  to={item.path} key={index} className='link'   >                            
                            <div className="link-text">{item.name}</div>
                        </NavLink>
                    ))
                }
                <a href="#" >
                    <div onClick={handleLogout}>logout</div>
                </a>
                </div>
                
            </div>
            <main>
                <Outlet /> 
            </main>
        </div>
    )
}

export default SideBar