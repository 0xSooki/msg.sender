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
          checked={props.encryptedMessage}
          onChange={handleEncrypted}
          color={"secondary"}
          inputProps={{ "aria-label": "controlled" }}
        />
      </div>
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
            <Tooltip title="Send messages stored as an Event on the blockchain (available for 4 years)">
              <ToggleButton
                value="event"
                size="small"
                sx={{
                  fontSize: "0.7rem",
                  color: "white",
                  borderColor: "white",
                }}
              >
                $ Event
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Sends messages stored on the blockchain (available indefinitely)">
              <ToggleButton
                value="saved"
                size="small"
                sx={{
                  fontSize: "0.7rem",
                  color: "white",
                  borderColor: "white",
                }}
              >
                $$ Stored
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Send messages as NFTs (available indefinitely)">
              <ToggleButton
                value="nft"
                size="small"
                sx={{
                  fontSize: "0.7rem",
                  color: "white",
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
