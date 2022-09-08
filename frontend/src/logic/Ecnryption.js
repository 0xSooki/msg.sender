const ethers = require("ethers")
const polygonscan = require("polygonscan-api").init(process.env.POLYGONSCAN_TOKEN, 'mumbai', '3000');

const crypto = require('crypto-browserify');

const getPubKey = async (last_block, addr) => {

    console.log("inside Encryption")
    console.log("last_block ",last_block,"addr ",addr)
    
   
    const transaction = await getATxFromAddress(last_block, addr);
    //  const quickNode = new ethers.providers.JsonRpcProvider(
    //   `https://polygon.infura.io/v3/${process.env.WEB3_INFURA_PROJECT_ID}`
    //  )
    const quickNode = new ethers.providers.JsonRpcProvider(process.env.QUICKNODE_MUMBAI);
    //const quickNode = new ethers.providers.JsonRpcProvider("https://dawn-still-glitter.matic-testnet.quiknode.pro//");
    const tx = await quickNode.getTransaction(
        transaction
    )
    console.log("Encryption tx from quicknode: ",tx);
    const expandedSig = {
    r: tx.r,
    s: tx.s,
    v: tx.v
    }
    const signature = ethers.utils.joinSignature(expandedSig)
    let txData;
        switch (tx.type) {
            case 0:
                txData = {
                    gasPrice: tx.gasPrice,
                    gasLimit: tx.gasLimit,
                    value: tx.value,
                    nonce: tx.nonce,
                    data: tx.data,
                    chainId: tx.chainId,
                    to: tx.to
                };
                break;
            case 2:
                txData = {
                    gasLimit: tx.gasLimit,
                    value: tx.value,
                    nonce: tx.nonce,
                    data: tx.data,
                    chainId: tx.chainId,
                    to: tx.to,
                    type: 2,
                    maxFeePerGas: tx.maxFeePerGas,
                    maxPriorityFeePerGas: tx.maxPriorityFeePerGas
                }
                break;
            default:
                throw "Unsupported tx type";
        }
    const rsTx = await ethers.utils.resolveProperties(txData)
    const raw = ethers.utils.serializeTransaction(rsTx) // returns RLP encoded tx
    const msgHash = ethers.utils.keccak256(raw) // as specified by ECDSA
    const msgBytes = ethers.utils.arrayify(msgHash) // create binary hash
    const recoveredPubKey = ethers.utils.recoverPublicKey(msgBytes, signature)
    const recoveredAddress = ethers.utils.recoverAddress(msgBytes, signature)
    console.log("Encryption",recoveredAddress)
    console.log("Encryption",recoveredPubKey)
    return recoveredPubKey;
    }

const getATxFromAddress = async(last_block, addr) =>{
    const STEP = 2000000;
    
    while(last_block>0){
        const end = last_block - STEP;
        const tx_hist = await polygonscan.account.txlist(addr, end, last_block, 1,1);
        console.log("api: ",tx_hist);
        if (tx_hist.result){
            console.log("found a transaction", tx_hist);
            return tx_hist.result[0].hash;
        }
        last_block -= STEP;
        console.log(last_block);
    }return false;

}

const decrypt = (cipherText, secret, iv) => {
    const decrypter = crypto.createDecipheriv("aes-256-cbc", secret, iv);
    console.log("decrypter", decrypter);
    console.log("cipherText", cipherText);
    let decryptedMsg = decrypter.update(cipherText, "hex", "utf8");
    console.log("decryptedMsg", decryptedMsg);
    decryptedMsg += decrypter.final("utf8");
    console.log("Decrypted message: " + decryptedMsg);
    return decryptedMsg;
    }

export  {decrypt, getPubKey}

