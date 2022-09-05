import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { ethers } from "ethers";

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
    },[ props.messageABI.current, props.signer])
    
    const sync = async () => {
        let myMessages = []
        if(props.messageABI.current !== null){
            console.log("we got a valid contract")
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
                    i+=1000;
                }
            }
            
            
        }
        
    }

    console.log(props.signer);
    return (

      <div style={{height:"100vh",textAlign:"center",display:"flex"}}>
      
        <h1>This is Home</h1>
        {/* <ul>
            {myMessages.map( message => {
                <p key={message.id}>{message.text}</p>
            })}

        </ul> */}
    </div>
        
    )
}

