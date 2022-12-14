import React from "react"; 
import ReactDOM from "react-dom/client"; 
import "./index.css"; 
import App from "./App"; 
import reportWebVitals from "./reportWebVitals"; 
import "@rainbow-me/rainbowkit/styles.css"; 
import "@rainbow-me/rainbowkit/styles.css"; 
  
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"; 
import { chain, configureChains, createClient, WagmiConfig } from "wagmi"; 
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"; 
  
const { chains, provider } = configureChains( 
  [chain.polygonMumbai], 
  [ 
    jsonRpcProvider({ 
      rpc: (chain) => ({ 
        http: "https://nd-930-288-914.p2pify.com/60a13ee4daa23a0b0f777c70f99bfbc8", 
      }), 
    }), 
  ] 
); 
  
const { connectors } = getDefaultWallets({ 
  appName: "My Lens App", 
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
      <RainbowKitProvider chains={chains}> 
        <App /> 
      </RainbowKitProvider> 
    </WagmiConfig> 
  </React.StrictMode> 
); 
  
reportWebVitals(); 