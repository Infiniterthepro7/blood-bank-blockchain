// filepath: c:\Users\LPAdmin\blood-bank-blockchain\blood-bank-dapp\src\DonorList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DonorList() {
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/donors');
        setDonors(response.data);
      } catch (error) {
        console.error('Error fetching donors:', error);
      }
    };

    fetchDonors();
  }, []);

  return (
    <div>
      <h2>Donor List</h2>
      <ul>
        {donors.map((donor) => (
          <li key={donor.id}>
            {donor.name} - {donor.age} - {donor.blood_type} - {donor.location}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DonorList;