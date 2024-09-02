import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertTitle,Input, Typography,IconButton} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import Box from "@mui/material/Box";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // State for success alert
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle visibility state
  };
  const navigate = useNavigate(); // Initialize useNavigate
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/loginUser',
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        setSuccess('Login successful!'); // Show success message
  
        setTimeout(() => {
          const info = {
            id: response.data.user._id,
            name: response.data.user.username
          };
  
          // Clear form fields and reset error/success
          setUsername('');
          setPassword('');
          setError('');
          setSuccess(''); // Clear success message after navigating
  
          if (response.data.user.role === 'admin') {
            navigate("/productTable", { state: { info } });
          } else {
            navigate("/productForm", { state: { info } });
          }
        }, 3000); // Delay navigation by 3 seconds
      } else {
        setError('Login failed: ' + response.data.message);
        setTimeout(() => {
          setError('');
        }, 5000);
      }
    } catch (error) {
      setError('An error occurred: ' + (error.response?.data?.message || error.message));
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      {/* Show error alert */}
      {error && (
        <Alert severity="error" sx={{ marginTop: '20px' }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {/* Show success alert */}
      {success && (
        <Alert severity="success" sx={{ marginTop: '20px' }}>
          <AlertTitle>Success</AlertTitle>
          {success}
        </Alert>
      )}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        alignItems="flex-start"
        width="300px"
        sx={{
          maxWidth: { xs: '100%', md: 'auto' },
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          flex={1}
          justifyContent="center"
          px={4}
          py={2}
          borderRadius={1}
          border="1px solid"
          bgcolor="neutral.800"
          borderColor="neutral.800"
          width="100%"
          sx={{
            px: { xs: 2, md: 4 },
            bgcolor: 'rgba(38,38,38,0.5)', // Equivalent to bg-opacity-50
          }}
        >
          <Typography variant="h6" color="white">
            Username
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={2}
            width="100%"
          >
            <Input type="text" disableUnderline value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{borderBottom:'2px solid gray',color:'white'}} />
          </Box>
        </Box>
      </Box>

      <Box
      display="flex"
      flexWrap="wrap"
      gap={2}
      alignItems="flex-start"
      width="100%"
      sx={{
        maxWidth: { xs: '100%', md: 'auto' },
        marginTop: '20px'
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        flex={1}
        justifyContent="center"
        px={4}
        py={2}
        borderRadius={1}
        border="1px solid"
        bgcolor="neutral.800"
        borderColor="neutral.800"
        width="100%"
        sx={{
          px: { xs: 2, md: 4 },
          bgcolor: 'rgba(38,38,38,0.5)', // Equivalent to bg-opacity-50
        }}
      >
        <Typography variant="h6" color="white">
          Password
        </Typography>
        <Box
          display="flex"
          flexDirection="row" // Row to place button next to input
          justifyContent="center"
          mt={2}
          width="100%"
          alignItems="center"
        >
          <Input
            type={showPassword ? 'text' : 'password'} // Toggle input type
            value={password}
            disableUnderline
            onChange={(e) => setPassword(e.target.value)}
            sx={{ borderBottom: '2px solid gray', color: 'white', flex: 1 }}
          />
          <IconButton style={{backgroundColor:'white'}} onClick={togglePasswordVisibility} sx={{ marginLeft: '10px' }}>
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Box>
      </Box>
    </Box>

      

      <button style={{ marginTop: '20px', backgroundColor: 'greenyellow' }} type="submit">Login</button>
    </form>
  );
};

export default Login;
