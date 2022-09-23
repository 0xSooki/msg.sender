pragma solidity ^0.8.0;

import "node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "node_modules/@openzeppelin/contracts/security/Pausable.sol";
import "node_modules/@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "node_modules/@openzeppelin/contracts/utils/Context.sol";
import "node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract SenderMessage is ERC721Enumerable, ERC721Burnable, Pausable, Ownable{

    struct Message {
        bytes cipherText;
        bool encrypted;
        uint pubkeyX;
        bool pubkeyYodd;
        uint128 iv;
        address to;
        address from;
        uint value;
        uint8 eventSavedOrNft;
        uint blockN;
    }

    struct Payment {
        uint balance;
        uint blockN;
        address from;
        bool replied;
        bool hasToReply;
    }

    uint public index = 0;

    mapping(address => mapping(uint => Payment)) private payment;

    mapping (uint => Message) message;
    address authorized;

    event Withdrawal(address indexed user, uint msgId, uint amount);
    event WithdrawalUnclaimed(address indexed user, uint msgId, uint amount);
    event NewMessage(address indexed from, address indexed to, uint indexed msgId, bytes cipherText, uint pubkeyX, bool pubkeyYodd, uint128 iv, uint8 eventSavedOrNft, uint amount, bool hasToReply, uint blockNumber);

    constructor() ERC721("Message", "MSG"){ }

    function setAuthorized(address _authorized) external onlyOwner{
        authorized = _authorized;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override (ERC721Enumerable, ERC721){
        require(!paused(), "ERC721Pausable: token transfer while paused");
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /**
     * @dev Returns weather a contracts supports a certain Interface.
     * @param interfaceId of the interface to check.
     * @return True if the contract supports such interface.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override (ERC721, ERC721Enumerable) returns (bool) {
        return interfaceId == type(IERC721).interfaceId || 
                interfaceId == type(IERC721Metadata).interfaceId || 
                super.supportsInterface(interfaceId);
    }

    function sendCipherText(bytes memory cipherText, uint pubkeyX, bool pubkeyYodd, uint128 iv, address to, uint8 eventSavedOrNft, bool hasToReply, uint inReplyOf) external payable {
        //id must never be 0
        uint _id = index += 1;
        uint blockN = block.number;
        if(inReplyOf>0){
            require(to == message[inReplyOf].from);
            payment[_msgSender()][inReplyOf].replied = true;
        }if (msg.value > 0){
            require(eventSavedOrNft>1,"Messages with payments need to be stored in the contract");
        }

        if (eventSavedOrNft > 1){
            if (msg.value > 0){
                payment[to][_id].blockN = blockN;
                payment[to][_id].from = _msgSender();
                payment[to][_id].hasToReply = hasToReply;
                payment[to][_id].balance += msg.value;
            }
            message[_id].cipherText = cipherText;
            message[_id].encrypted = true;
            message[_id].pubkeyX = pubkeyX;
            message[_id].pubkeyYodd = pubkeyYodd;
            message[_id].from = _msgSender();
            message[_id].iv = iv;
            message[_id].to = to;
            message[_id].value = msg.value;
            message[_id].blockN = blockN;
            if(eventSavedOrNft > 2){
               // the NFT goes to the receiver
                super._mint(to, _id);
            }
        }
        
        
        emit NewMessage(_msgSender(), to, _id, cipherText, pubkeyX, pubkeyYodd,  iv,  eventSavedOrNft, msg.value, hasToReply, blockN);
        //return _id;
    }

    function sendPlainText(bytes memory plainText, uint8 eventSavedOrNft, address to, bool hasToReply, uint inReplyOf) external payable {
        //id must never be 0
        uint _id = index += 1;
        uint blockN = block.number;

        if(inReplyOf>0){
            require(to == message[inReplyOf].from,"Replying to wrong address");
            payment[_msgSender()][inReplyOf].replied = true;
        }

        if (eventSavedOrNft > 1){
            if (msg.value > 0){
                payment[to][_id].blockN = blockN;
                payment[to][_id].from = _msgSender();
                payment[to][_id].hasToReply = hasToReply;
                payment[to][_id].balance += msg.value;
            }
            message[_id].cipherText = plainText;
            message[_id].encrypted = false;
            message[_id].from = _msgSender();
            message[_id].to = to;
            message[_id].value = msg.value;
            message[_id].blockN = blockN;
            if(eventSavedOrNft > 2){
               // the NFT goes to the receiver
                super._mint(to, _id);
            }
        }
        emit NewMessage(_msgSender(), to, _id, plainText, 0, false,  0,  eventSavedOrNft, msg.value, hasToReply, blockN);
        //return _id;
    }

    function getMessage(uint msgId) external view returns(Message memory){
        return  message[msgId];
    }

    function withdraw(uint amount, uint msgId) external {
        address user = _msgSender();
        require(payment[user][msgId].balance >= amount, "Not enough balance");
        if(payment[user][msgId].hasToReply){
            require(payment[user][msgId].replied, "You need to reply before claiming payment");
        }
        payment[user][msgId].balance -= amount;
        payable(user).transfer(amount);
        emit Withdrawal(user, msgId, amount);
    }

    function userBalance(address user, uint msgId) external view returns(uint){
        return payment[user][msgId].balance;
    }

    function getUnclaimedPayment(address to, uint msgId, uint amount ) external {
        address user = _msgSender();
        require(payment[to][msgId].from == user,"You are not the sender of this message");
        require(block.number > (payment[to][msgId].blockN + 1150000), "Too soon to claim. Wait for at least 1 month.");
        require(payment[user][msgId].balance >= amount, "Not enough balance");
        payment[user][msgId].balance -= amount;
        payable(user).transfer(amount);
        emit WithdrawalUnclaimed(user, msgId, amount);
    }

     
   
}