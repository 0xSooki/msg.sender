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

    #bytes memory cipherText, uint pubkeyX, bool pubkeyYodd, uint128 iv, address to, uint8 eventSavedOrNft, inReplyOf
    tx = message_contract.sendCipherText(bytes(MESSAGES[0],'utf-8'),0xffffffffffffff, False, 0xff, accounts[1], 1, 0,
                            {'from': accounts[0], "gas_price": "auto"})
    print(f"minting transaction from {accounts[0]} to {accounts[1]}: ",tx.info())

    with brownie.reverts("Messages with payments need to be stored in the contract"):
        tx = message_contract.sendCipherText(bytes(MESSAGES[0],'utf-8'),0xffffffffffffff, False, 0xff, accounts[1], 1, 0,
                            {'from': accounts[0], "gas_price": "auto", 'value':5000000000000})


    for i,msg in enumerate(MESSAGES):
        print(msg)
        tx = message_contract.sendCipherText(bytes(MESSAGES[0],'utf-8'),0xffffffffffffff, False, 0xff, accounts[i+1], 2, 0,
                            {'from': accounts[i], "gas_price": "auto", 'value':5000000000000})
        print(f"minting transaction from {accounts[i]} to {accounts[i+1]}: ",tx.info())

    with brownie.reverts("You need to reply before claiming payment"):
        message_contract.withdraw(5000000000000, 2, {'from': accounts[1]})
    with brownie.reverts("Not enough balance"):
        message_contract.withdraw(5000000000000, 10, {'from': accounts[5]})
    #CHANGE FROM 1150000 TO LESS THAN 10 IN CONTRACT TO TEST THIS FEATURE!
    with brownie.reverts("Too soon to claim. Wait for at least 1 month."):
        message_contract.getUnclaimedPayment( 3, 5000000000000,{'from': accounts[1]})
    with brownie.reverts("Replying to wrong address"):
        tx = message_contract.sendCipherText(bytes("replying",'utf-8'),0xffffffffffffff, False, 0xff, accounts[2], 2, 2,
                            {'from': accounts[1], "gas_price": "auto"})
    with brownie.reverts("Replying from wrong address"):
        tx = message_contract.sendCipherText(bytes("replying",'utf-8'),0xffffffffffffff, False, 0xff, accounts[0], 2, 2,
                            {'from': accounts[2], "gas_price": "auto"})
    tx = message_contract.sendCipherText(bytes("replying",'utf-8'),0xffffffffffffff, False, 0xff, accounts[0], 2, 2,
                            {'from': accounts[1], "gas_price": "auto"}) 
    print(f"replying to 2: ",tx.info()) 
    balanceBefore = accounts[1].balance()
    print("balanceBefore", balanceBefore)
    message_contract.withdraw(2000000000000, 2, {'from': accounts[1]})
    print("balanceAfter", accounts[1].balance())
   
    assert(accounts[1].balance() > (2000000000000 + balanceBefore - 500000) )
    remaining = message_contract.msgBalance( 2)
    print("remaining", remaining)
    assert remaining == 3000000000000


    for i,msg in enumerate(MESSAGES):
        print(msg)
        tx = message_contract.sendCipherText(bytes(msg,'utf-8'),0xffffffffffffff, False, 0xff, accounts[i+1], 3, 0,
                            {'from': accounts[i], "gas_price": "auto", 'value':5000000000000})
        print(f"minting transaction from {accounts[i]} to {accounts[i+1]}: ",tx.info())
        
    for i,msg in enumerate(MESSAGES):
        print(msg)
        tx = message_contract.sendCipherText(bytes(msg,'utf-8'),0xffffffffffffff, False, 0xff, accounts[i+1], 3, 0,
                            {'from': accounts[i], "gas_price": "auto"})
        print(f"minting transaction from {accounts[i]} to {accounts[i+1]}: ",tx.info())
        
    for i in range(1,5):
        print(message_contract.getMessage(i))   

    for i in range(1,12):
        print(message_contract.hasBeenReplied(i))   
    message_contract.getUnclaimedPayment(3, 5000000000000, {'from': accounts[1]})
    assert True == False