// filepath: c:\Users\LPAdmin\blood-bank-blockchain\blood-bank-dapp\src\DonorForm.js
import React, { useState } from 'react';
import axios from 'axios';

function DonorForm() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/donors/register', {
        name,
        age,
        blood_type: bloodType,
        location,
      });
      console.log('Donor registered:', response.data);
    } catch (error) {
      console.error('Error registering donor:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
  );
}

export default DonorForm;