import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import StartNewConvo from "./StartNewConvo";

export default function ConvoList(props) {
  const [myConvos, setConvos] = useState({});

  useEffect(() => {
    setConvos(props.convos);
  }, [props.convos]);

  const setBob = (bob) => {
    props.setSelectedConvo(bob);
    let found = false;
    for (let i = 0; i < myConvos[bob].length; i++) {
      if (myConvos[bob][i].from === bob) {
        props.setPubKeyX(myConvos[bob][i].pubkeyX);
        props.setPubKeyYodd(myConvos[bob][i].pubkeyYodd);
        console.log(
          "just set bobs pub key",
          myConvos[bob][i].pubkeyX,
          myConvos[bob][i].pubkeyYodd
        );
        found = true;
        break;
      }
    }
    if (!found) {
      console.log("No message received from address");
      props.setPubKeyX(null);
      props.setPubKeyYodd(null);
    }
  };

  console.log("ConvoList", myConvos);
  console.log("ConvoList type", typeof myConvos);
  console.log("ConvoList length", Object.entries(myConvos));
  return (
   <div>
   <div style={{width:"100%"}}>
   <StartNewConvo handleOpen={props.handleOpen}/>
   </div>
    <Box
      sx={{
        width: "100%",
        height: "530px",
        padding: "2px",
        borderRadius: "9px",
        borderWidth: "5px",
        backgroundColor: "#55d",
        overflowY: "scroll",
        overflow: "scroll",
        

        
      }}
    > 
    
    <div style={{overflow: "scroll", display:"flex", flexDirection:"column-reverse"}}>
      {Object.entries(myConvos).length > 0 ? (
        Object.entries(myConvos).map(([bob, convo]) => {
          console.log("bob, convo", bob, convo);
          return (
            <Card
              key={bob}
              sx={{
                width: "100%",
                height: "100px",
                borderBlockWidth: "5px",
                margin: "3px",
                borderRadius: "1vw",
              }}
            >
              <CardActionArea
                onClick={() => {
                  setBob(bob);
                }}
              >
                <CardContent>
                  <div style={{ color: "#88b", fontSize: "large" }}>{bob}</div>
                  <p
                    style={{
                      color: "#aaa",
                      fontSize: "small",
                      overflow: "hidden",
                      maxLines: "2",
                      textOverflow: "ellipsis",
                      wordWrap: "break-word",
                    }}
                  >
                    {convo[0].text}
                  </p>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })
      ) : (
        <p>No conversations</p>
      )}
      </div>
    </Box>
    </div>
  );
}
