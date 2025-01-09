import axios from "axios";
import React, { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:3001/wallets";

function App() {
  const [wallets, setWallets] = useState([]);
  const [userId, setUserId] = useState("");
  // Fetch all wallets
  const fetchWallets = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log("Wallets:", response.data);
      setWallets(response.data);
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
      await axios.post(API_URL, { userId });
      setUserId("");
      fetchWallets();
    } catch (error) {
      console.error("Error creating wallet:", error);
    }
  };

  // Delete a wallet
  const deleteWallet = async (userId) => {
    try {
      await axios.delete(`${API_URL}/${userId}`);
      fetchWallets();
    } catch (error) {
      console.error("Error deleting wallet:", error);
    }
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
          {wallets.map((wallet) => (
            <li key={wallet.userId}>
              <strong>{wallet.userId}</strong> - {wallet.walletPublicKey}{" "}
              <button onClick={() => deleteWallet(wallet.userId)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;