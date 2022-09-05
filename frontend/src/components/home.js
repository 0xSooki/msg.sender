import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { ethers } from "ethers";
import hex_to_ascii from "../logic/helpers"

const CONTRACT_CREATION_BLOCK = 27933806;

export default function Home(props){

    const navigate = useNavigate();
    const [myMessages, setMyMessages] = useState([])


   

    useEffect(( ) => {
        async function checkState(){
            //await new Promise(r => setTimeout(r, 500));
            if(props.signer === null){
                navigate('/connect');
            }
        }
        checkState();
        
        sync();
        startListening();
    },[ props.messageABI.current, props.signer]);

    const startListening = async () => {
        if(props.messageABI.current !== null){
            while (props.messageABI.current.signer === null){
                console.log("waiting")
                await new Promise(r => setTimeout(r, 500));
            }
            props.messageABI.current.on("NewMessage", (from, to, msgId, text, pubkey, amount) =>{
                if (to.toLowerCase() === props.myAddress.toLowerCase()){
                
                let info = {
                    from: from,
                    to: to,
                    msgId: msgId,
                    text: text,
                    pubkey: pubkey,
                    amount: amount
                }
                console.log(info);
                const _myMessages = [...myMessages];
                console.log("beofre pushing", _myMessages);
                _myMessages.push({args:info});
                setMyMessages(_myMessages);
            }

            })
        }
    }
    
    const sync = async () => {
        let myMessages = []
        if(props.messageABI.current !== null){
            while (props.messageABI.current.signer === null){
                console.log("waiting")
                await new Promise(r => setTimeout(r, 500));
            }
            const lastBlock = await props.provider.getBlock();
            const lastBlocknumber = lastBlock.number;
            console.log("lastBlock", lastBlocknumber);
            let i = CONTRACT_CREATION_BLOCK;
            while(i < lastBlocknumber){
                if(props.messageABI.current.signer !== null){
                    let end = i +1000;
                    if (i + 1000 > lastBlocknumber){
                        end = lastBlocknumber;
                    }
                    const allEvents = await props.messageABI.current.queryFilter("NewMessage",i, end);
                    console.log(allEvents);
                    const filtered = allEvents.filter(_event => _event.args[1].toLowerCase() === props.myAddress.toLowerCase())
                    console.log(filtered);
                    myMessages = [].concat(myMessages, filtered);
                    console.log(myMessages);
                    setMyMessages(myMessages);
                    i+=1000;
                }
            }
            return;
            
        }
        
    }

    console.log(props.signer);
    return (

      <div style={{height:"100vh",textAlign:"center",display:"block"}}>
      
        <h1>This is Home</h1>
        <ul>
            {myMessages?
                myMessages.map( message => {
                    console.log(message);
                    return <p key={message.args.transactionHash}>{hex_to_ascii(message.args.text)}</p>
                }):
                null
            }

        </ul>
    </div>
        
    )
}
