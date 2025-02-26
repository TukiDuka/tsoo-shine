import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/');

    axios
      .get('http://localhost:5000/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPosts(res.data))
      .catch(() => navigate('/'));
  }, [navigate]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('description', description);
    if (image) formData.append('images', image);

    try {
      const res = await axios.post('http://192.168.88.201:5000/api/posts', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setPosts([...posts, res.data]);
      setDescription('');
      setImage(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Manage Posts</h1>
      <form onSubmit={handleCreatePost}>
        <textarea
          placeholder="Post description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ display: 'block', margin: '10px 0' }}
        />
        <button type="submit" style={{ padding: '10px' }}>Create Post</button>
      </form>
      <h2>All Posts</h2>
      {posts.map((post) => (
        <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <p>{post.description}</p>
          {post.image && <img src={post.image} alt="post" style={{ maxWidth: '200px' }} />}
          <p>Likes: {post.likes.length} | Comments: {post.comments.length}</p>
          <p>Author: {post.author.name}</p>
          <p>Created At: {new Date(post.createdAt).toLocaleString()}</p>
        </div>
      ))}
      <button onClick={() => navigate('/dashboard')} style={{ padding: '10px' }}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default Posts;