import { useState,useContext, useEffect } from 'react'
import './styles/App.css';
import {Link, useNavigate} from 'react-router-dom'
import { RightsProvider, RightsContext } from './contexts/RightsProvider';
import  Register from './pages/Register'
import  Dashboard from './pages/Dashboard'
import SideBar from './components/SideBar';
import Programs from './pages/Programs';
import Members from './pages/Members';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Permissions from './pages/Permissions';
import  Login from './pages/Login'

import {Routes, Route, Navigate} from 'react-router-dom'
import {jwtDecode} from 'jwt-decode';


const AUTO_LOGOUT_TIME = 10 * 60 * 1000; // 20 minutes in milliseconds


function App() {
	return (
	  <RightsProvider>
		<AppContent />
	  </RightsProvider>
	);
  }
  
  function AppContent() {
	const navigate = useNavigate()
	const [loggedIn, setLoggedIn] = useState(false);
	const { setRights, rights } = useContext(RightsContext);

	useEffect(() => {
        let logoutTimer;

        const resetLogoutTimer = () => {
            clearTimeout(logoutTimer);
            if (loggedIn) {
                logoutTimer = setTimeout(handleLogout, AUTO_LOGOUT_TIME);
            }
        };

        const handleUserActivity = () => {
            resetLogoutTimer();
        };

        // Add event listeners for user activity (e.g., mouse movements, key presses)
        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('keydown', handleUserActivity);

        resetLogoutTimer(); // Initialize the timer

        return () => {
            // Cleanup event listeners and the timer on component unmount
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('keydown', handleUserActivity);
            clearTimeout(logoutTimer);
        };
    }, [loggedIn]);

  
	const handleLogin = ({ jwt }) => {
	  const decodedRights = jwtDecode(jwt);
	  setRights(decodedRights);
	  setLoggedIn(true);

	  if (decodedRights.perm.name === 'student' || decodedRights.perm.name === 'alumnus'){
			navigate('profile')
	}
	};
  
	const handleLogout = () => {
	  setLoggedIn(false);
	  setRights({})
	};
  
	return (
	  <Routes>
		{!loggedIn ? (
		  <>
			<Route path="register" element={<Register />} />
			<Route path="login" element={<Login onLogin={handleLogin} />} />
			<Route path="*" element={<Navigate to="/login" />} />
		  </>
		) : (
		  <Route path="/" element={<SideBar onLogout={handleLogout} />}>
			<Route index element={<Dashboard />} />
			<Route path="members" element={<Members />} />
			<Route path="programs" element={<Programs />} />
			<Route path="messages" element={<Messages />} />
			<Route path="permissions" element={<Permissions />} />
			<Route path="profile" element={<Profile user={rights.member_id} />} />
			<Route path="*" element={<Navigate to="/members" />} />
		  </Route>
		)}
	  </Routes>
	);
  }
  
  export default App;
