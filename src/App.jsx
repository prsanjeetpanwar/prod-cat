
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Users from './components/Auth/Users';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProductForm from './components/Auth/ProductForm';
import ProductTable from './components/Auth/ProductTable';
function App() {
  
  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<Users />} />
        <Route path="/productForm" element={<ProductForm />} />
        <Route path="/productTable" element={<ProductTable />} />

      </Routes>
    </Router>
    </>
    
  );
}

export default App;
