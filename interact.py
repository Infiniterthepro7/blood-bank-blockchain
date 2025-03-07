import json
from web3 import Web3
from eth_utils import to_checksum_address

# Connect to blockchain
infura_url = "http://127.0.0.1:8545"  # Change if using a different RPC URL
w3 = Web3(Web3.HTTPProvider(infura_url))
if w3.is_connected():
    print("✅ Connected to blockchain")
else:
    print("❌ Connection failed")
    exit()

# ABI from your provided JSON
abi = [
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "donorAddress",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "string",
                "name": "bloodType",
                "type": "string"
            }
        ],
        "name": "BloodDonated",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "donorAddress",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": False,
                "internalType": "string",
                "name": "bloodType",
                "type": "string"
            }
        ],
        "name": "DonorRegistered",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "donateBlood",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "donorList",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "donors",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "age",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "bloodType",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "location",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "isAvailable",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllDonors",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_donor",
                "type": "address"
            }
        ],
        "name": "getDonorDetails",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_age",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_bloodType",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_location",
                "type": "string"
            }
        ],
        "name": "registerDonor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

# Contract address (Replace with your deployed contract address)
contract_address = "0x5FC8d32690cc91D4c39d9d3abcBD16989f875707"  # Update with your real address
contract_address = to_checksum_address(contract_address)  # Ensure correct checksum

contract = w3.eth.contract(address=contract_address, abi=abi)

print("✅ Contract instance created")

# Function to register a donor
def register_donor(name, age, blood_type, location, sender_address, private_key):
    sender_address = to_checksum_address(sender_address)  # Ensure correct checksum
    tx = contract.functions.registerDonor(name, age, blood_type, location).build_transaction({
        "from": sender_address,
        "gas": 1000000,
        "gasPrice": w3.to_wei("20", "gwei"),
        "nonce": w3.eth.get_transaction_count(sender_address),
    })
    signed_tx = w3.eth.account.sign_transaction(tx, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    print("⏳ Transaction sent, waiting for confirmation...")
    w3.eth.wait_for_transaction_receipt(tx_hash)
    print("✅ Donor registered! TX Hash:", tx_hash.hex())

# Function to get donor details
def get_donor_details(donor_address):
    donor_address = to_checksum_address(donor_address)  # Ensure correct checksum
    donor = contract.functions.getDonorDetails(donor_address).call()
    print("🔹 Donor Details:")
    print("   Name:", donor[0])
    print("   Age:", donor[1])
    print("   Blood Type:", donor[2])
    print("   Location:", donor[3])
    print("   Availability:", "Available" if donor[4] else "Not Available")

# Example Usage (Uncomment and replace details to use)
# sender_address = "0xYourWalletAddress"
# private_key = "YourPrivateKey"
# register_donor("John Doe", 30, "O+", "New York", sender_address, private_key)

# get_donor_details("0xYourWalletAddress")
