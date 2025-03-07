import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import bloodBankABI from './abis/BloodBank.json'; // Import ABI from the 'abis' folder

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [donorDetails, setDonorDetails] = useState(null);

  const contractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989f875707"; // Replace with your contract address

  useEffect(() => {
    const initWeb3 = async () => {
      // Connect to Web3 using MetaMask
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable(); // Request access to user accounts
        setWeb3(web3Instance);
        
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        
        const contractInstance = new web3Instance.eth.Contract(bloodBankABI.abi, contractAddress);
        setContract(contractInstance);
      } else {
        alert("Please install MetaMask!");
      }
    };
    
    initWeb3();
  }, []);

  // Function to register a donor
  const registerDonor = async (name, age, bloodType, location) => {
    if (contract) {
      try {
        await contract.methods
          .registerDonor(name, age, bloodType, location)
          .send({ from: account, gas: 1000000, gasPrice: web3.utils.toWei("20", "gwei") });
        alert("Donor Registered!");
      } catch (error) {
        console.error(error);
        alert("Error registering donor.");
      }
    }
  };

  // Function to get donor details
  const getDonorDetails = async (donorAddress) => {
    if (contract) {
      try {
        const details = await contract.methods.getDonorDetails(donorAddress).call();
        setDonorDetails(details);
      } catch (error) {
        console.error(error);
        alert("Error fetching donor details.");
      }
    }
  };

  return (
    <div className="App">
      <h1>Blood Bank DApp</h1>
      <h2>Account: {account}</h2>

      {/* Register Donor Form */}
      <h3>Register Donor</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const name = e.target.name.value;
          const age = e.target.age.value;
          const bloodType = e.target.bloodType.value;
          const location = e.target.location.value;
          registerDonor(name, age, bloodType, location);
        }}
      >
        <input type="text" name="name" placeholder="Name" required />
        <input type="number" name="age" placeholder="Age" required />
        <input type="text" name="bloodType" placeholder="Blood Type" required />
        <input type="text" name="location" placeholder="Location" required />
        <button type="submit">Register Donor</button>
      </form>

      {/* Get Donor Details Form */}
      <h3>Get Donor Details</h3>
      <input
        type="text"
        placeholder="Donor Address"
        onChange={(e) => getDonorDetails(e.target.value)}
      />
      {donorDetails && (
        <div>
          <p>Name: {donorDetails[0]}</p>
          <p>Age: {donorDetails[1]}</p>
          <p>Blood Type: {donorDetails[2]}</p>
          <p>Location: {donorDetails[3]}</p>
          <p>Availability: {donorDetails[4] ? "Available" : "Not Available"}</p>
        </div>
      )}
    </div>
  );
}

export default App;
