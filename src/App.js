
import './styles/App.css';
import  Register from './pages/Register'
import  Dashboard from './pages/Dashboard'
import SideBar from './components/SideBar';
import Programs from './pages/Programs';
import Members from './pages/Members';
import Settings from './pages/Settings';
import  Login from './pages/Login'
import { useState } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'

function App() {
  const [loggedIn, setLoggedIn] = useState(true)

  const handleLogin = ()=>{
    setLoggedIn(true)
  }

  const handleLogout = ()=>{
    setLoggedIn(false)
  }
  return (

    <Routes> 
      {!loggedIn ? (
        <>
          <Route path='register' element={<Register/>}/>
          <Route path='login' element={<Login onLogin={handleLogin} />}/>
          <Route path='*' element={<Navigate to="/login" />} /> // for redirecting any unmatched url to the login page
        </>
      ):(
        <Route path='/' element={<SideBar onLogout={handleLogout} />}>
          <Route index element={<Dashboard />} />
          <Route path='/members' element={<Members />} />
          <Route path='/programs' element={<Programs />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='*' element={<Navigate to="/" />} /> // for redirecting any unmatched url to the login page
          
      </Route>
      )}   
      
    </Routes>
  );
}

export default App;
