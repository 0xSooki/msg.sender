import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import hex_to_ascii from "../logic/helpers";
import PrivKeyInput from './PrivKeyInput';
import  {decrypt, getPubKey}  from "../logic/Ecnryption"


const CONTRACT_CREATION_BLOCK = 27986896;

export default function Home(props) {
  const navigate = useNavigate();
  const [myMessages, setMyMessages] = useState([]);
  const [iv, setIV] = useState([]);
  const [cipherText, setCipherText] = useState("");
  const [aliceAddress, setAliceAddress] = useState("")

  useEffect(() => {
    async function checkState() {
      //await new Promise(r => setTimeout(r, 500));
      if (props.signer === null) {
        navigate("/connect");
      }
    }
    checkState();

    sync();
    startListening();
  }, [props.messageABI.current, props.signer]);

  const handleCipherText = (event) =>{
    setCipherText(event.target.value);
  }

  const handleIV = (event) =>{
    setIV(event.target.value);
  }
  
  const handleAliceAddress = (event) => {
    setAliceAddress(event.target.value)
  }

  const decryptMsg = (alicePibKeyX, alicePibKeyYodd, _iv) => {
    let alicePubKey ="";
    if (alicePibKeyYodd){
      alicePubKey = "0x03" + alicePibKeyX;
    }else{
      alicePubKey = "0x02" + alicePibKeyX;
    }
    const key = crypto.createECDH('secp256k1')
    key.setPrivateKey(props.privKey);
    const _secret = key.computeSecret(ethers.utils.arrayify(alicePubKey), null)
    const message = decrypt(cipherText, _secret, iv);
    console.log(message);
    return message;
  }

  const startListening = async () => {
    if (props.messageABI.current !== null) {
      while (props.messageABI.current.signer === null) {
        console.log("waiting");
        await new Promise((r) => setTimeout(r, 500));
      }
      props.messageABI.current.removeAllListeners();
      props.messageABI.current.on(
        "NewMessage",
        (from, to, msgId, text, pubkey, amount) => {
          if (to.toLowerCase() === props.myAddress.toLowerCase()) {
            let info = {
              from: from,
              to: to,
              msgId: msgId,
              text: text,
              pubkey: pubkey,
              amount: amount,
            };
            console.log(info);

            // let _myMessages = [...myMessages];
            // console.log("beofre pushing for real", _myMessages);
            // _myMessages = [].concat(_myMessages, [{args:info}]);
            // console.log("beofre pushing", _myMessages);
            // _myMessages.push({args:info});
            if (!myMessages.includes({ args: info })) {
              setMyMessages((arr) => [...arr, { args: info }]);
              setMyMessages((arr) => [...new Set(arr)]);
              return;
            }
          }
        }
      );
    }
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
              return (
                <p key={message.args.msgId}>
                  {hex_to_ascii(message.args.text)}
                </p>
              );
            })
          : null}
      </ul>
    </div>
    <div>


    <PrivKeyInput setPrivateKey={(_privKey) => props.setPrivateKey(_privKey)}/>

    </div>
    </div>
  );
}
