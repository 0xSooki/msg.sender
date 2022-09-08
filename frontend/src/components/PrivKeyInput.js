import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import ChatIcon from '@mui/icons-material/Chat';
import { ethers } from "ethers";


const crypto = require('crypto-browserify');

export default function PrivKeyInput(props){

    const [privKeyInput, setPrivKeyInput] = useState("")

    const handlePrivKey = async(event) => {
        setPrivKeyInput(event.target.value);
    }

    const setPrivKey = (event) => {
        let raw = privKeyInput;
        console.log("raw privkey input", privKeyInput);
        if (raw.slice(0,2) !== "0x"){
            raw = "0x" + raw;
        }
        console.log("raw privkey input after checking", privKeyInput);
        const _privateKey = ethers.utils.arrayify(raw);
        console.log("arrayified _privateKey", _privateKey);
        props.setPrivateKey(_privateKey);
    }
    
    return (

      <div style={{height:"100vh",textAlign:"center",display:"block"}}>
      <TextField
                sx={{ marginLeft: 'auto',
                    marginRight: 'auto',
                    width: 600}}
                id="privKey"
                type="text"
                label="Private Key"
                value={privKeyInput} onChange={handlePrivKey}
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                    <ChatIcon />
                    </InputAdornment>
                ),
                }}
                variant="standard"
            />
        <Button variant="contained" color="success" sx ={{
            marginLeft:"auto",
             marginRight:"auto",
             marginTop:"auto",
             marginBottom:"auto",
            }} onClick={setPrivKey}
            >
            SAVE PRIVATE KEY
            </Button>
    </div>
        
    )
}




    