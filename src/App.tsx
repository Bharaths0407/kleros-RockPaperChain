import { Toaster } from 'sonner';
import { WagmiProvider } from 'wagmi';
import { BrowserRouter, Route, Routes } from 'react-router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Home } from '@/components/home';
import { WalletConfig } from '@/modules/wallet/config/walletConfig';
import './App.css'
import FirstPlayer from './modules/players/components/firstPlayer';

function App() {

      const query = new QueryClient();


  return (
    <>
    <WagmiProvider config={WalletConfig}>
      <QueryClientProvider client={query}>
        <BrowserRouter>
          <Home/>
          <Routes>
            <Route path="/" element={<FirstPlayer />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
    </>
  )
}

export default App
