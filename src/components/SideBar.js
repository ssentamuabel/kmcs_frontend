import React from 'react'
import { NavLink } from 'react-router-dom'


const SideBar = ({children})=>{

    const menuItem = [
        {
            "path" : "/dashboard",
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

                </div>
                
            </div>
            <main>{children}</main>
        </div>
    )
}

export default SideBar