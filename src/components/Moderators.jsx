import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Moderators = () => {
  const [moderators, setModerators] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/');

    axios
      .get('http://localhost:5000/api/admin/moderators', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setModerators(res.data))
      .catch(() => navigate('/'));
  }, [navigate]);

  const handleAddModerator = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/admin/moderators',
        { name, email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModerators([...moderators, res.data]);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteModerator = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://192.168.88.201:5000/api/admin/moderators/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModerators(moderators.filter((mod) => mod.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Manage Moderators</h1>
      <form onSubmit={handleAddModerator}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
        />
        <button type="submit" style={{ padding: '10px', margin: '10px 0' }}>
          Add Moderator
        </button>
      </form>
      <h2>All Moderators</h2>
      {moderators.map((mod) => (
        <div key={mod.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <p>Name: {mod.name}</p>
          <p>Email: {mod.email}</p>
          {mod.profileImage && <img src={mod.profileImage} alt="profile" style={{ maxWidth: '100px' }} />}
          <button
            onClick={() => handleDeleteModerator(mod.id)}
            style={{ padding: '5px', background: 'red', color: 'white', border: 'none' }}
          >
            Delete
          </button>
        </div>
      ))}
      <button onClick={() => navigate('/dashboard')} style={{ padding: '10px' }}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default Moderators;