import React from "react";
import Button from "@mui/material/Button";

export default function StartNewConvo(props) {
  
  return (
    <div
      style={{
        display: "block",
        height: "max-content",
        width:"100%",
        borderRadius: "0.7rem",
      }}
    >
        <Button onClick={props.handleOpen}
            sx={{width:"99%", margin:"0.5%", backgroundColor:"#662da0", color:"white", fontWeight:"900", borderRadius:"0.5rem",
                borderWidth:"4px", borderColor:"#10104f", borderStyle:"solid"}}>
            + Start Convo With New Address
        </Button>
     
    </div>
  );
}
