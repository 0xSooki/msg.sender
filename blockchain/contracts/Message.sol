pragma solidity ^0.8.0;


import "node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract SenderMessage is  Ownable{

    struct Message {
        bytes cipherText;
        uint pubkeyX;
        bool pubkeyYodd;
        uint128 iv;
        address to;
        address from;
        uint value;
    }

    uint public totalSupply = 0;

    mapping(address => uint) private balance;

    mapping (uint => Message) message;
    address authorized;

    event Withdrawal(address indexed user, uint amount);
    event NewMessage(address indexed from, address indexed to, uint indexed msgId, bytes text, uint pubkey, uint amount);



    function setAuthorized(address _authorized) external onlyOwner{
        authorized = _authorized;
    }

    function mint(bytes memory cipherText, uint ephempubkey, address to) external payable {
        //id must never be 0
        uint _id = totalSupply += 1;
        // message[_id].cipherText = cipherText;
        // message[_id].ephempubkey = ephempubkey;
        // message[_id].from = _msgSender();
        // message[_id].to = to;
        // message[_id].value = msg.value;

        //the NFT goes to the receiver
        //super._mint(to, _id);
        balance[to] += msg.value;
        emit NewMessage(_msgSender(), to, _id, cipherText, ephempubkey, msg.value);
        //return _id;
    }

    function getMessage(uint msgId) external view returns(Message memory){
        return  message[msgId];
    }

    function withdraw(uint amount) external {
        address user = _msgSender();
        require(balance[user] >= amount, "Not enough balance");
        balance[user] -= amount;
        payable(user).transfer(amount);
        emit Withdrawal(user, amount);
    }

    function userBalance(address user) external view returns(uint){
        return balance[user];
    }

     
   
}