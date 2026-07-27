import React, { useContext } from 'react';
import { RightsContext } from '../contexts/RightsProvider';
import { AiOutlineLogout } from "react-icons/ai";
import { LuPenSquare } from "react-icons/lu";
import { CgMenuGridR } from "react-icons/cg";
import '../styles/components.css';

const Header = ({ onLogout, onMenuClick, title }) => {
  const { rights } = useContext(RightsContext);

  return (
    <header className="header-bar">
      <div className="header-left">
        <div className="menu-icon" onClick={onMenuClick}>
          <CgMenuGridR />
        </div>
        <h1 className="header-title">{title || "Kyambogo University Muslim Centralised System"}</h1>
      </div>

      <div className="header-right">
        <div className="user-info">
          <LuPenSquare className="pen-icon" />
          <span>{rights.name}</span>
        </div>
        <div className="logout" onClick={onLogout}>
          <AiOutlineLogout className="logout-icon" />
          <span>Logout</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
