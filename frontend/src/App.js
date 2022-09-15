
import {Routes, Route, HashRouter} from 'react-router-dom';
import './App.css';
import Connect from './components/connect';
import Home from './components/home';
import SendMessage from "./components/SendMessage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ethers } from "ethers";
import React, { useEffect, useState, useRef } from "react";
import {ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from} from "@apollo/client";
import {onError} from "@apollo/client/link/error";

const contractABI = require("./abi/SenderMessage.json");


const errorLink = onError(({graphqlErrors, networkError}) => {
  if(graphqlErrors){
    graphqlErrors.map((message, location, path) => {
      alert(`graphql error ${message} location ${location} path ${path}`)
      return;
    })
  }
  if(networkError){
    networkError.map((message, location, path) => {
      alert(`graphql error ${message} location ${location} path ${path}`)
      return;
    })
  }
})
const link = from([errorLink, new HttpLink({uri: "https://api.thegraph.com/subgraphs/name/oscarsernarosero/msgsender"})])
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link
})


function App() {
  const [provider, setProvider] = useState(
    new ethers.providers.Web3Provider(window.ethereum)
  );
  const [signer, setSigner] = useState(null);
  const [myAddress, setMyAddress] = useState("");
  const [privKey, setPrivateKey] = useState([]);
  const messageABI = useRef(null);

  useEffect(() => {
    const initContracts = async () => {
      messageABI.current = new ethers.Contract(
        "0x270b80292699c68D060F5ffECCC099B78465a3F3",
        contractABI.abi,
        signer
      );

      console.log("messageABI", messageABI);
      console.log("signer", signer);
    };
    initContracts();
  }, [provider, signer]);

  const connectWallet = async () => {
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    await _provider.send("eth_requestAccounts", []);
    const signer = _provider.getSigner();
    const _address = await signer.getAddress();
    setMyAddress(_address);
    console.log(_address);
    setProvider(_provider);
    setSigner(signer);
    return;
  };

  return (
    <div>
      <ApolloProvider client={client}>
      <HashRouter>
      <Header />
        <Routes>
          <Route exact path="/" 
                 element={ 
                    <Home signer={ signer } messageABI={ messageABI } myAddress={myAddress}
                          provider={provider} privKey={privKey} 
                          setPrivateKey={(_privKey) => setPrivateKey(_privKey)}
                          contractAddress={"0x270b80292699c68D060F5ffECCC099B78465a3F3"}
                        /> }
                    />
          <Route exact path="/send-message" 
                 element={ 
                    <SendMessage signer={ signer } setPrivateKey={(_privKey) => setPrivateKey(_privKey)}
                    privKey={privKey} provider={provider} messageABI={ messageABI }
                        /> }
                    />
          <Route path="/connect"  element={
                    <Connect 
                    setPrivateKey={(_privKey) => setPrivateKey(_privKey)}
                    connectWallet={connectWallet}/>} />
        </Routes>
        <Footer />
      </HashRouter>
      </ApolloProvider>
    </div>
  );
}

export default App;
