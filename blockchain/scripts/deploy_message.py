from brownie import SenderMessage, accounts, network

def main():
    acct = accounts.load('dev_account')
    print(acct)
    
    contract = SenderMessage.deploy(
         {'from': acct, "gas_price": "auto"}, publish_source=False)

# brownie run deploy_message.py --network polygon-test

# In Console Verification:
# network.is_connected() 
# token = MetaboardsGen2.at(<ADDRESS>)
# MetaboardsGen2.publish_source(token)