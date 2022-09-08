import React from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import PrivKeyInput from './PrivKeyInput';
//const Buffer = require('buffer/').Buffer
//const crypto = require('crypto');

export default function Connect(props) {
  const navigate = useNavigate();

  const connect = async () => {
    console.log("inside connect");
    await props.connectWallet();
    console.log("about to redirect");
    return navigate("/");
  };
  return (
    <div className="flex min-h-screen items-center justify-center">
      <button
        className="btn bg-green-500 hover:bg-green-700 p-4 rounded"
        onClick={connect}
      >
        <span className="font-bold">Connect wallet</span>
      </button>
      <PrivKeyInput setPrivateKey={(_privKey) => props.setPrivateKey(_privKey)}/>
    </div>
  );
}
