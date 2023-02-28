const secp = require("ethereum-cryptography/secp256k1");
const { toHex }=require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "d0b3af9f92a20840ec20656f5cf41ecf3ef24636": 100,
  "35fc9e803507bd5b910ceda3625b5814c3db8ec2": 50,
  "7518b940f0c3ecc546a2dcc01560f518c50e6dcc": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {

  const { sender, recipient, amount, signature, recoveryBit } = req.body; 

  /* Bug Fix 

  If you are going to use this code please reference me, Mr Bunny & my GitHUb

  When sending the signature Array from client to the server, the array is converted to 
  a json format, we must convert this to an array, and finally copy the array to a new
  Uint8Array. 
  
  If this isnt done this error message will occur:
  TypeError: Signature.fromCompact: Expected string or Uint8Array
  */

  var newArray = [];       

  for(var i in signature)
    newArray.push(signature [i]);
  
  const newSignature = new Uint8Array(newArray);

   // End Bug Fix

  msg = "Success";  

  if(checkSigned(sender, newSignature, recoveryBit, msg, res)) {

    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }

    res.status(400).send({ message: "Success!" });

  }

});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function shortenPublicKey(publicKey) {
    return toHex((publicKey.slice(1)).slice(-20));
}

function hashMessage(message) {
    const bytes = utf8ToBytes(message);
    const hash = keccak256(bytes);
    return hash;
}

async function checkSigned(sender, signature, recoveryBit, msg, res) {
  
  try {

    const publicKey = shortenPublicKey(secp.recoverPublicKey(hashMessage(msg), signature, recoveryBit));
  
    if (sender === publicKey) { 
      return true; 
    } else {
      res.status(400).send({ message: "Signature not matching, not transfering." });
    }

    return false


  } catch (error) {
    res.status(400).send({ message: error });
    console.log("Error Log :", error)
    return false
  }
}
