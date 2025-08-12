import React, { useRef, useState, useContext } from 'react'
import { RightsContext } from '../contexts/RightsProvider'
import { NavLink, Outlet } from 'react-router-dom'
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
    FaLessThanEqual
} from 'react-icons/fa'
import { FaMessage } from "react-icons/fa6";
import { CONFIG } from '../config'





const SideBar = ({ onLogout }) => {

    const [menuState, setMenuState] = useState(false)
    const sidebarRef = useRef(null);
    const [confirm, setConfirm] = useState(false)
    const [errorAlert, setErrorAlert] = useState(false)
    const [error, setError] = useState('')
    const [openIndex, setOpenIndex] = useState(null);


    const { rights } = useContext(RightsContext)


    const handleMenuClick = () => {
        if (sidebarRef.current) {
            setMenuState(true)
            sidebarRef.current.style.display = 'block';

        }
    }


    const handleLogout = async () => {

        try {

            const res = await fetch(`${CONFIG.backend_url}/logout/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (res.ok) {
                onLogout()
            } else {
                console.log("Something went wrong")
            }


        } catch (error) {
            setError(error.message)
            setConfirm(false)
            setErrorAlert(true)
        }
    }



    const handleNavClick = () => {

        if (menuState && sidebarRef.current) {
            sidebarRef.current.style.display = 'none';
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
            path: "/members",
            name: "Members",
            icon: <FaUsers />
        },
        {
            path: "/finance",
            name: "Finance",
            icon: <FaRegListAlt />,
            children: [
                { path: "/finance", name: "Dashboard" },
                { path: "/finance/trans", name: "Transaction" },
                {path: "/finance/accounts", name:"Accounts"}
                
            ]

        },
        {
            path: "/programs",
            name: "Programs",
            icon: <FaRegListAlt />

        },

        // rights.perm.messages > 0 && (
        //     {
        //         path : "/messages",
        //         name : "Messages",
        //         icon : <FaMessage />

        //     }
        // ),
        {
            path: "/profile",
            name: "Profile",
            icon: <FaUser />

        },


        rights.perm.permission > 0 && (
            {
                path: "/permissions",
                name: "Permissions",
                icon: <FaUserLock />

            }
        )

    ].filter(Boolean)


    const SubNavClick = () => {
        console.log("We are handling the nav click");
    }

    const toggleSubMenu = (index) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };



    return (
        <div className='top-container'>
            {confirm && (<Alert
                type='Confirm'
                message="Are sure you want to logout!!"
                onCancel={() => { setConfirm(false) }}
                onConfirm={handleLogout}
            />)
            }

            {
                errorAlert && (<Alert
                    type='Error'
                    message={error}
                    onCancel={() => { setErrorAlert(false) }}
                />)
            }
            <div ref={sidebarRef} className="sidebar">

                <div className="top-section">
                    <div className="logo">
                        <img src={kmcs} alt="KMCS" />
                    </div>

                </div>
                <div className='nav'>
                    {menuItem.map((item, index) => (
                        <div className="menu-item" key={index}>
                            {item.children ? (
                                <div className="link" onClick={() => toggleSubMenu(index)}>
                                    <div className="icon">{item.icon}</div>
                                    <div className="link-text">{item.name}</div>
                                </div>
                            ) : (
                                <NavLink to={item.path} className="link" onClick={handleNavClick}>
                                    <div className="icon">{item.icon}</div>
                                    <div className="link-text">{item.name}</div>
                                </NavLink>
                            )}

                            {item.children && openIndex === index && (
                                <div className="submenu">
                                    {item.children.map((child, idx) => (
                                        <NavLink
                                            to={child.path}
                                            key={idx}
                                            className="sub-link"
                                            onClick={SubNavClick}
                                        >
                                            <div className="sub-link-text">{child.name}</div>
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                </div>
            </div>
            <main>
                <Header

                    onLogout={() => { setConfirm(true);  }}
                    onMenuClick={handleMenuClick}
                />
                <Outlet />
                <Footer />
            </main>
        </div>
    )
}

export default SideBar