import React, { useEffect, useState, useRef } from 'react'
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import hex_to_ascii from "../logic/helpers";
import { useContract } from 'wagmi'
import InputAdornment from '@mui/material/InputAdornment';
import ChatIcon from '@mui/icons-material/Chat';
import { ethers } from "ethers";

const crypto = require('crypto-browserify');
const contractABI = require("../abi/SenderMessage.json");

export default function MessageInput(props){
    window.Buffer = window.Buffer || require("buffer").Buffer;

    const [pubkeyX,setPubKeyX] = useState(0n);
    const [pubkeyYodd,setPubkeyYodd] = useState(false);
    const [myMessage, setMyMessage] = useState([]);
    const [bobsPubKey, setBobsPubKey] = useState("");
    const [secret, setSecret] = useState("");
    const iv = useRef([]);
    const cipherText = useRef("");
    const messageABI = useRef(useContract({
        addressOrName: '0x270b80292699c68D060F5ffECCC099B78465a3F3',
        contractInterface: contractABI.abi,
        signerOrProvider:props.signer}));

    useEffect(()=>{
        setPubKeyX(props.pubkeyX)
        setPubkeyYodd(props.pubkeyYodd)
        if(props.pubkeyX){
            getBobsPubKey();
        }
        
    },[props.pubkeyX, props.pubkeyYodd]);

    const handleMessage = (event) => {
        setMyMessage(event.target.value);
    }
    
    const sendMessage = async () => {
        if (!bobsPubKey){
            await getBobsPubKey();
        }
        //computeSecret();
        const _secret = computeSecret();
        await encryptMessage(_secret);
        const key = crypto.createECDH('secp256k1')
        key.setPrivateKey(props.privKey);
        const myPubKey =key.getPublicKey('hex', 'compressed');
        console.log("myPubKey", myPubKey);
        let odd = false;
        if (myPubKey.slice(0,2) === "03"){
            odd = true;
        }
        const x = BigInt("0x"+myPubKey.slice(2));
        console.log(x)
        console.log(cipherText.current)
        console.log(odd)
        console.log(iv.current)
        //for now, we are only sending messages as events. (..., 1) 
        messageABI.current.sendCipherText(cipherText.current,x, odd, iv.current, props.bobsAddress, 1)
        .then(async (_txHash) => {
            console.log(_txHash);
            _txHash.wait().then(receipt => {
                setMyMessage("");
                cipherText.current="";
                console.log("tx mined: ", receipt);               
            } )
            .catch((error) => {
            console.log(error);
            });
        });
    }

    const computeSecret = () => {
        if(bobsPubKey && props.privKey.length>0){
            const key = crypto.createECDH('secp256k1')
            key.setPrivateKey(props.privKey);
            const _secret = key.computeSecret(ethers.utils.arrayify(bobsPubKey), null)
            console.log(_secret);
            setSecret(_secret);
            return _secret;
        }else{
            console.log("there is no pubkey or privkey")
            console.log("props.privKey",props.privKey)
            console.log("bobsPubKey",bobsPubKey)
            return false;
        }
    }

    const encryptMessage = async (_secret) => {
        return new Promise((resolve, reject) => { 
            iv.current  = crypto.randomBytes(16);
            console.log(iv.current);
            console.log("before ecnrypting. Secret: ", _secret);
            console.log(typeof _secret);
            const cipher = crypto.createCipheriv(
                'aes-256-cbc', _secret, iv.current);
            console.log("cipher", cipher);
            console.log("myMessage",myMessage);
            const encrypted = cipher.update(myMessage);
            console.log("encrypted", encrypted);
            const _cipherText = Buffer.concat([encrypted, cipher.final()]);
            console.log("_cipherText", _cipherText)
            cipherText.current =_cipherText;
            console.log("end");
            resolve(true); 
            
            
            
        });
        
    }

    const getBobsPubKey = async(event) => {
        let compressed = "";
        const x = BigInt(props.pubkeyX)
        if(!props.pubkeyYodd){
            compressed = "0x02" + x.toString(16);
        }else{
            compressed = "0x03" + x.toString(16);
        }
        setBobsPubKey(compressed) 
        return;
    }
    return(
        <div>
            <TextField
            sx={{ marginLeft: 'auto',
                marginRight: 'auto',
                width: "80%"}}
            id="message"
            type="text"
            label="Your message"
            multiline={true}
            maxRows={3}
            value={myMessage} onChange={handleMessage}
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
            }} onClick={sendMessage}
            >
            SEND MESSAGE
            </Button>
        </div>
    )

}