import React , { useRef, useState, useContext } from 'react'
import { RightsContext } from '../contexts/RightsProvider'
import { NavLink , Outlet} from 'react-router-dom'
import Alert from './Alert'
import kmcs from '../kmcs.png'
import Header from './Header'
import Footer from './Footer'
import { 
    FaTh,
    FaMoneyBillWave,
    FaMailBulk,
    FaUsers,
    FaUser,
    FaMosque,
    FaRegListAlt,
    FaLessThanEqual
} from 'react-icons/fa'
import { PiEngine } from 'react-icons/pi'
 



const SideBar = ({onLogout})=>{

    const [menuState, setMenuState] = useState(false)
    const sidebarRef = useRef(null);
    const [confirm, setConfirm] = useState(false)
    const [errorAlert, setErrorAlert] = useState(false)
    const [error, setError] = useState('')


    const {rights}  = useContext(RightsContext)


    const handleMenuClick = ()=>{
        if (sidebarRef.current){
            setMenuState(true)            
            sidebarRef.current.style.display='block';
            
        }
    }
    

    const handleLogout  = async() =>{
        
        try {
            
            const res =  await fetch('https://127.0.0.1:8000/logout/', {
                method : "POST",
                credentials: 'include',
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
            path : "/profile",
            name : "Profile",
            icon : <FaUser />
           
        },
        

        rights.perm.permission > 0 && (
            {
                path : "/permissions",
                name : "Permissions",
                icon : <PiEngine />
                
            }
        )
        
        
    ].filter(Boolean)

   
 
    return (
        <div className='top-container'>
             { confirm && (<Alert 
                    type='Confirm'
                    message ="Are sure you want to logout!!"
                    onCancel={()=>{setConfirm(false)}} 
                    onConfirm={handleLogout}
                    />)           
                }
                
                { 
                    errorAlert && (<Alert 
                        type='Error'
                        message ={error}
                        onCancel={()=>{setErrorAlert(false)}}                     
                        />)
                }      
            <div ref={sidebarRef} className="sidebar">
              
                <div className="top-section">
                    <div className="logo">
                        <img src={kmcs} alt="KMCS" />
                    </div>
                                    
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
                    
                    onLogout={()=>{setConfirm(true); console.log("Am pressed")}}
                    onMenuClick={handleMenuClick}
                />
                <Outlet /> 
                <Footer />
            </main>
        </div>
    )
}

export default SideBar