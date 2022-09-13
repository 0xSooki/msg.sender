import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import hex_to_ascii from "../logic/helpers";
import PrivKeyInput from './PrivKeyInput';
import  {decrypt}  from "../logic/Ecnryption"
import Button from '@mui/material/Button';


const CONTRACT_CREATION_BLOCK = 27986896;
const crypto = require('crypto-browserify');

export default function Home(props) {
  const navigate = useNavigate();
  const [myMessages, setMyMessages] = useState([]);

  useEffect(() => {
    const abortController = new AbortController()
    async function checkState() {
      //await new Promise(r => setTimeout(r, 500));
      if (props.signer === null) {
        navigate("/connect");
      }
    }
    checkState();

    //sync();
    startListening();
    return function cleanup(){
      abortController.abort()
    }
  }, [props.messageABI.current, props.signer]);


  const decryptMsg = (cipherText, alicePubKeyX, alicePibKeyYodd, _iv) => {
    let alicePubKey ="";
    if (alicePibKeyYodd){
      alicePubKey = "0x03" + alicePubKeyX.toHexString().slice(2);
    }else{
      alicePubKey = "0x02" + alicePubKeyX.toHexString().slice(2);
    }
    console.log(alicePubKey);
    console.log(_iv)
    const key = crypto.createECDH('secp256k1')
    key.setPrivateKey(props.privKey);
    const _secret = key.computeSecret(ethers.utils.arrayify(alicePubKey), null)
    const message = decrypt(ethers.utils.arrayify(cipherText), _secret, ethers.utils.arrayify(_iv));
    console.log(message);
    return message;
  }

  const startListening = async () => {
    if (props.messageABI.current !== null) {
      if (props.messageABI.current.signer !== null) {
        // await new Promise((r) => setTimeout(r, 1000));
        props.messageABI.current.removeAllListeners();
      props.messageABI.current.on(
        "NewMessage",
        (from, to, msgId, cipherText, pubkeyX, pubkeyYodd, iv, eventSavedOrNft, amount) => {
          if (to.toLowerCase() === props.myAddress.toLowerCase()) {
            let info = {
              from: from,
              to: to,
              msgId: msgId,
              cipherText: cipherText,
              pubkeyX: pubkeyX,
              pubkeyYodd: pubkeyYodd,
              iv: iv,
              eventSavedOrNft: eventSavedOrNft,
              amount: amount,
            };
            console.log(info);
            if (!myMessages.includes({ args: info })) {
              setMyMessages((arr) => [...arr, { args: info }]);
              setMyMessages((arr) => [...new Set(arr)]);
              return;
            }
          }
        }
      );
      console.log("Finished creating listening");
      }
      
    }
    console.log("Finished listening block.");
  };

  const sync = async () => {
    let _myMessages = [];
    if (props.messageABI.current !== null) {
      while (props.messageABI.current.signer === null) {
        console.log("waiting");
        await new Promise((r) => setTimeout(r, 500));
      }
      props.messageABI.current.removeAllListeners();
      console.log("syncing");
      const lastBlock = await props.provider.getBlock();
      const lastBlocknumber = lastBlock.number;
      console.log("lastBlock", lastBlocknumber);
      let i = lastBlocknumber;
      while (i > CONTRACT_CREATION_BLOCK) {
        if (props.messageABI.current.signer !== null) {
          let end = i - 1000;
          if (i - 1000 < CONTRACT_CREATION_BLOCK) {
            end = CONTRACT_CREATION_BLOCK;
          }
          const allEvents = await props.messageABI.current.queryFilter(
            "NewMessage",
            end,
            i
          );
          console.log(allEvents);
          let sortedPosts = [...allEvents];
          sortedPosts.reverse();
          const filtered = sortedPosts.filter(
            (_event) =>
              _event.args[1].toLowerCase() === props.myAddress.toLowerCase()
          );
          console.log(filtered);
          _myMessages = [].concat(_myMessages, filtered);
          console.log(_myMessages);
          setMyMessages(_myMessages);
          i -= 1000;
        }
      }
      startListening();
      return;
    }
  };

  console.log(props.signer);
  return (
    <div display="block">
    <div className="flex justify-center">
      
      <h1 className="font-bold text-2xl">This is Home</h1>
      <ul>
        {myMessages
          ? myMessages.map((message) => {
              console.log(message);
              //If the message is encrypted...
              if(message.args.pubkeyX._hex.length>4 && message.args.iv._hex.length>4){
                //if we have the private key to decipher it.
                if(props.privKey.length>0){
                  return (
                    <p key={message.args.msgId}>
                      {decryptMsg(message.args.cipherText,message.args.pubkeyX,
                                               message.args.pubkeyYodd, message.args.iv._hex )}
                    </p>
                      )
                  }else{
                    //if not..
                    return(<p>Encrypted message. Decrypt with your private key.</p>)
                    
                }
              }else{
                //If the message is not encrypted
                return (
                  <p key={message.args.msgId}>
                    {hex_to_ascii(message.args.cipherText)}
                  </p>)
              }
            }
          )
          :<p>No Messages</p> 
          }
      </ul>
    </div>
    <div>
    <Button variant="contained" color="success" sx ={{
            marginLeft:"auto",
             marginRight:"auto",
             marginTop:"auto",
             marginBottom:"auto",
            }} onClick={sync}
            >
            Sync past messages
            </Button>

    <PrivKeyInput setPrivateKey={(_privKey) => props.setPrivateKey(_privKey)}/>

    </div>
    </div>
  );
}
