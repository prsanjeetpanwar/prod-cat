import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const ProductTable = () => {
  const [products, setProducts] = useState([]); // State to hold the list of products
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [editingProductId, setEditingProductId] = useState(null); // State to track which product is being edited
  const [editableProduct, setEditableProduct] = useState({}); // State to hold the current editable product details
  const [selectedFile, setSelectedFile] = useState(null); // State to store selected file for upload
  const navigate=useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/getAllProducts');
        setProducts(response.data.data); // Assuming the API returns the product list in response.data.data
        setLoading(false); // Set loading to false once products are fetched
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false); // Handle errors and stop loading
      }
    };

    fetchProducts(); // Call the function to fetch products
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  // Handle delete functionality
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/deleteProduct/${productId}`); // Delete the product by ID
      setProducts(products.filter((product) => product._id !== productId)); // Remove the deleted product from state
      alert('Deleted successfully'); // Notify the user of the successful deletion
    } catch (error) {
      console.error('Error deleting product:', error); // Handle errors in deletion
    }
  };

  // Handle edit functionality - This is triggered when the Edit button is clicked
  const handleEdit = (product) => {
    setEditingProductId(product._id); // Set the ID of the product being edited
    setEditableProduct({ ...product }); // Copy the current product details into the editable state
  };

  // Handle input change in editable fields
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Get the name and value from the input field
    setEditableProduct({ ...editableProduct, [name]: value }); // Update the corresponding field in editableProduct state
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Store the selected file
  };


  // Handle save functionality - Update the product in the backend
  // Handle save functionality - Update the product in the backend
const handleSave = async () => {
    try {
      // Create FormData to handle product details and image
      const formData = new FormData();
      
      // Append all editable product fields to formData
      for (const key in editableProduct) {
        formData.append(key, editableProduct[key]);
      }
  
      // Append the selected image file if there is one
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
  
      // Send a PUT request with FormData
      await axios.put(`http://localhost:8000/api/v1/updateProduct/${editingProductId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Update the product in the state
      setProducts(products.map((product) => (product._id === editingProductId ? editableProduct : product)));
      setEditingProductId(null); // Exit edit mode by clearing the editingProductId
      alert('Updated successfully'); // Notify the user of the successful update
    } catch (error) {
      console.error('Error updating product:', error); // Handle errors in updating
      alert('Update failed');
    }
  };
  
  return (
    <>
      <header>
        <button onClick={() => navigate('/register')}>Register</button>
        <button onClick={() => navigate('/users')}>Users</button>
        <button onClick={() => navigate('/')}>Logout</button>
      </header>
      <table>
      <thead>
        <tr>
          <th>Product Id</th>
          <th>Product Name</th>
          <th>Product Brand</th>
          <th>Super Category</th>
          <th>Category</th>
          <th>Subcategory</th>
          <th>No. of units</th>
          <th>SI Units</th>
          <th>Unit Weight</th>
          <th>Net Weight</th>
          <th>Gross Weight</th>
          <th>Description</th>
          <th>Calories</th>
          <th>Fat</th>
          <th>Saturated Fat</th>
          <th>Carbs</th>
          <th>Fiber</th>
          <th>Sugar</th>
          <th>Protein</th>
          <th>Salt</th>
          <th>Ingredients</th>
          <th>Dietary</th>
          <th>Storage</th>
          <th>Origin</th>
          <th>Added By</th>
          <th>Product Id Prefix</th>
          <th>Image</th>
          <th>Actions</th> {/* Column for Edit/Delete actions */}
        </tr>
      </thead>
      <tbody>
        {products.length === 0 ? (
          <tr>
            <td colSpan="7">No products found.</td> 
          </tr>
        ) : (
          products.map((product) => (
            <tr key={product._id}>
              {editingProductId === product._id ? (
                <>
                  
                  <td>{product._id}</td>
                  <td>
                    <input
                      type="text"
                      name="productName"
                      value={editableProduct.productName}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="productBrand"
                      value={editableProduct.productBrand}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="superCategory"
                      value={editableProduct.superCategory}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="category"
                      value={editableProduct.category}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="subCategory"
                      value={editableProduct.subCategory}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
    <input
      type="number"
      name="numberOfUnits"
      value={editableProduct.numberOfUnits}
      onChange={handleInputChange}
    />
  </td>
  <td>
    <input
      type="text"
      name="siUnits"
      value={editableProduct.siUnits}
      onChange={handleInputChange}
    />
  </td>
  <td>
    <input
      type="number"
      name="unitWeight"
      value={editableProduct.unitWeight}
      onChange={handleInputChange}
    />
  </td>
  <td>
    <input
      type="number"
      name="netWeight"
      value={editableProduct.netWeight}
      onChange={handleInputChange}
    />
  </td>
  <td>
    <input
      type="number"
      name="grossWeight"
      value={editableProduct.grossWeight}
      onChange={handleInputChange}
    />
  </td>
  <td>
    <input
      type="text"
      name="productDescription"
      value={editableProduct.productDescription}
      onChange={handleInputChange}
    />
  </td>
  <td>
    <input
      type="number"
      name="calories"
      value={editableProduct.calories}
      onChange={handleInputChange}
    />
  </td>
  <td>
    <input
      type="number"
      name="fat"
      value={editableProduct.fat}
      onChange={handleInputChange}
    />
  </td>
  <td>
    <input
      type="number"
      name="saturatedFat"
      value={editableProduct.saturatedFat}
      onChange={handleInputChange}
    />
  </td>
  <td>
    <input
      type="number"
      name="carbs"
      value={editableProduct.carbs}
      onChange={handleInputChange}
    />
  </td>
  <td>
    <input
      type="number"
      name="fibre"
      value={editableProduct.fibre}
      onChange={handleInputChange}
    />
  </td>
  <td>
    <input
      type="number"
      name="sugar"
      value={editableProduct.sugar}
      onChange={handleInputChange}
    />
  </td>
  <td>
    <input
      type="number"
      name="protein"
      value={editableProduct.protein}
      onChange={handleInputChange}
    />
  </td>
  <td>
    <input
      type="number"
      name="salt"
      value={editableProduct.salt}
      onChange={handleInputChange}
    />
  </td>
  <td>
    <input
      type="text"
      name="ingredients"
      value={editableProduct.ingredients}
      onChange={handleInputChange}
    />
  </td>
  <td>
    <input
      type="text"
      name="dietary"
      value={editableProduct.dietary}
      onChange={handleInputChange}
    />
  </td>
  <td>
    <input
      type="text"
      name="storage"
      value={editableProduct.storage}
      onChange={handleInputChange}
    />
  </td>
  <td>
    <input
      type="text"
      name="origin"
      value={editableProduct.origin}
      onChange={handleInputChange}
    />
  </td>
  <td>
    <input
      type="text"
      name="addedBy"
      value={editableProduct.addedBy}
      onChange={handleInputChange}
    />
  </td>
  <td>
    <input
      type="text"
      name="productIdPrefix"
      value={editableProduct.productIdPrefix}
      onChange={handleInputChange}
    />
  </td>
  <td>
  {/* File input for selecting the image */}
  <input type="file" onChange={handleFileChange} /> 

  {/* Link to view the current uploaded image, if available */}
  {editableProduct.uploadImage && (
    <a href={editableProduct.uploadImage} target="_blank" rel="noopener noreferrer">
      View Image
    </a>
  )}
</td>

                  <td>
                    <button onClick={handleSave}>Save</button> {/* Button to save the changes */}
                  </td>
                </>
              ) : (
                <>
                  {/* Render static product details if not in edit mode */}
                  <td>{product._id}</td>
                  <td>{product.productName}</td>
                  <td>{product.productBrand}</td>
                  <td>{product.superCategory}</td>
                  <td>{product.category}</td>
                  <td>{product.subCategory}</td>
                  <td>{product.numberOfUnits}</td>
                  <td>{product.siUnits}</td>
                  <td>{product.unitWeight}</td>
                  <td>{product.netWeight}</td>
                  <td>{product.grossWeight}</td>
              <td>{product.productDescription}</td>
                   <td>{product.calories}</td>
              <td>{product.fat}</td>
              <td>{product.saturatedFat}</td>
              <td>{product.carbs}</td>
              <td>{product.fibre}</td>
              <td>{product.sugar}</td>
              <td>{product.protein}</td>
              <td>{product.salt}</td>
              <td>{product.ingredients}</td>
              <td>{product.dietary}</td>
              <td>{product.storage}</td>
              <td>{product.origin}</td>
              <td>{product.addedBy}</td>
              <td>{product.productIdPrefix}</td>
                  <td>
                    <a href={product.uploadImage} target="_blank" rel="noopener noreferrer">
                      View Image
                    </a> {/* Link to view the product image */}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(product)}>Edit</button> {/* Button to enter edit mode */}
                    <button onClick={() => handleDelete(product._id)}>Delete</button> {/* Button to delete the product */}
                  </td>
                </>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
    </>
    
  );
};

export default ProductTable;















