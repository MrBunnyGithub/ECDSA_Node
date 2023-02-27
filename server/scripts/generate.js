// #  npm install ethereum-cryptography

const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

function getAddress(publicKey) {
    // the first byte indicates whether this is in compressed form or not
    return (publicKey.slice(1)).slice(-20);
}

const privateKey = secp.utils.randomPrivateKey();

console.log('Private Key:', toHex(privateKey));

const longPublicKey = secp.getPublicKey(privateKey);
const publicKey = getAddress(longPublicKey);

//console.log('Long Public Key:', toHex(longPublicKey));
console.log('Public Key:', toHex(publicKey));

/*
Key 1 
Private
39a4538e7225d063c6c84ddd55a29734c0c5e7acf32176071820d032f0f94d88
Public
d0b3af9f92a20840ec20656f5cf41ecf3ef24636

Key 2
Private
a8066199474d9cd6bf5f06e38f61aa179f218c6e2ea5bd3ba1c75097bb327f60
Public
35fc9e803507bd5b910ceda3625b5814c3db8ec2

Key 3
Private
67b8d7a4f556c705579dad0a880682c2ca6e0208077cdb54a8c17b5a9b12a7df
Public
7518b940f0c3ecc546a2dcc01560f518c50e6dcc






