import React from 'react'
import Button from '@mui/material/Button';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import {useNavigate} from 'react-router-dom';
import { ethers } from "ethers";
//const Buffer = require('buffer/').Buffer
//const crypto = require('crypto');


export default function Connect(props){

    const navigate = useNavigate();

    const connect = async () => {
      //EXPERIMENTAL PART//
      // const privateKey1 = ethers.utils.arrayify("0x4b04ae506677b002ebf4bf2883e79482fe28203e4f0aa27468bac06cef1d42e2");
      // //const messageHash = await secp.utils.sha256("hello world");
      // const publicKey1 = secp.getPublicKey(privateKey1);
      // console.log("pubkey: ",publicKey1);
      // const addr1 = getAddrFromPubKey(publicKey1);

      // const privateKey2 = ethers.utils.arrayify(publicKey2);
      // //const messageHash = await secp.utils.sha256("hello world");
      // const publicKey2 = secp.getPublicKey(privateKey2);
      // console.log("pubkey: ",publicKey2);
      // const addr2 = getAddrFromPubKey(publicKey2);

      // // const key1 = crypto.createECDH('secp256k1');
      // // key1.setPrivateKey(privateKey1);
      // // getAddrFromPubKey(key1.getPublicKey());

      // // const key2 = crypto.createECDH('secp256k1');
      // // key2.setPrivateKey(privateKey2);
      // // getAddrFromPubKey(key2.getPublicKey());

      // // const ephimkey1 = key1.computeSecret(key2.getPublicKey(), null,'base64');
      // // const ephimkey2 = key2.computeSecret(key1.getPublicKey(), null,'base64');
      
      // // console.log("match? ",ephimkey1 === ephimkey2);
      //LOOP
      // const quickNode = new ethers.providers.JsonRpcProvider("https://dawn-still-glitter.matic-testnet.quiknode.pro/03d623d4fda96910a5fc227ac442b7285b128f87/");
      
      // const config = {
      //   apiKey: "8fFNqMBZNMhMymyssknMkz8abFU8ZrIM",
      //   //quickNode.window.ethereum.networkVersion === 80001 ? network: Network.MATIC_MUMBAI : Network.MATIC_POLYGON ,
      //   network: Network.MATIC_MUMBAI
      // };
      // const alchemy = new Alchemy(config);
      
      // const data = await alchemy.core.getAssetTransfers({
      //   fromBlock: "0x1111111",
      //   fromAddress: "0xDb326d217C2452faebB40ACEb75000F0bb986703",
      //   category: ["external", "erc20", "erc721", "erc1155"],
      // });
      // console.log(data);
      
      // // web3.eth.getBlockNumber().then((result) => {
      // //   console.log("Latest Ethereum Block is ",result);
      // //   });
      // //const last_tx = quickNode.eth_getTransactionByHash(data.transfers[0].hash);
  
      // for(let i=0;i< data.transfers.length;i++){
      //   console.log(i);


      //   const trans = await alchemy.transact.getTransaction(data.transfers[i].hash);
      //   console.log("trans: ",trans);
        
      //   const last_tx = await quickNode.send("eth_getTransactionByHash", [
      //     data.transfers[i].hash,
      //   ]);
      //   console.log("last_tx: ",last_tx);
      //   const expandedSig = {
      //     r: last_tx.r,
      //     s: last_tx.s,
      //     v: last_tx.v
      //   }
      //   const txData = {
      //     r: last_tx.r,
      //     s: last_tx.s,
      //     v: last_tx.v,
      //     type: parseInt(last_tx.type),
      //     maxPriorityFeePerGas: last_tx.maxPriorityFeePerGas,
      //     maxFeePerGas: last_tx.gasPrice,
      //     gasPrice: last_tx.gasPrice,
      //     gasLimit: last_tx.gasLimit,
      //     value: last_tx.value,
      //     nonce: last_tx.nonce,
      //     data: last_tx.data,
      //     chainId: parseInt(last_tx.chainId),
      //     to: last_tx.to // you might need to include this if it's a regular tx and not simply a contract deployment
      //   }
      //   last_tx.type = parseInt(last_tx.type);
      //   last_tx.maxFeePerGas = last_tx.gasPrice;
      //   const signature = ethers.utils.joinSignature(expandedSig);
      //   console.log("last_tx.raw",last_tx.raw);
        
      //   const rsTx = await ethers.utils.resolveProperties(txData);
      //   const raw = ethers.utils.serializeTransaction(rsTx); // returns RLP encoded tx
      //   console.log("raw", raw);
      //   //const msgHash = ethers.utils.keccak256("0x225c783139457468657265756d205369676e6564204d6573736167653a5c6e333222"+ ethers.utils.keccak256(raw).slice(2)); // as specified by ECDSA
      //   const msgHash = ethers.utils.keccak256(raw); // as specified by ECDSA
      //   console.log("hash generated: ",msgHash);
      //   const msgBytes = ethers.utils.arrayify(msgHash); // create binary hash
      //   //const recoveredPubKey = ethers.utils.recoverPublicKey(msgBytes, signature)
      //   const recoveredPubKey = ethers.utils.recoverPublicKey(msgBytes, signature);
      //   //const recoveredAddress = ethers.utils.recoverAddress(hexStringToByteArray(last_tx.hash), signature);
      //   const recoveredAddress = ethers.utils.recoverAddress(msgBytes, signature);
      //   console.log("recoveredPubKey", recoveredPubKey);
      //   console.log("recoveredAddress", recoveredAddress);
      //   // const addy = await getPubKeyFromTx(rsTx);
      //   // console.log(addy);
        
      //   if (recoveredAddress.toLowerCase() === "0xDb326d217C2452faebB40ACEb75000F0bb986703".toLowerCase()){
          
      //     console.log('FOUND!!!');
      //     break;
      //   }

      // }
      //END OF EXPERIMENT
      
      console.log("inside connect");
      await props.connectWallet();
      console.log("about to redirect");
      return navigate('/');
    }
    return (

      <div style={{height:"100vh",textAlign:"center",display:"flex"}}>
      
        <Button variant="contained" color="success" sx ={{
            marginLeft:"auto",
             marginRight:"auto",
             marginTop:"auto",
             marginBottom:"auto",
        }} onClick={connect}
        >
          Connect wallet  <AccountBalanceWalletIcon fontSize="small"/>
          </Button>
          </div>
        
    )
}

