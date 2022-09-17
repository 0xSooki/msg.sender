
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
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useProvider, useSigner, useContract } from 'wagmi'

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


function App(props) {
  
  
  const { connectWallet } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()
  const myAddressObj = useAccount()
  const provider = useProvider();
  const signerObj = useSigner();
  const [signer, setSigner] = useState(signerObj.data);
  const [myAddress, setMyAddress] = useState(myAddressObj.address);
  const [privKey, setPrivateKey] = useState([]);
  // while(signerObj.isFetching){
  //   //await new Promise((r) => setTimeout(r, 500));
  //   console.log("waiting")
  // }
  const messageABI = useRef(useContract({
    addressOrName: '0x270b80292699c68D060F5ffECCC099B78465a3F3',
    contractInterface: contractABI.abi,
    signerOrProvider:signer}));

  // messageABI.current = useContract({
  //   addressOrName: '0x270b80292699c68D060F5ffECCC099B78465a3F3',
  //   contractInterface: contractABI.abi,
  //   signerOrProvider:signer}
  //   );

  useEffect(() => {
    const initContracts = async () => {
      // messageABI.current = new ethers.Contract(
      //   "0x270b80292699c68D060F5ffECCC099B78465a3F3",
      //   contractABI.abi,
      //   signer
      // );
      setSigner(signerObj.data);
      };
      initContracts();
  }, [signerObj, provider]);

  // const connectWallet = async () => {
  //   const _provider = new ethers.providers.Web3Provider(window.ethereum);
  //   await _provider.send("eth_requestAccounts", []);
  //   const signer = _provider.getSigner();
  //   const _address = await signer.getAddress();
  //   setMyAddress(_address);
  //   console.log(_address);
  //   setProvider(_provider);
  //   setSigner(signer);
  //   return;
  // };
console.log(signerObj.data)
console.log(messageABI.current)
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
