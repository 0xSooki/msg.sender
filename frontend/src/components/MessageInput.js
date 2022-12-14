import React, { useEffect, useState, useRef } from 'react'
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import hex_to_ascii from "../logic/helpers";
import { useContract } from 'wagmi'
import {getPubKey} from "../logic/Ecnryption"
import InputAdornment from '@mui/material/InputAdornment';
import ChatIcon from '@mui/icons-material/Chat';
import { ethers } from "ethers";
import MessageOptions from './MessageOptions';
import SendIcon from '@mui/icons-material/Send';
import TransactionPopup from "./TransactionPopup"

const crypto = require('crypto-browserify');
const contractABI = require("../abi/SenderMessage.json");

export default function MessageInput(props){
    window.Buffer = window.Buffer || require("buffer").Buffer;

    const [pubkeyX,setPubKeyX] = useState(0n);
    const [pubkeyYodd,setPubkeyYodd] = useState(false);
    const [myMessage, setMyMessage] = useState([]);
    const bobsPubKey= useRef("");
    const [secret, setSecret] = useState("");
    const iv = useRef([]);
    const cipherText = useRef("");
    const [messageType, setMessageType] = useState("event");
    const [encryptedMessage, setEncryptedMessage] = useState(false);
    const [txModalOpen, setTxModalOpen] = React.useState(false);
    const handleTxModalOpen = () => setTxModalOpen(true);
    const [txWaiting, setWaiting] = useState(false);
    const [txSuccess, setSuccess] = useState(false);
    const [txError, setError] = useState(false);
    const [txHash, setTxHash] = useState(false);
    const handleTxModalClose = () => {
        setTxHash("")
        setError(false)
        setSuccess(false)
        setWaiting(false)
        setTxModalOpen(false);
    }
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
        if(props.privKey.length>0){
            setEncryptedMessage(true);
        }
        
    },[props.pubkeyX, props.pubkeyYodd, props.privKey]);

    const handleMessage = (event) => {
        setMyMessage(event.target.value);
    }
    
    const sendMessage = async () => {
        const option = messageType==="saved"?2:messageType==="nft"?3:1;
        if(encryptedMessage){
            if (!bobsPubKey.current){
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
            messageABI.current.sendCipherText(cipherText.current,x, odd, iv.current, props.bobsAddress, option)
            .then(async (_txHash) => {
                setTxHash(_txHash.hash)
                setWaiting(true)
                handleTxModalOpen();
                console.log(_txHash);
                _txHash.wait().then(receipt => {
                    setWaiting(false)
                    setSuccess(true)
                    setMyMessage("");
                    cipherText.current="";
                    console.log("tx mined: ", receipt);               
                } )
                .catch((error) => {
                    setWaiting(false)
                    setError(true)
                console.log(error);
                });
            });
        }else{
            messageABI.current.sendPlainText(ethers.utils.toUtf8Bytes(myMessage), option, props.bobsAddress)
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
    }

    const computeSecret = () => {
        if(bobsPubKey.current && props.privKey.length>0){
            const key = crypto.createECDH('secp256k1')
            key.setPrivateKey(props.privKey);
            const _secret = key.computeSecret(ethers.utils.arrayify(bobsPubKey.current), null)
            console.log(_secret);
            setSecret(_secret);
            return _secret;
        }else{
            console.log("there is no pubkey or privkey")
            console.log("props.privKey",props.privKey)
            console.log("bobsPubKey.current",bobsPubKey)
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
        if (props.pubkeyX){
            const x = BigInt(props.pubkeyX)
            if(!props.pubkeyYodd){
                compressed = "0x02" + x.toString(16);
            }else{
                compressed = "0x03" + x.toString(16);
            }
        }else{
            const lastBlock = await props.provider.getBlock();
            const lastBlocknumber = lastBlock.number;
            const recoveredPubKey = await getPubKey(lastBlocknumber, props.bobsAddress);
            const x =  BigInt("0x" + recoveredPubKey.slice(4,68));
            const y = BigInt("0x" + recoveredPubKey.slice(68));
            console.log("x",x.toString(16),"y",y.toString(16));
            if(y%2n === 0n){
                compressed = "0x02" + x.toString(16)
            }else{
                compressed = "0x03" + x.toString(16);
            }
         }
        
        bobsPubKey.current = compressed;
        return;
    }
    return(
        <div style={{display:"flex", backgroundColor:"#e5e9f2"}}>
            <TransactionPopup
                txModalOpen={txModalOpen} handleTxModalClose={handleTxModalClose}
                txWaiting={txWaiting} txHash={txHash} txSuccess={txSuccess} 
                txError={txError}
            />
            <MessageOptions setMessageType={setMessageType} setEncryptedMessage={setEncryptedMessage}
                                messageType={messageType} encryptedMessage={encryptedMessage}
                                privKey={props.privKey}/>
            <div style={{display:"flex", minWidth:"50%", maxWidth:"100%", marginLeft:"2vw"}}> 
            <TextField
            sx={{ marginLeft: 'auto',
                marginRight: 'auto',
                width: "100%"}}
            id="message"
            type="text"
            label="Your message"
            multiline={true}
            minRows={2}
            maxRows={4}
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
            
                 <Button variant="contained"  color="primary" sx ={{
                    margin:"1vw", fontSize:"0.7rem", width:"max-content",
                    height:"min-content"
                    }} onClick={sendMessage}
                    >
                       send {messageType==="saved"?" stored-in-contract ":null} 
                       {encryptedMessage?" encrypted ":" Not-encrypted "} 
                       message {messageType==="saved"?null:" as an "} 
                       {messageType==="saved"?null:messageType} 
                    <SendIcon fontSize="large" sx={{marginLeft:"0.3vw"}}/>
                </Button>
            </div>
        </div>
    )

}