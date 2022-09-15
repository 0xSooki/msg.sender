import React, { useEffect, useState } from 'react'
import HomeIcon from '@mui/icons-material/Home';
import SendIcon from '@mui/icons-material/Send';
import {useNavigate} from 'react-router-dom'
import { NavLink } from 'react-router-dom';
import { ConnectButton } from "@rainbow-me/rainbowkit"; 

export default function Header(props){

  const barItem = {fontSize:"large", 
                  fontWeight:"bold", 
                  paddingInline:"20px",
                  display:"inline-block"}
    
    return (
        <div style={{ 
                    backgroundColor:"#78f", 
                    height:"45px",
                    width:"100vw"}}>
          <nav style={{height:"40px",
                      font:"caption", 
                      color:"white",
                      padding:"10px",
                      alignContent:"center",
                      display:"inline-block"}}>
          <NavLink style={barItem} to="/">
            
            Home
            <HomeIcon fontSize={"small"}/>
          </NavLink>
          <NavLink style={barItem} to="/send-message">
            
            Send Message
            <SendIcon fontSize={"small"}/>
          </NavLink>
        </nav>
        <div style={{display:"inline-block", marginLeft:"52%", width:"max-content", padding:"2px"}}>
        <ConnectButton/>
        </div>
      </div>
        
    )
}




    