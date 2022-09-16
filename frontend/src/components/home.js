import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import hex_to_ascii from "../logic/helpers";
import PrivKeyInput from './PrivKeyInput';
import ConvoList from "./ConvoList"
import Convo from "./Convo";
import  {decrypt}  from "../logic/Ecnryption"
import Button from '@mui/material/Button';
import {useLazyQuery, useQuery} from "@apollo/client";
import { SYNC_MY_MESSAGES, LISTEN_TO_NEW_MESSAGES } from "../GraphQl/Queries";

const CONTRACT_CREATION_BLOCK = 27986896;
const crypto = require('crypto-browserify');


export default function Home(props) {
  const navigate = useNavigate();
  const [myMessages, setMyMessages] = useState([]);
  const [convos, setConvos] = useState({});
  const [syncMyMessages, {loading, error, data }] = useLazyQuery(SYNC_MY_MESSAGES);
  const [selectedConvo, setSelectedConvo] = useState(null);
  //const [liveMessages, {liveLoading, liveError, liveData }] = useQuery(LISTEN_TO_NEW_MESSAGES);

  useEffect(() => {
    console.log("From GraphQL:",data, loading, error)
    const abortController = new AbortController()
    async function checkState() {
      //await new Promise(r => setTimeout(r, 500));
      if (props.signer === null) {
        navigate("/connect");
      }
    }
    checkState();
    if (!loading && data){
      syncWithTheGraph();
    }
    startListening();
    
    return function cleanup(){
      abortController.abort()
    }
  }, [props.messageABI.current, props.signer, loading]);


  const decryptMsg = (cipherText, _alicePubKeyX, alicePibKeyYodd, __iv) => {
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
  }

  const listenWithTheGraph = async () => {

  }

  //@deprecated
  const startListening = async () => {
    if (props.messageABI.current !== null) {
      if (props.messageABI.current.signer !== null) {
        // await new Promise((r) => setTimeout(r, 1000));
        props.messageABI.current.removeAllListeners();
      props.messageABI.current.on(
        "NewMessage",
        (from, to, msgId, cipherText, pubkeyX, pubkeyYodd, iv, eventSavedOrNft, amount) => {
          if (to.toLowerCase() === props.myAddress.toLowerCase() || from.toLowerCase() === props.myAddress.toLowerCase()) {
            let info = {
              from: from,
              to: to,
              msgId: msgId,
              text: cipherText,
              pubkeyX: pubkeyX,
              pubkeyYodd: pubkeyYodd,
              iv: iv,
              eventSavedOrNft: eventSavedOrNft,
              amount: amount,
            };
            console.log(info);
            if (!myMessages.includes(info)) {
              setMyMessages((arr) => [...arr,  info ]);
              setMyMessages((arr) => [...new Set(arr)]);
              let bob = "";
              if( info.to.toLowerCase() === props.myAddress.toLowerCase()){
                bob = info.from.toLowerCase();
              }else{
                bob = info.to.toLowerCase();
              }
              let currentConvos = {...convos}
              if(currentConvos[bob]){
                currentConvos[bob].push(info)
              }else{
                currentConvos[bob] = [info]
              }
              setConvos(currentConvos);
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

  const syncWithTheGraph = async() => {
    let _myMessages = [];
    console.log("abi",props.messageABI.current)
    if (props.messageABI.current !== null) {
      while (!data) {
        await new Promise((r) => setTimeout(r, 500));
        console.log("waiting on data")
      }
      // while (props.messageABI.current.signer === null) {
      //   await new Promise((r) => setTimeout(r, 500));
      //   console.log("waiting on signer")
      // }
      console.log("syncing");
    }
    console.log("data from graphql:", data);
    const allMyMessages = [].concat(data.Sent, data.Received)
    _myMessages = [].concat(_myMessages, allMyMessages);
    const myMessagesSet = new Set(_myMessages);
    const sortedMessages = [...myMessagesSet];
    sortedMessages.sort((a, b) => (BigInt(a.id) > BigInt(b.id)) ? 1 : -1)
    let finalMessages = sortedMessages
    console.log(sortedMessages);
    if (props.privKey.length>0){
      finalMessages = sortedMessages.map((message => {
        console.log("message",message)
        const cipherText = message.text
        console.log("cipherText",cipherText)
        let plainText="";
        try{
          plainText = decryptMsg(cipherText,message.pubkeyX,
          message.pubkeyYodd, message.iv )
          console.log("plainText",plainText)
        }catch{
          plainText=cipherText;
        }
        
          let info = {
            from: message.from,
            to: message.to,
            msgId: message.msgId,
            text: plainText,
            pubkeyX: message.pubkeyX,
            pubkeyYodd: message.pubkeyYodd,
            iv: message.iv,
            eventSavedOrNft: message.eventSavedOrNft,
            amount: message.BigIntamount,
          };
        console.log("message",info)
        return info
      }))
      
    }
    setMyMessages(finalMessages);
    let currentConvos = {...convos};
    finalMessages.map(message => {
      let bob = "";
      if( message.to.toLowerCase() === props.myAddress.toLowerCase()){
        bob = message.from.toLowerCase();
      }else{
        bob = message.to.toLowerCase();
      }
      console.log("convos bob", bob)
      console.log("convos currentConvos", currentConvos)
      if(currentConvos[bob]){
        currentConvos[bob].push(message)
      }else{
        currentConvos[bob] = [message]
      }
      console.log("convos currentConvos[bob]", currentConvos[bob])
      
    })
    return setConvos(currentConvos);
  }

  //@deprecated
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
  console.log("convos",convos);
  console.log("selectedConvo",selectedConvo);
  
  return (
    
    <div display="block">
    <div className="flex justify-center">
      
    <ConvoList convos={convos} setSelectedConvo={setSelectedConvo}/>
    <Convo messages={convos[selectedConvo]} myAddress={props.myAddress} selectedConvo={selectedConvo}/>
      
    </div>
    <div>
    <Button variant="contained" color="success" sx ={{
            marginLeft:"auto",
             marginRight:"auto",
             marginTop:"auto",
             marginBottom:"auto",
            }} 
            //onClick={sync}
            onClick={() => {syncMyMessages( {variables: {user: props.myAddress.toLowerCase()}} )}}
            >
            Sync past messages
            </Button>

    <PrivKeyInput setPrivateKey={(_privKey) => props.setPrivateKey(_privKey) }/>
   

    </div>
    </div>
  );
}
