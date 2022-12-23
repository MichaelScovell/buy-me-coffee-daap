// Buy Coffee Component

// Importing the required libs
import { useState, useEffect } from "react";
import { ethers, BigNumber, Contract } from "ethers";
import { Box, Button, Flex, Input, Text, Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react';
import buyMeCoffee from '../utils/BuyMeACoffee.json';


// Importing the  contract address
const CoffeeContractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const abi = buyMeCoffee.abi;

const BuyCoffee = () => {
    // Define state variables
    const [currentAccount, setCurrentAccount] = useState("");
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [memos, setMemos] = useState([]);
    
    // Define a function for checking if the user's wallet is connected
    const isWalletConnected = async () => {

        // Define try catch loop to check if the account has been connected
        try {
            const { ethereum } = window;
            const accounts = await ethereum.request({method: 'eth_accounts'})
            // Optional console log to check that the above worked as intended
            console.log('accounts:', + accounts);

            // Define conditional check to check that the account length is greater than zero
            if (accounts.length > 0) {
                //
                const account = accounts[0];
                // Optional console log to check that the account has been connected successfully
                console.log('Wallet has been connected', + account);
            }
            else {
                // Optional log to indicate the that wallet needs to be connected
                console.log('Make sure that the wallet has been connected')
            }
        }
        // Define catch block for handling errors
        catch (error) {
            // Log errors the the console
            console.log('error', error);
        }
    }

    // Define function for connecting the wallet
    const connectWallet = async () => {
        // Define try block for connecting the wallet
        try {
            // Define variable for ethereum window
            const  {ethereum} = window;

            // Define conditional statement to check the wallet
            if (!ethereum) {
                // Log message to console
                console.log('Install Metamask');
            }

            // Define connection logic
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts'
            });

            // Connect wallet
            setCurrentAccount(accounts[0]);
        }
        // Define catch block to handle errors associated with connecting the wallet
        catch (error) {
            // Log error message to console
            console.log('error', error);
        }
    }

    // Define a function for purchasing coffee from the smart contract
    const buyMeCoffee =  async () => {
        // Define a try block for purchasing coffee
        try {
            const {ethereum} = window;

            // Define conditional statement for purchasing coffee
            if (ethereum) {
                // Define variables for the ethereum provider and the contract signer
                const provider = new ethers.providers.Web3Provider(ethereum, "any");
                const signer = provider.getSigner();

                // Define variable for the contract
                const coffeeContract = new ethers.Contract(
                    CoffeeContractAddress,
                    abi,
                    signer
                  );                

                // Define logic for interacting with the contract to process the transaction 
                // Optional log for checking that the coffee order is in the midst of being processed
                console.log('Purchasing coffee ... ');

                const coffeeTxn = await coffeeContract.buyCoffee(
                    // Define the contents of the transaction
                    name ? name : 'axon',
                    message ? message : 'Enjoy your coffee',
                    // Value of the transaction
                    {value: ethers.utils.parseEther("0.001")}
                );

                // Await the transaction code
                await coffeeTxn.wait();

                // Log message
                console.log('coffee purchased');
            }
        }
        // Define catch block for handling errors associated with purchasing coffee
        catch (error) {
            // Log error to console
            console.log('error', error);
        }
    }

    // Define a function for fetching all the memos (orders)
    const getMemos = async () => {
        // Define a try block for retrieving the memos
        try {
            //
            const {ethereum} =  window;
            // Define a conditional statement for retrieving the memos 
            if (ethereum) {
                // Define variables for the ethereum provider and the contract signer
                const provider = new ethers.providers.Web3Provider(ethereum, "any");
                const signer = provider.getSigner();

                // Define variable for the contract
                const coffeeContract = new ethers.Contract(
                    CoffeeContractAddress,
                    abi,
                    signer
                  );
    
                // Optional log for fetching memos
                console.log('Fetching Memos...');

                // Define logic for retrieving the memos
                const memos  = await coffeeContract.getMemos();
                // Log message of retrieval of the memos
                console.log('Fetched');
                // Set the memos
                setMemos(memos);
            }
            else {
                // Log a message 
                console.log('Wallet not connected');
            }
        }
        // Define a catch block to handle errors associated with fetching memos
        catch (error) {
            // Log message
            console.log('error', error);
        }
    };

    // Use Effect Statement
    useEffect(() => {
        // Define functions that will be run on first render
        let coffeeContract;
        isWalletConnected();
        getMemos();

        // Define a function for outputting memos
        const onMemoFetched = (from, timestamp, name, message) => {
            // Log message
            console.log('Memo Received', from, timestamp, name, message);
            setMemos((prevState) => [
                ...prevState,
                {
                    // Memo contents
                    address: from,
                    timestamp: new Date(timestamp * 1000),
                    message,
                    name
                }
            ]);
        }

        // Define connection window
        const {ethereum} = window;

        // Define a listener for the new memo events
        if (ethereum) {
            // Define variables for the ethereum provider and the contract signer
            const provider = new ethers.providers.Web3Provider(ethereum, "any");
            const signer = provider.getSigner();

            // Define variable for the contract
            const coffeeContract = new ethers.Contract(
                CoffeeContractAddress,
                abi,
                signer
            );

            // Listen to the memo fetched function
            coffeeContract.on("NewMemo", onMemoFetched);
        }

        // Return memos
        return () => {
            if (coffeeContract) {
                coffeeContract.off("NewMemo", onMemoFetched);
            }
        }
    }, []);

    return (
        <div>
            <h1>Coffee Cart</h1>
            {/* Connections - show tag when connected and button when not */}
            {currentAccount ? (
            <div>
                <form>
                <div className="formgroup">
                    <label>
                    Name
                    </label>
                    <br/>
                    
                    <input
                    id="name"
                    type="text"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <br/>
                <div className="formgroup">
                    <label>Send a message</label>
                    <br/>
                    <textarea
                    rows={3}
                    placeholder="Enjoy your coffee!"
                    id="message"
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    >
                    </textarea>
                </div>
                <div>
                    <button
                    type="button"
                    onClick={buyMeCoffee}
                    >
                    Send 1 Coffee for 0.001ETH
                    </button>
                </div>
                </form>
            </div>            
                ): (
                    <Button 
                    backgroundColor="#bf8040"
                    borderRadius="5px"
                    boxShadow="0px 2px 1px #0F0F0F"
                    color="white"
                    cursor="pointer"
                    fontFamily="inherit"
                    padding="15px"
                    margin="0 15px"
                    onClick={connectWallet}>Connect Wallet</Button>
                )}
                {/* Memos */}
                {currentAccount && (<h1>Memos received</h1>)}
                {currentAccount && (memos.map((memo, idx) => {
                return (
                    <div key={idx} style={{border:"2px solid", "border-radius":"5px", padding: "5px", margin: "5px"}}>
                    <p style={{"font-weight":"bold"}}>"{memo.message}"</p>
                    <p>From: {memo.name} at {memo.timestamp.toString()}</p>
                    </div>
                )
                }))}            
        </div>
    );

    
}
 
export default BuyCoffee;