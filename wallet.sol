// SPDX-License-Identifier: MIT
pragma solidity 0.8.7; //version du compilateur solidity utilisé

// on définit notre smart contract
contract wallet {
    // on définit la variable money représentant l'argent fictif contenu dans notre wallet
    uint256 private money; //private signifie seulement accésible depuis l'intérieur du smart contract
    // on définit la variable owner représentant à qui le wallet appartient
    address private owner;

    constructor() {
        //le constructor est une fct appelé seulement une seule fois à la création du smart contract
        owner = msg.sender; //on attribut l'address qui déploie le smart contract dans la blockchain qui "créer" le smart contract à la variable owner
    }

    modifier onlyOwner() {
        // un modifier est un morceau de code qui sera réalisé avant le code des fct à lesquelles il est lié
        require(msg.sender == owner, "Error it is not your wallet"); // verifie si l'address "la personne" qui éxecute la fct est bien la même que celle contenu dans owner
        _; //aprés le _ code de la fct lié au modifier peut-être éxécuté
    }

    // fct store prend en paramètre d'entrée un unint256 qui va être stocké dans la var _money (!!! différent de la var money)
    function store(uint256 _money) public onlyOwner {
        // public signifie accéssible depuis l'extérieur du contrat, onlyOwner signifie lié au modifier onlyOwner
        money += _money; //ajoute la valeur de _money à money
    }

    // idem que pour store mais retire la val de takenMoney à money, mais vérifie si la val de takenMoney n'est pas supérieur à celle de money
    function take(uint256 takenMoney) public onlyOwner {
        require(
            takenMoney <= money,
            "Error you don't have enough money in your wallet"
        );
        money = money - takenMoney;
    }

    // fct qui retourne la valeur _money qui contiendra la val de money
    // view signifie que la fct ne modifie aucune valeur dans la blockchain car on regarde juste la valeur de money
    // le but de la fct est de permettre que seul le owner puisse voir la contenu de variable monay grâce au modifier
    // nécessaire car la variable money n'est pas accesible depuis l'intérieur du contrat
    function watch() public view onlyOwner returns (uint256 _money) {
        _money = money;
    }
    

}
