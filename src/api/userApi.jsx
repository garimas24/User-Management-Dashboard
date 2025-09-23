
const API_URL = 'https://jsonplaceholder.typicode.com/users';


export const fetchUsers = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  // Adding mock 'firstName', 'lastName', and 'department' for the demo
  return data.map(user => ({
    id: user.id,
    firstName: user.name.split(' ')[0],
    lastName: user.name.split(' ')[1] || '',
    email: user.email,
    department: `Dept ${user.id % 5 + 1}`,
  }));
};

export const addUser = async (userData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error('Failed to add user');
  }
  const newUser = await response.json();
  // JSONPlaceholder returns the new object with a mocked ID
  return { ...userData, id: newUser.id };
};

// export const updateUser = async (userId, userData) => {
//   const response = await fetch(`${API_URL}/${userId}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(userData),
//   });
//   if (!response.ok) {
//     throw new Error('Failed to update user');
//   }
//   return { ...userData, id: userId };
// };

    export const updateUser = async (id, user) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: 'PATCH', // Change this from 'PUT' to 'PATCH'
    body: JSON.stringify(user),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to update user.');
  }

  // The mock API returns the updated data, which we use to update state
  const updatedUser = await response.json();
  return updatedUser;
};


export const deleteUser = async (userId) => {
  const response = await fetch(`${API_URL}/${userId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
};