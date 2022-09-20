import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import ButtonBase from '@mui/material/ButtonBase';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import hex_to_ascii from "../logic/helpers";
import  {decrypt}  from "../logic/Ecnryption"
import { ethers } from "ethers";

const crypto = require('crypto-browserify');

export default function Convo(props){

    const [messages,setMessages] = useState([]);
    const [reversed, setReversed] = useState(false);
   
    useEffect(()=>{
        setMessages([])
        setMessages(props.messages)
            
        
        console.log("ConvoComponent", props.messages)
    },[messages, props.selectedConvo]);

    const decryptMsg = (cipherText, _alicePubKeyX, alicePibKeyYodd, __iv) => {
        try{
             let alicePubKey ="";
            const alicePubKeyX = BigInt(_alicePubKeyX)
            const _iv = "0x"+BigInt(__iv).toString(16)
            console.log(alicePubKeyX.toString(16));
            if (alicePibKeyYodd){
            alicePubKey = "0x03" + alicePubKeyX.toString(16);
            }else{
            alicePubKey = "0x02" + alicePubKeyX.toString(16);
            }
            console.log(alicePubKey);
            console.log(_iv)
            const key = crypto.createECDH('secp256k1')
            key.setPrivateKey(props.privKey);
            const _secret = key.computeSecret(ethers.utils.arrayify(alicePubKey), null)
            const message = decrypt(ethers.utils.arrayify(cipherText), _secret, ethers.utils.arrayify(_iv));
            console.log(message);
            return message;
        }catch(e){
            console.log("issue decrypting own message", e)
            return hex_to_ascii(cipherText);
        }
       
      }

    return(
        <Box sx={{width:"100%",  height:"480px", padding:"15px", overflow:"scroll", 
            borderWidth:"5px", borderColor:"#aad", borderRadius:"9px",
            display:"flex", flexDirection:"column-reverse"  }}>
                <div>
            {messages?
            messages.length>0?
            messages.map((message) => {
                console.log("message", message)
                if(message.from === props.myAddress.toLowerCase()){
                    return(
                        <div style={{margingRight:"0", marginLeft:"auto", position: "relative", 
                                display:"block", marginTop:"5px", width:"max-content"}}>
                        <Card  key={message.msgId} 
                                sx={{ width: "100%",  maxWidth:"50vw",height:"min-content", 
                                     margin:"3px", borderRadius:"1vw", backgroundColor:"#3f6"}}>
                            
                            <CardContent>
                                <p style={{color:"#aaa", fontSize:"small", overflow:"hidden", 
                                            textOverflow:"ellipsis", display:"block", wordWrap:"break-word"}}>
                                { decryptMsg(message.text, props.pubkeyX, props.pubkeyYodd,message.iv)}
                                </p>
                            </CardContent>
                        </Card>
                        </div>
                )
                }else{
                    return(
                        <div style={{ margingRight:"30%", marginLeft:"0", position: "relative", 
                                    display:"block", marginTop:"10px", width:"max-content"}}>
                        <Card  key={message.msgId} 
                                sx={{ width: "100%", maxWidth:"50vw", height:"min-content",
                                     margin:"3px", borderRadius:"1vw", backgroundColor:"#ccc"}}>
                            
                            <CardContent>
                                <p style={{color:"#aaa", fontSize:"small", overflow:"hidden", 
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
            </div>
        </Box>
    )

}