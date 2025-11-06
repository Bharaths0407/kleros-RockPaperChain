import { sepolia } from "wagmi/chains";
import { http, createConfig } from "wagmi";
import { metaMask } from "wagmi/connectors";

export const WalletConfig = createConfig({
  chains: [sepolia],
  connectors: [metaMask()],
  transports: {
    [sepolia.id]: http(),
  },
});
