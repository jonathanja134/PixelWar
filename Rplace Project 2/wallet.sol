//SPDX-License-Identifier: MIT
pragma solidity 0.8.7; // Version du compilateur solidity utilisé

// On définit notre smart contract
contract wallet {
    // ----------------------------------- VARIABLES ----------------------------------- //
    // On définit la structure "User" qui stockera les fonds associés à chaque adresse
    struct User {
        address userAddress;
        uint256 money;
    }

    // Tableau d'utilisateurs
    User[] private usersArray;

    // On définit la variable pixelArray qui est un array de 40 par 40
    uint256 constant length = 40;
    uint256[length][length] private pixelArray;

    // Bool qui sert de levier pour s'assurer que la fonction "initializeArray" ne sera activée qu'une fois
    bool private initialized;

    // On map chaque adresse propriétaire à une bool
    mapping(address => bool) private isOwner;
    // On map chaque adresse user à une bool
    mapping(address => bool) private isUser;
    // On map chaque adresse user à une variable "argent"
    mapping(address => uint256) private addressToMoney;

    // Déclaration de l'événement
    event LogMessage(string message);

    // ---------------------------------- CONSTRUCTOR ---------------------------------- //

    // Constructeur du contrat, appelé une seule fois lors du déploiement
    constructor(){
        isOwner[msg.sender] = true; // Ajoute le déployeur comme propriétaire initial
        initialized = false;      // Initialise à false par défaut
    }

    // ----------------------------------- MODIFIERS ----------------------------------- //

    // Modifier utilisé pour voir si la personne appelant la fonction est bien uns des propriétaires du contrat
    modifier OnlyOwner() {
        require(isOwner[msg.sender], "Error: Not an owner");
        _;
    }
    modifier OnlyUser(){
        require(isUser[msg.sender], "Error: Not a user");
        _;
    }

    // ----------------------------------- FUNCTIONS ----------------------------------- //

    // Fonction pour ajouter une adresse à la liste des propriétaires
    function addOwner(address newOwner) public OnlyOwner {
        require(!isOwner[newOwner], "Error: Address is already an owner");
        isOwner[newOwner] = true;
    }

    // Fonction pour ajouter une adresse à la liste des propriétaires
    function addUser() public {
        require(!isUser[msg.sender], "Error: Address is already a user");
        isUser[msg.sender] = true;
        addressToMoney[msg.sender] = 10;
    }

    // Fonction pour initialiser le tableau avec la couleur blanche
    function initializeArray(uint256 value) public OnlyOwner{
        for (uint i = 0; i < length; i++) {
            for (uint j = 0; j < length; j++) {
                pixelArray[i][j] = value;
            }
        }
    }

    // Fonction pour changer la valeur d'une case du tableau à l'index x ; y
    function setValuePixel(uint256 row, uint256 col, uint256 value) public OnlyUser {
        require(row < length, "Row index out of bounds"); // On exige que la valeur de la ligne du pixel auquel on attribut un code couleur est bien dans le tableau
        require(col < length, "Column index out of bounds"); // On exige que la valeur de la colonne du pixel auquel on attribut un code couleur est bien dans le tableau
        take(1);
        pixelArray[row][col] = value;
    }

    // Fonction pour voir la valeur d'une case du tableau à l'index x ; y
    function getValuePixel(uint row, uint col) public view returns (uint256) {
        require(row < length, "Row index out of bounds");
        require(col < length, "Column index out of bounds");
        uint256 temp = pixelArray[row][col];
        return temp;
    }

    // Fonction pour ajouter au solde associé à l'adresse de l'appelant
    function store(uint256 _money) public OnlyUser{
        addressToMoney[msg.sender] += _money;
    }

    // Fonction pour voir et modifier le solde associé à l'adresse de l'appelant
    function watch() view public OnlyUser returns (uint256){
        return addressToMoney[msg.sender];
    }

    // Fonction pour soustraire au solde associé à l'adresse de l'appelant
    function take(uint256 _money) public OnlyUser{
        require(
            _money <= addressToMoney[msg.sender],
            "Error: Insufficient funds"            
        );
        addressToMoney[msg.sender] -= _money;
    }
}