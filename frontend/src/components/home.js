import React, { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'

export default function Home(props){

    const navigate = useNavigate();

    useEffect(( ) => {
        async function checkState(){
            //await new Promise(r => setTimeout(r, 500));
            if(props.signer === null){
                navigate('/connect');
            }
        }checkState();
    },[])
    

    console.log(props.signer);
    return (

      <div style={{height:"100vh",textAlign:"center",display:"flex"}}>
      
        <h1>This is Home</h1>
    </div>
        
    )
}

