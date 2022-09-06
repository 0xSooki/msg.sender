import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import hex_to_ascii from "../logic/helpers"
import getPubKey from "../logic/Ecnryption"
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import ChatIcon from '@mui/icons-material/Chat';
import { ethers } from "ethers";
import * as secp from '@noble/secp256k1';


//const crypto = require('webcrypto');

export default function SendMessage(props){

    const navigate = useNavigate();
    const [myMessages, setMyMessages] = useState([])
    const [bobsAddress, setBobsAddress] = useState("")
    const [bobsPubKey, setBobsPubKey] = useState("")
    const [recoveredBobsAddress, setRecoveredBobsAddress] = useState("")


    useEffect(( ) => {
        async function checkState(){
            //await new Promise(r => setTimeout(r, 500));
            if(props.provider === null){
                navigate('/connect');
            }
        }
        checkState();
    },[ props.provider]);

    const getBobsPubKey = async(event) => {
        const lastBlock = await props.provider.getBlock();
        const lastBlocknumber = lastBlock.number;
        const recoveredPubKey = await getPubKey(lastBlocknumber, bobsAddress);
        //const recoveredAddress = res[1]
        setBobsPubKey(recoveredPubKey);
        console.log(recoveredPubKey)
        console.log("type ",typeof recoveredPubKey)
        const x =  BigInt("0x" + recoveredPubKey.slice(4,68));
        const y = BigInt("0x" + recoveredPubKey.slice(68));
        console.log("x",x.toString(16),"y",y.toString(16));
        let compressed = "";
        if(y%2n === 0n){
            compressed = "0x02" + x.toString(16)
        }else{
            compressed = "0x03" + x.toString(16);
        }
        setBobsPubKey(compressed) 
        console.log("before computing", compressed) 
        const addr2 = await ethers.utils.computeAddress(compressed)
        console.log("addr2",addr2);

        //setRecoveredBobsAddress(recoveredAddress);
        //const compressed = recoveredPubKey
    }

    // const getSharedKey = () => {
    //     //this is for testing purposes. We create a randome priv key.
    //     const key1 = crypto.createECDH('secp256k1');
    //     key1.computeSecret(bobsPubKey, null,'base64');

    //     secp.getSharedSecret()
    // }

    const handleAddress = async(event) => {
        setBobsAddress(event.target.value);
    }
    
    return (

      <div style={{height:"100vh",textAlign:"center",display:"block"}}>
      <TextField
                sx={{ marginLeft: 'auto',
                    marginRight: 'auto',
                    width: 600}}
                id="address"
                type="text"
                label="Receiver Address"
                value={bobsAddress} onChange={handleAddress}
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
            }} onClick={getBobsPubKey}
            >
            Get Public Key
            </Button>
            {bobsPubKey?
            <h4>{bobsPubKey}</h4>:null}
            {recoveredBobsAddress?
            <h4>{recoveredBobsAddress}</h4>:null}
    </div>
        
    )
}




    