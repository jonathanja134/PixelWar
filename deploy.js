const ethers = require("ethers")
// import ethers

const fs = require("fs-extra")
// import fs-extra

async function main(){
    // async fct n'éxécute pas les lignes de code simultanément on attends que la ligne précédente est finis pour éxécuter
    let provider = new ethers.JsonRpcProvider("HTTP://127.0.0.1:7545") // créer une variable provider contenant le RPC de notre blockchain
    let wallet = new ethers.Wallet("0x9b45b19fedfce5da0bcf6d57a50a35b7b2ff6459888173c2af9aeb8ac47e2d0c", provider) // var creer pour représenter 
    // le wallet qui va payer les frais de gaz nécéssaire avec la clé privé utilisé et la var créer précédement
    const abi = fs.readFileSync("./wallet_sol_wallet.abi", "utf8") // associe l'abi de notre smart contract obtenu en le compilant 
    // dans la var constante abi
    const binary = fs.readFileSync("./wallet_sol_wallet.bin","utf8")// idem pour file.bin
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet) 
    console.log("Deploying, please wait...")
    const contract = await contractFactory.deploy() // deploit le contrat dans la blockchain
    await contract.deploymentTransaction().wait(1); //attends que le bloc contenant le contract soit miné
    console.log(`Contract deployed to ${await contract.getAddress()}`) // affiche l'address à laquelle notre smart contract a été dans 
    //la blockchain (nécéssaire pour la suite) !!! si vous redployer le contract elle changera car ce dernier sera considerer comme un autre smart contract associer à une autre address
    // cependant si vous ne fermer pas ganache (car à la réouverture créer une nouvelle blockchain vierge) l'ancien contract sera toujoursassocier à l'address précédente

}

main()
// executer la fct main