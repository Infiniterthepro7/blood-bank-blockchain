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
import DonorList from './DonorList';
import DonorForm from './DonorForm';
import Navbar from './Navbar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AppContainer = styled.div`
  max-width: 1200px;
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

  // Function to fetch all donors
  const fetchDonors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/donors');
      setDonors(response.data);
    } catch (error) {
      console.error('Error fetching donors:', error);
      alert("Error fetching donors.");
    }
  };

  // Function to fetch all hospitals
  const fetchHospitals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hospitals');
      setHospitals(response.data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      alert("Error fetching hospitals.");
    }
  };

  // Function to fetch blood availability
  const fetchBloodAvailability = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blood-availability');
      setBloodAvailability(response.data);
    } catch (error) {
      console.error('Error fetching blood availability:', error);
      alert("Error fetching blood availability.");
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
    <>
      <Navbar />
      <AppContainer>
        <h1>Blood Bank</h1>
        <DonorForm fetchDonors={fetchDonors} />
        <DonorList donors={donors} />
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
    </>
  );
}

export default App;
