import {Routes, Route, HashRouter} from 'react-router-dom'
import './App.css';
import Connect from './components/connect'
import Home from './components/home'
import { ethers } from "ethers";
import React, {useEffect, useState, useRef} from 'react'

const contractABI = require("./abi/SenderMessage.json")

function App() {

  const [provider,setProvider] = useState(new ethers.providers.Web3Provider(window.ethereum));
  const [signer, setSigner] = useState(null);
  const [myAddress, setMyAddress] = useState("")
  const messageABI = useRef(null);

  useEffect( () => {
  
  const initContracts = async () => {
      messageABI.current =  new ethers.Contract(
        "0x11692A334351d4Be544Dc106B2447EBEdaac4A39",
        contractABI.abi,
        signer
       );
        
      console.log("messageABI",messageABI);
      console.log("signer",signer);
    }
      initContracts();
      
    },[provider,signer]);
    
      
  const connectWallet = async () => {
    const _provider = new ethers.providers.Web3Provider(window.ethereum)
    await _provider.send("eth_requestAccounts", []);
    const signer =  _provider.getSigner();
    const _address = await signer.getAddress();
    setMyAddress(_address);
    console.log(_address);
    setProvider(_provider);
    setSigner(signer);
    return;
  }


  return (
    <div>
      <HashRouter>
        
        <Routes>
          <Route exact path="/" 
                 element={ 
                    <Home signer={ signer } messageABI={ messageABI } myAddress={myAddress}
                          provider={provider}
                          contractAddress={"0x11692A334351d4Be544Dc106B2447EBEdaac4A39"}
                        /> }
                    />
          <Route path="/connect"  element={<Connect connectWallet={connectWallet}/>} />
        </Routes>
      </HashRouter>
      </div>
  );
  
}

export default App;
