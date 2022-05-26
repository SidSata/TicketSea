import React, {useEffect, useState} from 'react';
import {ethers, BigNumber} from 'ethers';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import CoinABI from './ABI/CoinABI.json';
import Home from './views/Home';
import Profile from './views/Profile';
import Mint from './views/Mint';
import Header from './layout/Header';
import Dashboard from './views/Dashboard';
import Resell from './views/Resell';


function App() {
  const [account, setAccount] = useState('');
  const deployContract = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  const connectWallet = async() => {
    if (window.ethereum) {
      // Check whether metamask is installed
      let accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      setAccount(accounts[0]);
    }
  }

  const handleMint = async() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const provider = new ethers.providers.JsonRpcProvider("https://ropsten.infura.io/v3/");
      const signer = provider.getSigner();
      const contract = new ethers.Contract(deployContract, CoinABI.abi, signer);

      try {
        const response = await contract.mint(account, BigNumber.from(100));
        console.log(response);
      } catch (err) {
        console.log("Error", err);
      }
    }
  }

  return (
    <div>
      <Router>
        <Header/>
        <Switch>
        <Route exact path = {"/"}>
            <Home/>
          </Route>
          <Route path = {"/home"}>
            <Home/>
          </Route>
          <Route path = {"/profile"}>
            <Profile/>
          </Route>
          <Route path = {"/dashboard"}>
            <Dashboard/>
          </Route>
          <Route path = {"/resell"}>
            <Resell/>
          </Route>
          <Route path = {"/mint"}>
            <Mint/>
          </Route>
          </Switch>
      </Router>
    </div>
  );
}

export default App;
