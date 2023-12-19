export const contractAddress = "0x346ac0723FF7339a18a665ab984E72f57668278A"


export const abi = 
[
    { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
    
    {
      "inputs": [
        { "internalType": "uint256", "name": "_money", "type": "uint256" }
      ],
      "name": "store",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "takenMoney", "type": "uint256" }
      ],
      "name": "take",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "watch",
      "outputs": [
        { "internalType": "uint256", "name": "_money", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "addUser",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  }
  ]
  