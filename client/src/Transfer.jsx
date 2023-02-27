import { useState } from "react";
import server from "./server";

import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { utf8ToBytes } from 'ethereum-cryptography/utils';

// 39a4538e7225d063c6c84ddd55a29734c0c5e7acf32176071820d032f0f94d88

function shortenPublicKey(publicKey) {
    return toHex((publicKey.slice(1)).slice(-20));
}

function hashMessage(message) {
    const bytes = utf8ToBytes(message);
    const hash = keccak256(bytes);
    return hash;
}

function Transfer({ address, setBalance, privateKey, signature, 
                    setSignature, recoveryBit, setRecoveryBit,
                    recoverPublic, setRecoverPublic}) {


  const [sendAmount, setSendAmount] = useState("10");
  const [recipient, setRecipient] = useState("35fc9e803507bd5b910ceda3625b5814c3db8ec2");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  
  if (privateKey) {

    (async () => {

      const hash = hashMessage('Success');
      const [signature, recoveryBit] =  await secp.sign(hash, privateKey,{recovered: true});
      
      setSignature(signature);
      setRecoveryBit(recoveryBit);
      
      const recoverPublic = shortenPublicKey(secp.recoverPublicKey(hashMessage('Success'), signature, recoveryBit));
      
      setRecoverPublic(recoverPublic);
    
    })();

  
  }
  
  async function transfer(evt) {
    evt.preventDefault();

    try {
      const { data: { balance },
      } = await server.post(`send`, 
      {
        sender: recoverPublic,
        recipient,
        amount: parseInt(sendAmount),
        signature: signature,
        recoveryBit: parseInt(recoveryBit)
      });

      setBalance(balance);
    
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="Amount to Send"
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Enter Recipient Address"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

        <div> Signed: {signature} </div>

       <div> Recovery Bit: {recoveryBit} </div>
       
       <div> Public Key: {recoverPublic} </div>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
