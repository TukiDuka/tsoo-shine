import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) return navigate('/');

    const fetchData = async () => {
      try {
        const [adminRes, statsRes] = await Promise.all([
          axios.get(`http://192.168.88.201:5000/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://192.168.88.201:5000/api/admin/dashboard-stats', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setAdmin(adminRes.data);
        setStats(statsRes.data);
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/');
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  if (!admin || !stats) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Welcome, {admin.name} (Admin)</h1>
      <p>Last Login: {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'N/A'}</p>
      <h2>Dashboard Statistics</h2>
      <p>Total Users: {stats.totalUsers}</p>
      <p>Total Products: {stats.totalProducts}</p>
      <p>Total Categories: {stats.totalCategories}</p>
      <p>Total Moderators: {stats.totalModerators}</p>
      <div>
        <button onClick={() => navigate('/users')} style={{ padding: '10px', margin: '5px' }}>
          Manage Users
        </button>
        <button onClick={() => navigate('/moderators')} style={{ padding: '10px', margin: '5px' }}>
          Manage Moderators
        </button>
        <button onClick={() => navigate('/posts')} style={{ padding: '10px', margin: '5px' }}>
          Manage Posts
        </button>
        <button onClick={() => navigate('/products')} style={{ padding: '10px', margin: '5px' }}>
          Manage Products
        </button>
        <button onClick={() => navigate('/categories')} style={{ padding: '10px', margin: '5px' }}>
          Manage Categories
        </button>
        <button onClick={handleLogout} style={{ padding: '10px', margin: '5px' }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;