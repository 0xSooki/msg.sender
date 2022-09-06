import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import hex_to_ascii from "../logic/helpers"
import getPubKey from "../logic/Ecnryption"
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import ChatIcon from '@mui/icons-material/Chat';

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
        //setRecoveredBobsAddress(recoveredAddress);
    }

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




    