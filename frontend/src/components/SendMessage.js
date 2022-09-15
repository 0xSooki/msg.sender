import React, { useEffect, useState, useRef } from 'react'
import {useNavigate} from 'react-router-dom'
import {getPubKey} from "../logic/Ecnryption"
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import ChatIcon from '@mui/icons-material/Chat';
import { ethers } from "ethers";
import PrivKeyInput from './PrivKeyInput';
import { useContract } from 'wagmi'


const crypto = require('crypto-browserify');
const contractABI = require("../abi/SenderMessage.json");

export default function SendMessage(props){
    window.Buffer = window.Buffer || require("buffer").Buffer;

    const navigate = useNavigate();
    const [myMessage, setMyMessage] = useState([])
    const [bobsAddress, setBobsAddress] = useState("")
    const [bobsPubKey, setBobsPubKey] = useState("")
    const [recoveredBobsAddress, setRecoveredBobsAddress] = useState("")
    const [secret, setSecret] = useState("");
    const iv = useRef([]);
    const cipherText = useRef("");
    const messageABI = useRef(useContract({
        addressOrName: '0x270b80292699c68D060F5ffECCC099B78465a3F3',
        contractInterface: contractABI.abi,
        signerOrProvider:props.signer}));


    useEffect(( ) => {
        async function checkState(){
            //await new Promise(r => setTimeout(r, 500));
            if(props.provider === null){
                navigate('/connect');
            }
        }
        checkState();
    },[ props.provider]);

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
        console.log(bobsAddress)
        //for now, we are only sending messages as events. (..., 1) 
        messageABI.current.sendCipherText(cipherText.current,x, odd, iv.current, bobsAddress, 1)
        .then(async (_txHash) => {
            console.log(_txHash);
            _txHash.wait().then(receipt => {
                setMyMessage("");
                setBobsAddress("");
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

        setRecoveredBobsAddress(addr2);
        return;
    }

    const handleAddress = async(event) => {
        setBobsAddress(event.target.value);
    }
    console.log(messageABI.current);
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
            {secret?
            <h4>{secret}</h4>:null}
            
        <TextField
            sx={{ marginLeft: 'auto',
                marginRight: 'auto',
                width: 600}}
            id="message"
            type="text"
            label="Your message"
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
            {props.privKey.length>0?
            null:
            <PrivKeyInput setPrivateKey={(_privKey) => props.setPrivateKey(_privKey)}/>
            }
            {iv.current?
            <h4>{iv.current.toString('hex')}</h4>:null}
            {cipherText.current?
            <h4>{cipherText.current.toString('hex')}</h4>:null}
    </div>
        
    )
}




    