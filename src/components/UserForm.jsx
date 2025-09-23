import React, { useState, useEffect } from 'react';

function UserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    department: '',
  });

  useEffect(() => {
 
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ id: null, firstName: '', lastName: '', email: '', department: '' });
  };

  if (!user) {
    return null; 
  }

  return (
    <div className="form-container">
      <h2>{formData.id ? 'Edit User' : 'Add User'}</h2>
      
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Department" required />
        
        <div className="form-buttons">
          <button type="submit" className="save-button">Save</button>
          <button type="button" onClick={onCancel} className="cancel-button">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;