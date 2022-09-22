import React, { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import SendIcon from "@mui/icons-material/Send";
import { NavLink } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { display } from "@mui/system";
import KeyIcon from '@mui/icons-material/Key';
import KeyOffIcon from '@mui/icons-material/KeyOff';

export default function Header(props) {
  const barItem = {
    fontSize: "large",
    fontWeight: "bold",
    paddingInline: "20px",
    display: "inline-block",
  };

  return (
    <div
      style={{
        backgroundColor: "#10104f",
        height: "45px",
        alignItems: "center",
        display: "flex",
      }}
    >
      <nav
        style={{
          height: "40px",
          font: "caption",
          color: "white",
          padding: "10px",
          alignContent: "center",
          display: "block",
        }}
      >
        <ul
          style={{
            display: "flex",
          }}
        >
          <li
            style={{
              display: "inline-block",
            }}
          >
            <NavLink style={barItem} to="/">
              Home
              <HomeIcon
                style={{
                  paddingLeft: "2px",
                }}
                fontSize={"small"}
              />
            </NavLink>
          </li>
          <li>
            <NavLink style={barItem} to="/send-message">
              Send Message
              <SendIcon
                style={{
                  paddingLeft: "2px",
                }}
                fontSize={"small"}
              />
            </NavLink>
          </li>
        </ul>
      </nav>
      <div
        style={{
          flexGrow: "1",
        }}
      />
      <div style={{marginLeft:"1rem", marginRight:"1rem"}}>{props.privKey.length>0?
          <KeyIcon color="success" fontSize="large" sx={{backgroundColor:"#afd", padding:"0.1rem", borderRadius:"2rem"}}/>:
          <KeyOffIcon color="disabled" fontSize="large" sx={{backgroundColor:"#999", padding:"0.1rem", borderRadius:"2rem"}}/>}</div>
      <div
        style={{
          display: "inline-block",
          paddingRight: "2px",
        }}
      >
        <ConnectButton />
      </div>
    </div>
  );
}
