import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // Default to empty string for the default option
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!role) {
      setError('Please select a role.');
      return;
    }

    try {
      console.log("Registering user...");

      const response = await axios.post(
        'http://localhost:8000/api/v1/registerUser',
        { username, password, role },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        alert('Registration successful!');
        setUsername('');
        setPassword('');
        setRole(''); // Reset to default option
        navigate('/users')
      } else {
        console.log("An error occurred during registration");
        setError('Registration failed: ' + response.data.message);
      }
    } catch (error) {
      console.log("Error occurred during registration:", error.message);
      setError('An error occurred: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="role">Role:</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="" disabled>Select Role</option> {/* Default option */}
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Register</button>
      
    </form>
  );
};

export default Register;
