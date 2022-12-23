import { useState } from 'react';
import './App.css';
import BuyMeCoffee from './components/BuyCoffee';
//import Coffee from './components/Coffee';
import NavBar from './components/NavBar';

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  return (
    <div className="overlay">
      <div className='App'>
        <NavBar accounts={currentAccount} setAccounts={setCurrentAccount} />
        <BuyMeCoffee accounts={currentAccount} setAccounts={setCurrentAccount} />
      </div>
      <div className='moving-background'></div>
    </div>
  );
}

export default App;
