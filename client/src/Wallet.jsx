import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { utf8ToBytes } from 'ethereum-cryptography/utils';

function getPublicKey(privateKey) {
  return secp.getPublicKey(privateKey);
}

function shortenPublicKey(publicKey) {
    return toHex((publicKey.slice(1)).slice(-20));
}

function Wallet({ address, setAddress, balance, setBalance, 
                privateKey, setPrivateKey}) {
  
  async function onChange(evt) {
    
    const privateKey = evt.target.value;
    const address = shortenPublicKey(getPublicKey(privateKey));

    console.log(privateKey);
    console.log(address);
    
    setPrivateKey(privateKey);
    setAddress(address);


    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Private Key</h1>

      <label>
        Private Key
        <input placeholder="Type Private Key" value={privateKey} onChange={onChange}></input>
      </label>

      <div> Public Address: {address} </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
