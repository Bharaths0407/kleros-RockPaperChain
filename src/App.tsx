import { Toaster } from 'sonner';
import { WagmiProvider } from 'wagmi';
import { BrowserRouter, Route, Routes } from 'react-router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Home } from '@/components/home';
import { WalletConfig } from '@/modules/wallet/config/walletConfig';
import './App.css'
import FirstPlayer from './modules/players/components/firstPlayer';
import SecondPlayer from './modules/players/components/secondPlayer';

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
            <Route path="/secondPlayer" element={<SecondPlayer />}/>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
    </>
  )
}

export default App
