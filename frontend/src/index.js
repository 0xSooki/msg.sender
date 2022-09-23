import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "@rainbow-me/rainbowkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  chain,
  configureChains,
  defaultChains,
  createClient,
  WagmiConfig,
} from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
//import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [...defaultChains, chain.polygonMumbai, chain.polygon],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: "https://nd-930-288-914.p2pify.com/60a13ee4daa23a0b0f777c70f99bfbc8",
      }),
    }),
    // publicProvider()
  ]
);
console.log(provider);
const { connectors } = getDefaultWallets({
  appName: "msg.sender",
  chains,
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      {" "}
      <RainbowKitProvider chains={chains}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
