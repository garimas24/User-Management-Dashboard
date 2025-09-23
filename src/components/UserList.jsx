import React from 'react';

const SortArrow = ({ sortKey, currentSortKey, direction }) => {
  if (sortKey !== currentSortKey) return null;
  return direction === 'asc' ? ' ↑' : ' ↓';
};

function UserList({ users, onEdit, onDelete, onSort, sortConfig }) {
  return (
    <table className="user-table">
      <thead>
        <tr>
          <th onClick={() => onSort('id')}>ID <SortArrow sortKey="id" currentSortKey={sortConfig.key} direction={sortConfig.direction} /></th>
          <th onClick={() => onSort('firstName')}>First Name <SortArrow sortKey="firstName" currentSortKey={sortConfig.key} direction={sortConfig.direction} /></th>
          <th onClick={() => onSort('lastName')}>Last Name <SortArrow sortKey="lastName" currentSortKey={sortConfig.key} direction={sortConfig.direction} /></th>
          <th onClick={() => onSort('email')}>Email <SortArrow sortKey="email" currentSortKey={sortConfig.key} direction={sortConfig.direction} /></th>
          <th onClick={() => onSort('department')}>Department <SortArrow sortKey="department" currentSortKey={sortConfig.key} direction={sortConfig.direction} /></th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.length > 0 ? (
          users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.department}</td>
              <td className="actions">
                
                <button onClick={() => onEdit(user)} className="edit-button">Edit</button>
                <button onClick={() => onDelete(user.id)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" style={{ textAlign: 'center' }}>No users found.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default UserList;