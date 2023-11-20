export const contractAddress = "0xf7f7A5e0CfbD2D1215e8448F72badef105dd9f9e"


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
    }
  ]
  