#!/usr/bin/python3
import pytest
from brownie import SenderMessage, accounts
import brownie
import random

MESSAGES = ["This is a character 30 message",
            "7 chars",
            "This is a character 61 message This is a character 61 message",
            ]


#@pytest.fixture
def test_message():
    print(accounts[0])
    print(type(accounts[0]))
    print(int(str(accounts[0]),base=16))

    message_contract = SenderMessage.deploy(
            {'from': accounts[0], "gas_price": "auto"})

    #bytes memory cipherText, uint pubkeyX, bool pubkeyYodd, uint128 iv, address to, uint8 eventSavedOrNft, hasToReply, inReplyOf
    tx = message_contract.sendCipherText(bytes(MESSAGES[0],'utf-8'),0xffffffffffffff, False, 0xff, accounts[1], 1, False, 0,
                            {'from': accounts[0], "gas_price": "auto"})
    print(f"minting transaction from {accounts[0]} to {accounts[1]}: ",tx.info())


    for i,msg in enumerate(MESSAGES):
        print(msg)
        tx = message_contract.sendCipherText(bytes(MESSAGES[0],'utf-8'),0xffffffffffffff, False, 0xff, accounts[i+1], 2, True, 0,
                            {'from': accounts[i], "gas_price": "auto", 'value':5000000000000})
        print(f"minting transaction from {accounts[i]} to {accounts[i+1]}: ",tx.info())

    with brownie.reverts("You need to reply before claiming payment"):
        message_contract.withdraw(5000000000000, 2, {'from': accounts[1]})
    with brownie.reverts("Not enough balance"):
        message_contract.withdraw(5000000000000, 3, {'from': accounts[5]})
    tx = message_contract.sendCipherText(bytes("replying",'utf-8'),0xffffffffffffff, False, 0xff, accounts[0], 2, False, 2,
                            {'from': accounts[1], "gas_price": "auto"}) 
    print(f"replying to 2: ",tx.info()) 
    balanceBefore = accounts[1].balance()
    print("balanceBefore", balanceBefore)
    message_contract.withdraw(2000000000000, 2, {'from': accounts[1]})
    print("balanceAfter", accounts[1].balance())
   
    assert(accounts[1].balance() > (2000000000000 + balanceBefore - 500000) )
    remaining = message_contract.userBalance(accounts[1], 2)
    print("remaining", remaining)
    assert remaining == 3000000000000


    for i,msg in enumerate(MESSAGES):
        print(msg)
        tx = message_contract.sendCipherText(bytes(msg,'utf-8'),0xffffffffffffff, False, 0xff, accounts[i+1], 3, True, 0,
                            {'from': accounts[i], "gas_price": "auto", 'value':5000000000000})
        print(f"minting transaction from {accounts[i]} to {accounts[i+1]}: ",tx.info())
        
    for i,msg in enumerate(MESSAGES):
        print(msg)
        tx = message_contract.sendCipherText(bytes(msg,'utf-8'),0xffffffffffffff, False, 0xff, accounts[i+1], 3, False, 0,
                            {'from': accounts[i], "gas_price": "auto"})
        print(f"minting transaction from {accounts[i]} to {accounts[i+1]}: ",tx.info())
        
        
    for i in range(1,5):
        print(message_contract.getMessage(i))   
    assert True == False