import React from 'react'
import { useNavigate } from "react-router-dom";

function AddUserButton() {
     const navigate = useNavigate();
  return (
    
    <button onClick={() => navigate('/add')} className="add-button">
      Add New User
    </button>
  )
}

export default AddUserButton

