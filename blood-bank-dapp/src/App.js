import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import bloodBankABI from './abis/BloodBank.json'; // Import ABI from the 'abis' folder
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [donorDetails, setDonorDetails] = useState(null);
  const [hospitalDetails, setHospitalDetails] = useState(null);
  const [bloodAvailability, setBloodAvailability] = useState(null);
  const [donors, setDonors] = useState([]);
  const [hospitals, setHospitals] = useState([]);

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
  }, []);

  // Function to register a donor
  const registerDonor = async (name, age, bloodType, location) => {
    try {
      const response = await axios.post('http://localhost:5000/api/donors/register', { name, age, bloodType, location });
      alert("Donor Registered!");
      fetchDonors(); // Refresh the list of donors
    } catch (error) {
      console.error(error);
      alert("Error registering donor.");
    }
  };

  // Function to get donor details
  const getDonorDetails = async (donorId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/donors/${donorId}`);
      setDonorDetails(response.data);
    } catch (error) {
      console.error(error);
      alert("Error fetching donor details.");
    }
  };

  // Function to get hospital details
  const getHospitalDetails = async (hospitalId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/hospitals/${hospitalId}`);
      setHospitalDetails(response.data);
    } catch (error) {
      console.error(error);
      alert("Error fetching hospital details.");
    }
  };

  // Function to check blood availability
  const checkBloodAvailability = async (bloodType) => {
    if (contract) {
      try {
        const availability = await contract.methods.checkBloodAvailability(bloodType).call();
        setBloodAvailability(availability);
      } catch (error) {
        console.error(error);
        alert("Error checking blood availability.");
      }
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

  return (
    <div className="App container">
      <h1 className="my-4">Blood Bank DApp</h1>
      <h2>Account: {account}</h2>

      {/* Register Donor Form */}
      <h3 className="my-4">Register Donor</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const name = e.target.name.value;
          const age = e.target.age.value;
          const bloodType = e.target.bloodType.value;
          const location = e.target.location.value;
          registerDonor(name, age, bloodType, location);
        }}
        className="mb-4"
      >
        <div className="form-group">
          <input type="text" name="name" placeholder="Name" className="form-control" required />
        </div>
        <div className="form-group">
          <input type="number" name="age" placeholder="Age" className="form-control" required />
        </div>
        <div className="form-group">
          <select name="bloodType" className="form-control" required>
            <option value="">Select Blood Type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div className="form-group">
          <input type="text" name="location" placeholder="Location" className="form-control" required />
        </div>
        <button type="submit" className="btn btn-primary">Register Donor</button>
      </form>

      {/* Get Donor Details Form */}
      <h3 className="my-4">Get Donor Details</h3>
      <div className="form-group mb-4">
        <input
          type="text"
          placeholder="Donor ID"
          className="form-control"
          onChange={(e) => getDonorDetails(e.target.value)}
        />
      </div>
      {donorDetails && (
        <div className="card mb-4">
          <div className="card-body">
            <p>Name: {donorDetails.name}</p>
            <p>Age: {donorDetails.age}</p>
            <p>Blood Type: {donorDetails.bloodType}</p>
            <p>Location: {donorDetails.location}</p>
            <p>Availability: {donorDetails.isAvailable ? "Available" : "Not Available"}</p>
          </div>
        </div>
      )}

      {/* Get Hospital Details Form */}
      <h3 className="my-4">Get Hospital Details</h3>
      <div className="form-group mb-4">
        <input
          type="text"
          placeholder="Hospital ID"
          className="form-control"
          onChange={(e) => getHospitalDetails(e.target.value)}
        />
      </div>
      {hospitalDetails && (
        <div className="card mb-4">
          <div className="card-body">
            <p>Hospital Name: {hospitalDetails.name}</p>
            <p>Location: {hospitalDetails.location}</p>
            <p>Contact: {hospitalDetails.contact}</p>
          </div>
        </div>
      )}

      {/* Check Blood Availability Form */}
      <h3 className="my-4">Check Blood Availability</h3>
      <div className="form-group mb-4">
        <select
          className="form-control"
          onChange={(e) => checkBloodAvailability(e.target.value)}
        >
          <option value="">Select Blood Type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>
      {bloodAvailability !== null && (
        <div className="alert alert-info">
          Blood Availability: {bloodAvailability ? "Available" : "Not Available"}
        </div>
      )}

      {/* Display All Donors */}
      <h3 className="my-4">All Donors</h3>
      <div className="list-group mb-4">
        {donors.map((donor) => (
          <div key={donor._id} className="list-group-item">
            <p>Name: {donor.name}</p>
            <p>Age: {donor.age}</p>
            <p>Blood Type: {donor.bloodType}</p>
            <p>Location: {donor.location}</p>
            <p>Availability: {donor.isAvailable ? "Available" : "Not Available"}</p>
          </div>
        ))}
      </div>

      {/* Display All Hospitals */}
      <h3 className="my-4">All Hospitals</h3>
      <div className="list-group mb-4">
        {hospitals.map((hospital) => (
          <div key={hospital._id} className="list-group-item">
            <p>Hospital Name: {hospital.name}</p>
            <p>Location: {hospital.location}</p>
            <p>Contact: {hospital.contact}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
