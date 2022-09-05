const ethers = require("ethers")

const pk =
 "0x0471c746523d16e93d4738f882d9b0beebf66c68caa0f895db15686b57b878cfc7b3e09813ba94f1bbfaa91a06566d3d18bbf69d10bcc947325bbcd6fea97ed692"
const ad = "0x36D52654f24f3728a295676acf1b421295fdab4D"

const getPubKey = async () => {
    console.log("inside Encryption")
//  const quickNode = new ethers.providers.JsonRpcProvider(
//   `https://polygon.infura.io/v3/${process.env.WEB3_INFURA_PROJECT_ID}`
//  )
//const quickNode = new ethers.providers.JsonRpcProvider(process.env.QUICKNODE_MUMBAI);
const quickNode = new ethers.providers.JsonRpcProvider("https://dawn-still-glitter.matic-testnet.quiknode.pro/03d623d4fda96910a5fc227ac442b7285b128f87/");
const tx = await quickNode.getTransaction(
  "0xa83f1502b6ced7c248313d1da91d68f3d62a9a2e75d882d0b9b892678d9e0cef"
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
 //console.log("Correct public key:", recoveredPubKey === pk)
 console.log("Encryption Correct address:", recoveredAddress === ad)
}

export default (getPubKey);

