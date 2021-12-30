import { useEffect, useState } from 'react';
import { ethers } from "ethers"
import './App.css';
import contract from './contracts/NFTCollectible.json';

const contractAddress = "0x6d1fd9b86ED42e0C57664e19904C4C2c8B26DF78";
const abi = contract.abi;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const checkWalletIsConnected = async () => { 
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask intalled!");
      return;
    } else{
      console.log("Wallet exists now! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

    if (accounts.length != 0) {
      const account = accounts[0];
      console.log("Found a authorized account: ", accounts[0]);
      setCurrentAccount(account);
    } else {
      console.log("No an authorized account!");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;
    if(!ethereum) {
      alert("Pls install Metamask!");
    }
    try{
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  }

  const mintNftHandler = async () => { 
    try{
      const { ethereum } = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialized payment");
        let nftTxn = await nftContract.mintNFTs(1, { value: ethers.utils.parseEther('0.01')});
        console.log("Mining... pls wait!");
        await nftTxn.wait();
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      } else {
        console.log("Ethereum object does not exist!");
      }
    } catch(err){
      console.log(err)
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
        Mint NFT
      </button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div className='main-app'>
      <h1>NFT React App</h1>
      <div>
        {currentAccount ? mintNftButton() : connectWalletButton()}
      </div>
    </div>
  )
}

export default App;