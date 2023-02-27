import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("39a4538e7225d063c6c84ddd55a29734c0c5e7acf32176071820d032f0f94d88");
  const [signature, setSignature] = useState("");
  const [recoveryBit, setRecoveryBit] = useState("");
  const [recoverPublic, setRecoverPublic] = useState(""); 
  
  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
      />
      <Transfer 
        address={address} 
        setBalance={setBalance} 
        privateKey={privateKey}
        signature={signature}
        setSignature={setSignature}
        recoveryBit={recoveryBit}
        setRecoveryBit={setRecoveryBit}
        recoverPublic={recoverPublic}
        setRecoverPublic={setRecoverPublic}
      />
    </div>
  );
}

export default App;
