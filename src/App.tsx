import { WagmiProvider } from 'wagmi';
import { BrowserRouter } from 'react-router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Home } from '@/components/home';
import { WalletConfig } from '@/modules/wallet/config/walletConfig';
import './App.css'

function App() {

      const query = new QueryClient();


  return (
    <>
    <WagmiProvider config={WalletConfig}>
      <QueryClientProvider client={query}>
        <BrowserRouter>
          <Home/>
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
    </>
  )
}

export default App
