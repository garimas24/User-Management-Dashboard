// src/components/FilterPopup.js

import React, { useState } from 'react';

function FilterPopup({ filters, onFilterChange, onClose }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters({ ...localFilters, [name]: value });
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  return (
    <div className="filter-popup-overlay">
      <div className="filter-popup-content">
        <h3>Filter Users</h3>
        <input type="text" name="firstName" placeholder="First Name" value={localFilters.firstName || ''} onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last Name" value={localFilters.lastName || ''} onChange={handleChange} />
        <input type="text" name="email" placeholder="Email" value={localFilters.email || ''} onChange={handleChange} />
        <input type="text" name="department" placeholder="Department" value={localFilters.department || ''} onChange={handleChange} />
        <div className="filter-buttons">
          <button onClick={handleApply} className="apply-filter-button">Apply</button>
          <button onClick={() => { setLocalFilters({}); onFilterChange({}); onClose(); }} className="reset-filter-button">Reset</button>
          <button onClick={onClose} className="cancel-filter-button">Close</button>
        </div>
      </div>
    </div>
  );
}

export default FilterPopup;