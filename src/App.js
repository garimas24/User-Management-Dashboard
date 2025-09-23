// src/App.js

import React, { useState, useEffect, useMemo } from 'react';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import FilterPopup from './components/FilterPopup';
import { fetchUsers, addUser, updateUser, deleteUser } from './api/userApi';
import './styles/UserManagement.css';

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination, Search, Filter & Sort states
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  // Filter and Search Logic
  const filteredAndSearchedUsers = useMemo(() => {
    let filtered = [...users];
    if (Object.keys(filters).length > 0) {
      filtered = filtered.filter(user =>
        Object.keys(filters).every(key =>
          !filters[key] || user[key].toLowerCase().includes(filters[key].toLowerCase())
        )
      );
    }
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        Object.values(user).some(value =>
          value?.toString().toLowerCase().includes(lowerCaseQuery)
        )
      );
    }
    return filtered;
  }, [users, searchQuery, filters]);

  // Sort Logic
  const sortedUsers = useMemo(() => {
    const sortableUsers = [...filteredAndSearchedUsers];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableUsers;
  }, [filteredAndSearchedUsers, sortConfig]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedUsers.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const usersToDisplay = sortedUsers.slice(startIndex, startIndex + limit);

  // CRUD Handlers
  const handleAddOrUpdate = async (user) => {
    try {
      if (user.id) {
        const updatedUser = await updateUser(user.id, user);
        setUsers(users.map(u => (u.id === user.id ? updatedUser : u)));
      } else {
        const newUser = await addUser(user);
        setUsers([...users, newUser]);
      }
      setEditingUser(null);
    } catch (err) {
      setError(`Failed to ${user.id ? 'update' : 'add'} user.`);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to delete user.');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="container">
      <h1>User Management</h1>
      <div className="header-controls">
        <input
          type="text"
          placeholder="Search all fields..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          className="search-input"
        />
        {/* <button onClick={() => setShowFilterPopup(true)} className="filter-button">
          Reset     //////
        </button> */}
        <button onClick={() => setEditingUser({})} className="add-button">
          Add New User
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <UserForm user={editingUser} onSave={handleAddOrUpdate} onCancel={() => setEditingUser(null)} />
      {showFilterPopup && (
        <FilterPopup
          filters={filters}
          onFilterChange={setFilters}
          onClose={() => setShowFilterPopup(false)}
        />
      )}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          <UserList
            users={usersToDisplay}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSort={handleSort}
            sortConfig={sortConfig}
          />
          <div className="pagination-controls">
            <span>
              Rows per page:
              <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setCurrentPage(1); }}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </span>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            enabled={currentPage === 1}>
              Previous
            </button>
            <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
             enabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;