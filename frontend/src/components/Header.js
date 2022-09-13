import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { NavLink } from 'react-router-dom';

export default function Header(props){
    
    return (

        <nav className="mainnav">
        <NavLink activeClassName="activeLink" to="/">
          Home
        </NavLink>
        <NavLink activeClassName="activeLink" to="/send-message">
          Send Message
        </NavLink>
      </nav>
        
    )
}




    