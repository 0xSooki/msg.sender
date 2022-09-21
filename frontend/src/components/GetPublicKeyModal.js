import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { constants, ethers } from "ethers";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {getPubKey} from "../logic/Ecnryption"
import { useProvider } from 'wagmi'

export default function GetPublicKeyModal(props) {

    const [bobsAddress, setBobsAddress] = useState("");
    const [waiting, setWaiting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const provider = useProvider()

    
    const handleAddress = async(event) => {
        setBobsAddress(event.target.value);
    }

    const getBobsPubKey = async(event) => {
        try{
            setWaiting(true)
            const lastBlock = await provider.getBlock();
            const lastBlocknumber = lastBlock.number;
            const recoveredPubKey = await getPubKey(lastBlocknumber, bobsAddress);
            console.log(recoveredPubKey)
            console.log("type ",typeof recoveredPubKey)
            const x =  BigInt("0x" + recoveredPubKey.slice(4,68));
            const y = BigInt("0x" + recoveredPubKey.slice(68));
            console.log("x",x.toString(16),"y",y.toString(16));
            let yOdd=false;
            let compressed = "";
            if(y%2n === 0n){
                compressed = "0x02" + x.toString(16)
            }else{
                yOdd=true;
                compressed = "0x03" + x.toString(16);
            }        
            const addr2 = await ethers.utils.computeAddress(compressed)
            if( addr2.toLowerCase() === bobsAddress.toLowerCase()){
                props.setPubKeyX(x);
                props.setPubKeyYodd(yOdd);
                props.setSelectedConvo(bobsAddress);
                console.log("before computing", compressed) 
                setSuccess(true);
                setWaiting(false);
            }else{
                setWaiting(false);
                setError(true);
            }
        }catch{
            setWaiting(false);
            setError(true);
        }
        
    }
    
    return (<Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',width: 620,
            bgcolor: 'background.paper', border: '2px solid #000',  boxShadow: 24, p: 4, display:"block"}}>
            <label>Insert the new address you wish to message:</label>
            <TextField
                sx={{ marginLeft: 'auto',
                    marginRight: 'auto',
                    width: "26rem"}}
                id="address"
                type="text"
                label="Receiver Address"
                value={bobsAddress} onChange={handleAddress}
                variant="standard"
            />
            <div>
        <Button variant="contained" color="success" sx ={{
            marginLeft:"auto",
             marginRight:"auto",
             marginTop:"auto",
             marginBottom:"auto",
            }} onClick={getBobsPubKey}
            >
            Retrieve Public Key
            </Button>
            </div>
            {waiting?"Loading. Please wait...":null}
            {success?"Public key retrieved successfully":null}
            {error?"ERROR: Something went wrong. Make sure the address you are trying to message has made at least 1 transaction before.":null}
            
                </Box>
            </Modal>)
}