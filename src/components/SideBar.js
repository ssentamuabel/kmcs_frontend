import React , { useRef, useState, useContext } from 'react'
import { RightsContext } from '../contexts/RightsProvider'
import { NavLink , Outlet} from 'react-router-dom'
import Alert from './Alert'
import kmcs from '../kmcs.png'
import Header from './Header'
import Footer from './Footer'
import { 
    FaTh,   
    FaUsers,
    FaUser,
    FaUserLock,
    FaRegListAlt,
    FaWallet,
    FaBoxes,
    FaLessThanEqual
} from 'react-icons/fa'
import { FaMessage } from "react-icons/fa6";
import { CONFIG } from '../config'

 



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
            
            const res =  await fetch(`${CONFIG.backend_url}/logout/`, {
                method: 'POST',
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
        // {
        //     path : "/",
        //     name : "Dashboard",
        //     icon :<FaTh/>
        // },
        {
            path : "/members",
            name  : "Members",
            icon : <FaUsers />
        },
        // Programs/Finance/Budgets/Inventory used to be shown to every
        // logged-in user regardless of role — including a plain
        // Student/Alumnus with no business being in these modules at
        // all. The backend now also scopes every record in these to the
        // caller's own side (Student vs Alumni), but that's a *data*
        // boundary, not a UI one — a role with the matching module bit
        // set to 0 should never see the link in the first place. Gating
        // it here means someone without access doesn't even discover
        // the module exists, rather than clicking in and finding an
        // empty (or worse, confusingly permission-denied) page.
        rights.perm.program > 0 && (
            {
                path : "/programs",
                name : "Programs",
                icon : <FaRegListAlt />
            }
        ),
        rights.perm.finance > 0 && (
            {
                path : "/finance",
                name : "finance",
                icon : <FaRegListAlt />
            }
        ),
        rights.perm.budget_cost > 0 && (
            {
                path : "/budgets",
                name : "Budgets",
                icon : <FaWallet />
            }
        ),
        // Inventory (Items) has no permission bit of its own in the
        // Permission model — it's part of the same budgeting workflow
        // (BudgetLine references Item), so it rides on budget_cost for
        // now rather than being wide open to everyone. Worth adding a
        // dedicated bit later if Inventory ever needs to be granted
        // independently of Budgets.
        rights.perm.budget_cost > 0 && (
            {
                path : "/inventory",
                name : "Inventory",
                icon : <FaBoxes />
            }
        ),
        // rights.perm.messages > 0 && (
        //     {
        //         path : "/messages",
        //         name : "Messages",
        //         icon : <FaMessage />
                
        //     }
        // ),
        {
            path : "/profile",
            name : "Profile",
            icon : <FaUser />
           
        },
        

        rights.perm.permission > 0 && (
            {
                path : "/permissions",
                name : "Permissions",
                icon : <FaUserLock />
                
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