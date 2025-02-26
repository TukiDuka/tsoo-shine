import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/');

    axios
      .get('http://192.168.88.201:5000/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategories(res.data))
      .catch(() => navigate('/'));
  }, [navigate]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Manage Categories</h1>
      <h2>All Categories</h2>
      {categories.map((category) => (
        <div key={category.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <p>Name: {category.name}</p>
          <p>Description: {category.description || 'N/A'}</p>
          <p>Products: {category.products.length}</p>
          <p>Created At: {new Date(category.createdAt).toLocaleString()}</p>
        </div>
      ))}
      <button onClick={() => navigate('/dashboard')} style={{ padding: '10px' }}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default Categories;