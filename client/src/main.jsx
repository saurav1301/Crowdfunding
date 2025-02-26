import { Buffer } from "buffer"; // Import Buffer polyfill
if (!window.Buffer) window.Buffer = Buffer;

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ThirdwebProvider } from "@thirdweb-dev/react";

import { StateContextProvider } from "./context";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <ThirdwebProvider 
  activeChain={{
    chainId: 11155111, // Sepolia
    rpc: ["https://eth-mainnet.g.alchemy.com/v2/BpGdymLdaeKA6mmbZlcuUlAujD4KW0Ll"], // Replace with your Infura/Alchemy URL
  }}
>
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider>
);
