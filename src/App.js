// src/App.js

import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import { fetchUsers, addUser, updateUser, deleteUser } from './api/userApi';
import './styles/UserManagement.css';
import TablePagination from './components/TablePagination';
import AddUserButton from './components/AddUserButton';

function App() {
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

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

  const filteredAndSearchedUsers = useMemo(() => {
    let filtered = [...users];
    if (Object.keys(filters).length > 0) {
      filtered = filtered.filter(user =>
        Object.keys(filters).every(key =>
          !filters[key] || user[key]?.toLowerCase().includes(filters[key].toLowerCase())
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

  const totalPages = Math.ceil(sortedUsers.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const usersToDisplay = sortedUsers.slice(startIndex, startIndex + limit);

  const handleAddOrUpdate = async (user) => {
    try {
      if (user.id) {
        const updatedUser = await updateUser(user.id, user);
        setUsers(users.map(u => (u.id === user.id ? updatedUser : u)));
      } else {
        const newUser = await addUser(user);
        setUsers([...users, newUser]);
      }
      navigate('/');
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
    navigate(`/edit/${user.id}`, { state: { user } });
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="container">
      <h1>User Management Dashboard</h1>
      <Routes>
        <Route path="/" element={
          <>
            <div className="header-controls">
              <input
                type="text"
                placeholder="Search all fields..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="search-input"
              />
              <div style={{ marginTop: '20px' }}>
                <AddUserButton />
              </div>
            </div>
            
            {error && <p className="error-message">{error}</p>}
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
                  <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            )}
          </>
        } />
        <Route path="/add" element={
          <UserForm onSave={handleAddOrUpdate} onCancel={() => navigate('/')} />
        } />
        {/* Uncommented the edit route */}
        <Route path="/edit/:userId" element={
          <UserForm onSave={handleAddOrUpdate} onCancel={() => navigate('/')} />
        } />
      </Routes>
    </div>
  );
}

export default App;