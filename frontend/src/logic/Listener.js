

const sync = () => {
    filter = {
        address: tokenAddress,
        topics: [
            utils.id("Transfer(address,address,uint256)"),
            hexZeroPad(myAddress, 32)
        ]
    };
}

export default {sync}