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

    tx = message_contract.mint(bytes(MESSAGES[0],'utf-8'),0xffffffffffffff, accounts[1],
                            {'from': accounts[0], "gas_price": "auto", 'value':5000000000000})
    print(f"minting transaction from {accounts[0]} to {accounts[1]}: ",tx.info())


    for i,msg in enumerate(MESSAGES):
        print(msg)
        tx = message_contract.mint(bytes(msg,'utf-8'),0xffffffffffffff, accounts[i+1],
                            {'from': accounts[i], "gas_price": "auto", 'value':5000000000000})
        print(f"minting transaction from {accounts[i]} to {accounts[i+1]}: ",tx.info())

    for i,msg in enumerate(MESSAGES):
        print(msg)
        tx = message_contract.mint(bytes(msg,'utf-8'),0xffffffffffffff, accounts[i+1],
                            {'from': accounts[i], "gas_price": "auto", 'value':5000000000000})
        print(f"minting transaction from {accounts[i]} to {accounts[i+1]}: ",tx.info())
        
    for i,msg in enumerate(MESSAGES):
        print(msg)
        tx = message_contract.mint(bytes(msg,'utf-8'),0xffffffffffffff, accounts[i+1],
                            {'from': accounts[i], "gas_price": "auto"})
        print(f"minting transaction from {accounts[i]} to {accounts[i+1]}: ",tx.info())
        
        
    for i in range(1,5):
        print(message_contract.getMessage(i))   
    assert True == False