// src/components/UserForm.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation

function UserForm({ onSave }) {
  const navigate = useNavigate();
  const location = useLocation(); // Get the location object
  const user = location.state?.user; // Access the user object passed in the state

  const [formData, setFormData] = useState({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    department: '',
  });

  useEffect(() => {
    // This effect will run when the 'user' object changes.
    // It pre-fills the form with data from the passed user object.
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="form-container">
      <h2>{formData.id ? 'Edit User' : 'Add User'}</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="firstName" 
          value={formData.firstName} 
          onChange={handleChange} 
          placeholder="First Name" 
          required 
        />
        <input 
          type="text" 
          name="lastName" 
          value={formData.lastName} 
          onChange={handleChange} 
          placeholder="Last Name" 
          required 
        />
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          placeholder="Email" 
          required 
        />
        <input 
          type="text" 
          name="department" 
          value={formData.department} 
          onChange={handleChange} 
          placeholder="Department" 
          required 
        />
        <div className="form-buttons">
          <button type="submit" className="save-button">Save</button>
          <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;