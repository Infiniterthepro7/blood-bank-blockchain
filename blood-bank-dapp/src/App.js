import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import bloodBankABI from './abis/BloodBank.json'; // Import ABI from the 'abis' folder
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import DonorList from './DonorList'; // Import DonorList component

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AppContainer = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [donors, setDonors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [bloodAvailability, setBloodAvailability] = useState({});
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [location, setLocation] = useState('');

  const contractAddress = "YOUR_NEW_CONTRACT_ADDRESS"; // Replace with your new contract address

  useEffect(() => {
    const initWeb3 = async () => {
      // Connect to Web3 using MetaMask
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request access to user accounts
          setWeb3(web3Instance);
          
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
          
          const contractInstance = new web3Instance.eth.Contract(bloodBankABI.abi, contractAddress);
          setContract(contractInstance);

          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
          });

          // Listen for network changes
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        } catch (error) {
          console.error("User denied account access or error occurred", error);
          alert("Please allow MetaMask access to use this DApp.");
        }
      } else {
        alert("Please install MetaMask!");
      }
    };
    
    initWeb3();
    fetchDonors();
    fetchHospitals();
    fetchBloodAvailability();
  }, []);

  // Function to register a donor on the blockchain
  const registerDonorOnBlockchain = async () => {
    if (contract && account) {
      try {
        await contract.methods.registerDonor(name, age, bloodType, location).send({ from: account });
        toast.success('Donor registered on blockchain successfully!');
      } catch (error) {
        console.error('Error registering donor on blockchain:', error);
        toast.error('Failed to register donor on blockchain.');
      }
    }
  };

  // Function to register a donor
  const registerDonor = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/donors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, age, bloodType, location }),
      });
      await response.json();
      toast.success('Donor registered successfully!');
      fetchDonors();
      registerDonorOnBlockchain(); // Register donor on blockchain
    } catch (error) {
      console.error('Error registering donor:', error);
      toast.error('Failed to register donor.');
    }
  };

  // Function to fetch all donors
  const fetchDonors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/donors');
      setDonors(response.data);
    } catch (error) {
      console.error(error);
      alert("Error fetching donors.");
    }
  };

  // Function to fetch all hospitals
  const fetchHospitals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hospitals');
      setHospitals(response.data);
    } catch (error) {
      console.error(error);
      alert("Error fetching hospitals.");
    }
  };

  // Function to fetch blood availability
  const fetchBloodAvailability = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blood-availability');
      setBloodAvailability(response.data);
    } catch (error) {
      console.error(error);
      alert("Error fetching blood availability.");
    }
  };

  // Function to fetch donor details from the blockchain
  const fetchDonorDetailsFromBlockchain = async (donorId) => {
    if (contract) {
      try {
        const donorDetails = await contract.methods.getDonor(donorId).call();
        console.log('Donor details from blockchain:', donorDetails);
      } catch (error) {
        console.error('Error fetching donor details from blockchain:', error);
      }
    }
  };

  const bloodTypes = Object.keys(bloodAvailability);
  const bloodCounts = Object.values(bloodAvailability);

  const data = {
    labels: bloodTypes,
    datasets: [
      {
        label: 'Blood Availability',
        data: bloodCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Blood Type Availability',
      },
    },
  };

  return (
    <AppContainer>
      <h1>Blood Bank</h1>
      <form onSubmit={registerDonor}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Age:</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
        </div>
        <div>
          <label>Blood Type:</label>
          <input type="text" value={bloodType} onChange={(e) => setBloodType(e.target.value)} required />
        </div>
        <div>
          <label>Location:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
        <button type="submit">Register Donor</button>
      </form>
      <DonorList /> {/* Add DonorList component */}
      <h2>Donors</h2>
      <ul className="list-group">
        {donors.map((donor) => (
          <li key={donor.id} className="list-group-item" onClick={() => fetchDonorDetailsFromBlockchain(donor.id)}>
            {donor.name} - {donor.bloodType} - {donor.location}
          </li>
        ))}
      </ul>
      <h2>Hospitals</h2>
      <ul className="list-group">
        {hospitals.map((hospital) => (
          <li key={hospital.id} className="list-group-item">
            {hospital.name} - {hospital.location}
          </li>
        ))}
      </ul>
      <h2>Blood Type Availability</h2>
      <Bar data={data} options={options} />
      <ToastContainer />
    </AppContainer>
  );
}

export default App;
