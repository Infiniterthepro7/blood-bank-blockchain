import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ToastContainer } from 'react-toastify';
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
  const [donors, setDonors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [bloodAvailability, setBloodAvailability] = useState({});

  useEffect(() => {
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
