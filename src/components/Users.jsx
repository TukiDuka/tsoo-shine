import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/');

    axios
      .get('http://192.168.88.201:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch(() => navigate('/'));
  }, [navigate]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Manage Users</h1>
      {users.map((user) => (
        <div key={user.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <p>Active: {user.isActive ? 'Yes' : 'No'}</p>
          <p>Created At: {new Date(user.createdAt).toLocaleString()}</p>
          {user.profileImage && <img src={user.profileImage} alt="profile" style={{ maxWidth: '100px' }} />}
        </div>
      ))}
      <button onClick={() => navigate('/dashboard')} style={{ padding: '10px' }}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default Users;