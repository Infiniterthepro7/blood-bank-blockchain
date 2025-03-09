import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DonorForm({ fetchDonors }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [location, setLocation] = useState('');

  const registerDonor = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/donors/register', {
        name,
        age,
        blood_type: bloodType,
        location,
      });
      toast.success('Donor registered successfully!');
      fetchDonors();
    } catch (error) {
      console.error('Error registering donor:', error);
      toast.error('Failed to register donor.');
    }
  };

  return (
    <div>
      <h2>Register Donor</h2>
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
      <ToastContainer />
    </div>
  );
}

export default DonorForm;