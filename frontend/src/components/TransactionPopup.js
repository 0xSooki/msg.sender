import React from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

export default function TransactionPopup(props) {
  
  return (
    <Modal
    open={props.txModalOpen}
    onClose={props.handleTxModalClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
    <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',width: 700,
        bgcolor: 'background.paper', border: '2px solid #000',  boxShadow: 24, p: 4, display:"block"}}>
        <div style={{textAlign:"center"}}>
            {props.txWaiting?
            <div>
                <div>Your transaction is being processed. Please wait.</div>
                <div><CircularProgress/></div>
            </div>:
            <div>
                Your transaction is finished.
                </div>}
            </div>
            <div style={{textAlign:"center"}}>
            {props.txHash?
                "Transaction hash: "+props.txHash:
                null}
            </div>
            <div style={{textAlign:"center"}}>
            {props.txSuccess?
                "Your transaction has been successfull!.":
                null}
            </div>
            <div style={{textAlign:"center"}}>
            {props.txError?
                "Something went wrong with your transaction. Please try again later":
                null}
            </div>

            </Box>
        </Modal>
  );
}
