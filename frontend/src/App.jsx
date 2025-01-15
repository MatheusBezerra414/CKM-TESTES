import axios from "axios";
import React, { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:3001/wallets";

function App() {
  const [wallets, setWallets] = useState([]); // Inicializado como array vazio
  const [userId, setUserId] = useState("");
  const [decryptedKey, setDecryptKey] = useState("");

  // Fetch all wallets
  const fetchWallets = async () => {
    try {
      console.log("tentando wallets");
      const response = await axios.get(API_URL);
      console.log("Wallets:", response.data);
      setWallets(response.data || []); // Garante que o estado seja sempre um array
    } catch (error) {
      console.error("Error fetching wallets:", error);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  // Create a new wallet
  const createWallet = async () => {
    try {
      const response = await axios.post(API_URL, { userId });
      alert("Wallet created successfully!");
      setUserId("");
      fetchWallets();
      console.log("Wallet created:", response.data);
    } catch (error) {
      alert("Error creating wallet: " + (error.response?.data?.error || error.message));
      console.error("Error creating wallet:", error);
    }
  };

  // Delete a wallet
  const deleteWallet = async (userId) => {
    try {
      await axios.delete(`${API_URL}/${userId}`);
      alert("Wallet deleted successfully!");
      fetchWallets();
    } catch (error) {
      alert("Error deleting wallet: " + (error.response?.data?.error || error.message));
      console.error("Error deleting wallet:", error);
    }
  };

  const decryptKey = async (userId)=>{
    try {
      const decryptedKey = await axios.post(`${API_URL}/decrypt/${userId}`);
      alert("Private Key decrypt successfully!");
      setDecryptKey(decryptedKey.data.decryptKey)
    } catch (error) {
      alert("Error decrypting Key wallet: " + (error.response?.data?.error || error.message));
      console.error("Error decrypting Key wallet:", error);
    }
  }

  // Render wallets as a proper JSX fragment
  const RenderWallets = () => {
    if (!wallets || wallets.length === 0) {
      return <p>No wallets available</p>;
    }
  
    return (
      <>
        {wallets.map((wallet) => (
          <li key={wallet.userId}>
            <div>
              <strong>User ID:</strong> {wallet.userId}
            </div>
            <div>
              <strong>Wallet Address:</strong> {wallet.walletAddress}
            </div>
            <div>
              <div style={{display: "flex", width: "100%",  justifyContent: "space-between"}}>
              <strong>Private Key:</strong>{" "}
              </div>
              {typeof wallet.privateKey === "object"
                ? JSON.stringify(wallet.privateKey)
                : wallet.privateKey || "N/A"}
            
            <p 
            onClick={()=> {decryptKey(wallet.userId)}} 
            style={{cursor: "pointer", backgroundColor: "#123", borderRadius: 12, padding: 10, color: "white"}}
            >
              {typeof decryptedKey === "object" ? 
              JSON.stringify(decryptedKey)
              : decryptedKey || "Clique aqui para descriptografar"}
              </p>
            </div>
            <div>
              <strong>Mnemonic:</strong>{" "}
              {typeof wallet.mnemonic === "object"
                ? JSON.stringify(wallet.mnemonic)
                : wallet.mnemonic || "N/A"}
            </div>
            <button onClick={() => deleteWallet(wallet.userId)} className="delete-btn">
              Delete
            </button>
          </li>
        ))}
      </>
    );
  };

  return (
    <div className="App">
      <h1>Blockchain Wallet Manager</h1>
      <div>
        <h2>Create Wallet</h2>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={createWallet}>Create</button>
      </div>
      <div>
        <h2>Wallets</h2>
        <ul>
          <RenderWallets />
        </ul>
      </div>
    </div>
  );
}

export default App;