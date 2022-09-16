import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import ButtonBase from '@mui/material/ButtonBase';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import hex_to_ascii from "../logic/helpers";

export default function Convo(props){

    const [messages,setMessages] = useState([]);

    useEffect(()=>{
        setMessages([])
        setMessages([])
        setMessages(props.messages)
        console.log("ConvoComponent", props.messages)
    },[messages, props.selectedConvo]);

    return(
        <Box sx={{width:"100%",  height:"480px", padding:"15px", overflow:"scroll", 
            borderWidth:"5px", borderColor:"#aad", borderRadius:"9px" }}>
            {messages?
            messages.length>0?
            messages.map((message) => {
                console.log("message", message)
                if(message.from === props.myAddress.toLowerCase()){
                    return(
                        <div style={{margingRight:"30%", marginLeft:"0", position: "relative", display:"block", marginTop:"5px"}}>
                        <Card  key={message.msgId} 
                                sx={{ width: "70%", height:"min-content", 
                                     margin:"3px", borderRadius:"1vw", backgroundColor:"#3f6"}}>
                            
                            <CardContent>
                                <p style={{color:"#aaa", fontSize:"small", overflow:"hidden", maxLines:"2",
                                            textOverflow:"ellipsis", display:"block", wordWrap:"break-word"}}>
                                {message.text}
                                </p>
                            </CardContent>
                        </Card>
                        </div>
                )
                }else{
                    return(
                        <div style={{ margingRight:"0", marginLeft:"30%", position: "relative", display:"block", marginTop:"10px"}}>
                        <Card  key={message.msgId} 
                                sx={{ width: "80%", height:"min-content",
                                     margin:"3px", borderRadius:"1vw", backgroundColor:"#ccc"}}>
                            
                            <CardContent>
                                <p style={{color:"#aaa", fontSize:"small", overflow:"hidden", maxLines:"2",
                                            textOverflow:"ellipsis", display:"block", wordWrap:"break-word"}}>
                                {message.text}
                                </p>
                            </CardContent>
                        </Card>
                        </div>
                        )
                }
                
            }):
            <p>No messages</p>:<p>No messages</p>}

        </Box>
    )

}