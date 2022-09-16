import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import ButtonBase from '@mui/material/ButtonBase';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import hex_to_ascii from "../logic/helpers";

export default function ConvoList(props){

    const [myConvos,setConvos] = useState({});

    useEffect(()=>{
        setConvos(props.convos)
    },[props.convos]);

    console.log("ConvoList", myConvos)
    console.log("ConvoList type", typeof myConvos)
    console.log("ConvoList length", Object.entries(myConvos))
    return(
        <Box sx={{maxWidth:"40%", minWidth:"30%", height:"600px", padding:"2px", borderRadius:"9px",
                   borderWidth:"5px", backgroundColor:"#55d", overflow:"scroll"}}>
            {Object.entries(myConvos).length>0?
            Object.entries(myConvos).map(([bob, convo]) => {
                console.log("bob, convo", bob, convo)
                return(
                    <Card  key={bob} sx={{ width: "100%", height:"100px", borderBlockWidth:"5px", margin:"3px", borderRadius:"1vw"}}>
                        <CardActionArea onClick={()=>{props.setSelectedConvo(bob)}}>
                        <CardContent>
                            <div style={{color:"#88b", fontSize:"large"}}>{bob}</div>
                            <p style={{color:"#aaa", fontSize:"small", overflow:"hidden", maxLines:"2",
                                        textOverflow:"ellipsis", display:"block", wordWrap:"break-word"}}>
                            {convo[0].text}
                            </p>
                        </CardContent>
                        </CardActionArea>
                    </Card>
                )
            }):
            <p>No conversations</p>}

        </Box>
    )

}