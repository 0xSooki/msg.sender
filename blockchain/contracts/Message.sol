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
    }

    uint public index = 0;

    mapping(address => uint) private balance;

    mapping (uint => Message) message;
    address authorized;

    event Withdrawal(address indexed user, uint amount);
    event NewMessage(address indexed from, address indexed to, uint indexed msgId, bytes cipherText, uint pubkeyX, bool pubkeyYodd, uint128 iv, uint8 eventSavedOrNft, uint amount);

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

    function sendCipherText(bytes memory cipherText, uint pubkeyX, bool pubkeyYodd, uint128 iv, address to, uint8 eventSavedOrNft) external payable {
        //id must never be 0
        uint _id = index += 1;

        if (eventSavedOrNft > 1){
            message[_id].cipherText = cipherText;
            message[_id].encrypted = true;
            message[_id].pubkeyX = pubkeyX;
            message[_id].pubkeyYodd = pubkeyYodd;
            message[_id].from = _msgSender();
            message[_id].iv = iv;
            message[_id].to = to;
            message[_id].value = msg.value;
            if(eventSavedOrNft > 2){
               // the NFT goes to the receiver
                super._mint(to, _id);
            }
        }
        
        balance[to] += msg.value;
        emit NewMessage(_msgSender(), to, _id, cipherText, pubkeyX, pubkeyYodd,  iv,  eventSavedOrNft, msg.value);
        //return _id;
    }

    function sendPlainText(bytes memory plainText, uint8 eventSavedOrNft, address to) external payable {
        //id must never be 0
        uint _id = index += 1;

        if (eventSavedOrNft > 1){
            message[_id].cipherText = plainText;
            message[_id].encrypted = false;
            message[_id].from = _msgSender();
            message[_id].to = to;
            message[_id].value = msg.value;
            if(eventSavedOrNft > 2){
               // the NFT goes to the receiver
                super._mint(to, _id);
            }
        }
        
        balance[to] += msg.value;
        emit NewMessage(_msgSender(), to, _id, plainText, 0, false,  0,  eventSavedOrNft, msg.value);
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