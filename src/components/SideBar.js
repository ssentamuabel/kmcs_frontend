import React , { useRef, useState } from 'react'
import { NavLink , Outlet} from 'react-router-dom'
import Alert from './Alert'
import Header from './Header'
import { 
    FaTh,
    FaMoneyBillWave,
    FaMailBulk,
    FaUsers,
    FaBars,
    FaMosque,
    FaRegListAlt,
    FaLessThanEqual
} from 'react-icons/fa'
import { PiEngine } from 'react-icons/pi'
import { TbRuler2 } from 'react-icons/tb'



const SideBar = ({onLogout})=>{

    const [menuState, setMenuState] = useState(false)
    const sidebarRef = useRef(null);
    const [confirm, setConfirm] = useState(false)
    const [errorAlert, setErrorAlert] = useState(false)
    const [error, setError] = useState('')


    const handleMenuClick = ()=>{
        if (sidebarRef.current){
            setMenuState(true)            
            sidebarRef.current.style.display='block';
            
        }
    }
    

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
            setError(error.message)
            setConfirm(false)
            setErrorAlert(true)
        }
    }



    const handleNavClick = ()=>{
       
       if (menuState && sidebarRef.current){
            sidebarRef.current.style.display='none';
            setMenuState(false)
       }
    }

    
    
    const menuItem = [
        {
            path : "/",
            name : "Dashboard",
            icon :<FaTh/>
        },
        {
            path : "/members",
            name  : "Members",
            icon : <FaUsers />
        },
        {
            path : "/programs",
            name : "Programs",
            icon : <FaRegListAlt />
           
        },
        
        {
            path : "/settings",
            name : "Settings",
            icon : <PiEngine />
            
        }
    ]

   
 
    return (
        <div className='top-container'>
             { confirm && <Alert 
                    type='Confirm'
                    message ="Are sure you want to logout!!"
                    onCancel={()=>{setConfirm(false)}} 
                    onConfirm={handleLogout}
                    />
                }
                
                { errorAlert && <Alert 
                    type='Error'
                    message ={error}
                    onCancel={()=>{setErrorAlert(false)}}                     
                    />
                }      
            <div ref={sidebarRef} className="sidebar">
                <div className="top-section">
                <div className="logo"><FaMosque/></div>
                    <h1 className="title">KMCS</h1>
                   
                </div>
               
                <div className='nav'>
                {
                    menuItem.map((item, index)=>(
                        <NavLink  to={item.path} key={index} className='link' onClick={handleNavClick} >                            
                            <div className="icon">{item.icon}</div>
                            <div className="link-text">{item.name}</div>
                        </NavLink>
                    ))
                }
               
                </div>

                         
            </div>
            <main>
                <Header 
                    name="Kitenda" 
                    onLogout={()=>{setConfirm(true); console.log("Am pressed")}}
                    onMenuClick={handleMenuClick}
                />
                <Outlet /> 
            </main>
        </div>
    )
}

export default SideBar