
import './App.css';
import  Register from './pages/Register'
import  Dashboard from './pages/Dashboard'
import SideBar from './components/SideBar';
import Programs from './pages/Programs';
import Members from './pages/Members';
import Settings from './pages/Settings';
import  Login from './pages/Login'
import { useState } from 'react'
import {Routes, Route} from 'react-router-dom'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)

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
          <Route path='/' element={<Login onLogin={handleLogin} />}/>
        </>
      ):(
        <Route path='dashboard' element={<Dashboard/>}/>
      )}   
      
    </Routes>
  );
}

export default App;
