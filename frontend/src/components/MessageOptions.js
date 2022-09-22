import React, { useEffect, useState, useRef } from "react";
import Switch from "@mui/material/Switch";
import ToggleButton from "@mui/material/ToggleButton";
import Tooltip from "@mui/material/Tooltip";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function MessageOptions(props) {
  const handleMessageType = (event, newType) => {
    props.setMessageType(newType);
    console.log("changed message type to", newType);
  };

  const handleEncrypted = (event) => {
    props.setEncryptedMessage(event.target.checked);
    console.log("changed message encrypted to", event.target.checked);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "max-content",
        backgroundColor: "#10104f",
        color: "white",
        borderRadius: "0.7rem",
      }}
    >
    <Tooltip title={props.privKey.length>0?
        "You can send your message encrypted, or NOT encrypted. Encryption will guarantee the absolute privacy of your message, and will allow you to send money as an incentive for the recipient to read your content.":
        "To enable encrypted messages you need to enter your private key first. Encrypted messages will guarantee the privacy of your communications strictly between you and the recipient."}>
      <div
        style={{
          display: "block",
          height: "max-content",
          paddingLeft: "15px",
          width: "min-content",
        }}
      >
        <div>
          <label style={{ fontSize: "0.8rem" }}>Encrypted Message?</label>
        </div>
        
        <Switch
          disabled={props.privKey.length>0?false:true}
          checked={props.encryptedMessage}
          onChange={handleEncrypted}
          color={"secondary"}
          inputProps={{ "aria-label": "controlled" }}
        />
      </div>
      </Tooltip>
      <div
        style={{
          display: "block",
          height: "max-content",
          paddingLeft: "15px",
          paddingRight: "15px",
        }}
      >
        <div
          style={{
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <label style={{ fontSize: "0.9rem" }}>Send Message As:</label>
        </div>
        <div style={{ width: "min-content" }}>
          <ToggleButtonGroup
            color="primary"
            value={props.messageType}
            exclusive
            onChange={handleMessageType}
          >
            <Tooltip title="Send messages stored as an Event on the blockchain (available for 4 years. The cheapest option). If your intended recepient is not aware of this app, he/she most likely won't be aware you sent them a message either. If this is the case, we recommend to send message as an NFT.">
              <ToggleButton
                value="event"
                size="small"
                
                sx={{
                  fontSize: "0.7rem",
                  color: props.messageType === "event" ? "#1876D1" : "white",
                  borderColor: "white",
                }}
              >
                $ Event
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Sends messages stored on the blockchain (available indefinitely. Medium cost). If your intended recepient is not aware of this app, he/she most likely won't be aware you sent them a message either. If this is the case, we recommend to send message as an NFT.">
              <ToggleButton
                value="saved"
                size="small"
                sx={{
                  fontSize: "0.7rem",
                  color: props.messageType === "saved" ? "#1876D1" : "white",
                  borderColor: "white",
                }}
              >
                $$ Stored
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Send message as an NFT. The recipient will be able to see an NFT in his/her OpenSea page or any other NFT explorer. This makes it more likely that the person will notice the message despite the fact that he/she might not be aware of this messaging app at all. This also increases the chances that the other person will read your message and reply (the most expensive option in terms of gas)">
              <ToggleButton
                value="nft"
                size="small"
                sx={{
                  fontSize: "0.7rem",
                  color: props.messageType === "nft" ? "#1876D1" : "white",
                  borderColor: "white",
                }}
              >
                $$$ NFT
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </div>
      </div>
    </div>
  );
}
