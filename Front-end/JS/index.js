import { ethers } from "../../ethers-5.1.esm.min.js"
// recuperer les fct de notre modules ethers.js

import { abi,contractAddress } from "./constant.js"
// recuperer l'abi et l'adresse du contrat


// associer chaque élément du html à des var 
let connectBtn = document.getElementById("connectBtn");
let storeBtn = document.getElementById("storeBtn");
let watchBtn = document.getElementById("watchBtn");
let addUserBtn = document.getElementById("addUserBtn");
let storeInp = document.getElementById("storeInp");
let takeBtn = document.getElementById("takeBtn");
let takeInp = document.getElementById("takeInp");

// éxécuter une fct qd ces éléments sont cliqués

connectBtn.onclick = connectToMetaMask;
storeBtn.onclick = store;
watchBtn.onclick = watch;
takeBtn.onclick = take;
addUserBtn.onclick = addUser;
// fct qui permet de se connecter à metamask
async function connectToMetaMask(){
    // vérifie si metamask est installé
    if (typeof window.ethereum !== "undefined") {
        // demande de se connecter si déjà installé
        window.ethereum.request({method: "eth_requestAccounts"});
        connectBtn.innerHTML = "Connected";
    }else {
        connectBtn.innerHTML = "Please install MetaMask";
    }
}

async function store(){
    console.log("entering store function !")
    // créer une var amount qui contindra la valeur mit dans l'input html
    const amount = storeInp.value;
    console.log(`Adding ${amount} money in my wallet...`);
    // vérifie si metamask est installé
    if (typeof window.ethereum !== "undefined") {
        // connection à notre smart contract
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try{ 
            // execute la fct store de notre smart contract
            
            let transactionResponse = await contract.store(amount);
            await listenForTransactionMine(transactionResponse, provider);
            console.log("Done !")
        }        
        catch(error){
            console.log(error);
        } 
    }
}

async function take(){
    // créer une var amount qui contindra la valeur mit dans l'input html
    const amount = takeInp.value;
    console.log(`Taking ${amount} money in my wallet...`);
    if (typeof window.ethereum !== "undefined") {
        // vérifie si metamask est installé
        // connection à notre smart contract
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try{ 
            // execute la fct take de notre smart contract
            let transactionResponse = await contract.take(amount);
            await listenForTransactionMine(transactionResponse, provider);
            console.log("Done !")
        }        
        catch(error){
            console.log(error);
        } 
    }
}

async function watch(){
   console.log("Watching how many money there is in my wallet...");
   // vérifie si metamask est installé
   if (typeof window.ethereum !== "undefined") {
    // connection à notre smart contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
        // execute la fct watch de notre smart contract
       let currentWallet = await contract.watch();
       console.log(`Current money in my wallet: ${currentWallet}`);
       const watchOutput = document.createElement('div'); 
       watchOutput.textContent = currentWallet
       output.appendChild(watchOutput);
    }
    catch(error){
        console.log(error);
    } 
}
}

//ADD USER

async function addUser(){
    console.log("adding user...");
    // vérifie si metamask est installé
    if (typeof window.ethereum !== "undefined") {
        // connection à notre smart contract
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            // execute la fct watch de notre smart contract
            await contract.addUser();
            console.log(`You have been added to the user list !`);
        }
        catch(error){
            console.log(" !! user cannot be added !!");
        } 
    }
}

//ADD USER end

// attends que les blocs soit bien minés pour executer les fct
function listenForTransactionMine(transactionResponse, provider){
    console.log(`Mining ${transactionResponse.hash}...`);
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(`Completed width ${transactionReceipt.confirmations} confirmations`);
        resolve();
    });
    })

}