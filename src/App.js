import { useState,useContext } from 'react'
import './styles/App.css';
import {Link, useNavigate} from 'react-router-dom'
import { RightsProvider, RightsContext } from './contexts/RightsProvider';
import  Register from './pages/Register'
import  Dashboard from './pages/Dashboard'
import SideBar from './components/SideBar';
import Programs from './pages/Programs';
import Members from './pages/Members';
import Profile from ',/pages/Profile';
import Settings from './pages/Settings';
import  Login from './pages/Login'

import {Routes, Route, Navigate} from 'react-router-dom'
import {jwtDecode} from 'jwt-decode';


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
	const { setRights } = useContext(RightsContext);
  
	const handleLogin = ({ jwt }) => {
	  const decodedRights = jwtDecode(jwt);
	  setRights(decodedRights);
	  setLoggedIn(true);

	  if (decodedRights.perm.name === 'student' || decodedRights.perm.name === 'alumnus'){
			navigate('members')
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
			<Route path="settings" element={<Settings />} />
			<Route path="profile" element={<Profile />} />
			<Route path="*" element={<Navigate to="/" />} />
		  </Route>
		)}
	  </Routes>
	);
  }
  
  export default App;
