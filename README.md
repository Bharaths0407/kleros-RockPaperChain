# RockPaperChain
A decentralized Rock–Paper–Scissors game built on Ethereum Sepolia Testnet where players can stake ETH, challenge each other, and let the smart contract decide the winner.

##  Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React.js, Vite |
| Wallet Connection | MetaMask, Ethers.js |
| Network | Ethereum Sepolia Testnet |

---

## 🛠️ Installation

Follow these steps to clone, install, and run the project locally:

 1. Clone the repository
    ```bash
    git clone https://github.com/Bharaths0407/kleros-RockPaperChain.git
    ```
---

  2. Navigate into the project
      ```bash
      cd kleros-RockPaperChain
      ```
---

  3. Install dependencies
      ```bash
      npm install
      ```
---
  4. Start the development server
      ```bash
      npm run dev
      ```
---

##  Usage Guide

### 1. Connect your wallet
- Open the app and connect your **MetaMask** wallet  
- Ensure you’re on the **Sepolia Testnet**

### 2. Start a new game
- Choose your move (**Rock**, **Paper**,  **Scissors**, **Spock**, or **Lizard**)  
- Enter a **stake amount** (in SepoliaETH)  
- Your move is hashed and stored with a **salt** (Remember to Copy the Salt)

### 3. Share the game link
- Send the generated game link to your opponent

### 4. Opponent joins
- The opponent selects their move and matches the stake

### 5. Reveal phase
- Player 1 reveals their move and salt  
- The smart contract validates the move and determines the winner

### 6. Automatic payout
- The winner automatically receives the total pot in their wallet 
