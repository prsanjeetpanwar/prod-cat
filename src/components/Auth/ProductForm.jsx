import { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import { useLocation } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import { productData, countries } from "./Categories";
import Select from "@mui/material/Select";
import { Input, Typography, IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from "@mui/material/styles";

//import CloudUploadIcon from '@mui/icons-material/CloudUpload';
//import { useLocation } from 'react-router-dom';

const ProductForm = () => {
  const [productName, setProductName] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [superCategory, setSuperCategory] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [noOfUnits, setNoOfUnits] = useState("");
  const [siUnits, setSiUnits] = useState("Kg");
  const [unitWeight, setUnitWeight] = useState("");
  const [netWeight, setNetWeight] = useState("0");
  const [grossWeight, setGrossWeight] = useState("");
  const [description, setDescription] = useState("");
  const [nutrition, setNutrition] = useState({
    calories: "",
    fat: "",
    saturatedFat: "",
    carbs: "",
    fibre: "",
    sugar: "",
    protein: "",
    salt: "",
  });
  const [ingredients, setIngredients] = useState("");
  const [dietary, setDietary] = useState("");
  const [storage, setStorage] = useState("");
  const [origin, setOrigin] = useState("");
  const [files, setFiles] = useState([]);
  const [productIdPrefix, setProductIdPrefix] = useState("");
  const location = useLocation();
  const data = location.state;
  const selectedSuperCategory =
    productData.find((sc) => sc._id === superCategory)?.name || "";
  const selectedCategory =
    productData
      .find((sc) => sc._id === superCategory)
      ?.categories.find((cat) => cat._id === category)?.name || "";
  const selectedSubCategory =
    productData
      .find((sc) => sc._id === superCategory)
      ?.categories.find((cat) => cat._id === category)
      ?.subCategories.find((sub) => sub._id === subCategory)?.name || "";
  // Load saved form data when the component mounts
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("savedProductForm"));
    if (savedData) {
      setProductName(savedData.productName);
      setProductBrand(savedData.productBrand);
      setSuperCategory(savedData.selectedSuperCategory);
      setCategory(savedData.selectedCategory);
      setSubCategory(savedData.selectedSubCategory);
      setNoOfUnits(savedData.numberOfUnits);
      setSiUnits(savedData.siUnits);
      setUnitWeight(savedData.unitWeight);
      setNetWeight(savedData.netWeight);
      setGrossWeight(savedData.grossWeight);
      setDescription(savedData.description);
      setNutrition(savedData.nutrition);
      setIngredients(savedData.ingredients);
      setDietary(savedData.dietary);
      setStorage(savedData.storage);
      setOrigin(savedData.origin);
      setFiles(savedData.files || []);
    }
  }, []);

  useEffect(() => {
    if (superCategory && category && subCategory) {
      setProductIdPrefix(`${superCategory}-${category}-${subCategory}`);
    }
  }, [superCategory, category, subCategory]);

  useEffect(() => {
    if (noOfUnits && unitWeight) {
      setNetWeight(noOfUnits * unitWeight);
    }
  }, [noOfUnits, unitWeight]);

  const handleFileChange = (e) => {
    // Append new files to the existing ones in the state
    setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
  };

  const handleRemoveFile = (index) => {
    // Remove the file by index
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };


  const handleNutritionChange = (e) => {
    const { name, value } = e.target;
    setNutrition({ ...nutrition, [name]: value });
  };

  const handleSave = () => {
    // Save the form data in local storage
    const formData = {
      productName,
      productBrand,
      selectedSuperCategory,
      selectedCategory,
      selectedSubCategory,
      noOfUnits,
      siUnits,
      unitWeight,
      netWeight,
      grossWeight,
      description,
      nutrition,
      ingredients,
      dietary,
      storage,
      origin,
      files,
    };
    localStorage.setItem("savedProductForm", JSON.stringify(formData));
    alert("Form saved! You can edit and submit later.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productBrand", productBrand);
    formData.append("superCategory", selectedSuperCategory);
    formData.append("category", selectedCategory);
    formData.append("subCategory", selectedSubCategory);
    formData.append("numberOfUnits", noOfUnits);
    formData.append("siUnits", siUnits);
    formData.append("unitWeight", unitWeight);
    formData.append("netWeight", netWeight);
    formData.append("grossWeight", grossWeight);
    formData.append("productDescription", description);
    formData.append("calories", nutrition.calories);
    formData.append("fat", nutrition.fat);
    formData.append("saturatedFat", nutrition.saturatedFat);
    formData.append("carbs", nutrition.carbs);
    formData.append("fibre", nutrition.fibre);
    formData.append("sugar", nutrition.sugar);
    formData.append("protein", nutrition.protein);
    formData.append("salt", nutrition.salt);
    formData.append("ingredients", ingredients);
    formData.append("dietary", dietary);
    formData.append("storage", storage);
    formData.append("origin", origin);
    formData.append("productIdPrefix", productIdPrefix);
    formData.append("addedBy", data.info.name);
    files.forEach((file) => {
      formData.append("uploadImage", file);
    });

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/registerProduct",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


      if (response.status === 200) {
        console.log(response)
        alert("Product created successfully");
        localStorage.removeItem("savedProductForm"); // Clear saved form data after submission
        // Reset the form fields
        setProductName("");
        setProductBrand("");
        setSuperCategory("");
        setCategory("");
        setSubCategory("");
        setNoOfUnits("");
        setSiUnits("");
        setUnitWeight("");
        setNetWeight("0");
        setGrossWeight("");
        setDescription("");
        setNutrition({
          calories: "",
          fat: "",
          saturatedFat: "",
          carbs: "",
          fibre: "",
          sugar: "",
          protein: "",
          salt: "",
        });
        setIngredients("");
        setDietary("");
        setStorage("");
        setOrigin("");
        setProductIdPrefix("");
        setFiles([]);
      } else {
        alert("Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("There was an error creating the product");
    }
  };

  const getCategories = (superCategoryId) => {
    const superCategoryData = productData.find(
      (data) => data._id === superCategoryId
    );
    return superCategoryData ? superCategoryData.categories : [];
  };

  const getSubCategories = (superCategoryId, categoryId) => {
    const superCategoryData = productData.find(
      (data) => data._id === superCategoryId
    );
    if (!superCategoryData) return [];
    const categoryData = superCategoryData.categories.find(
      (cat) => cat._id === categoryId
    );
    return categoryData ? categoryData.subCategories : [];
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <>
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        alignItems="flex-start"
        width="100%"
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
            Product Name
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={2}
            width="100%"
          >
            
          <Input type="text" disableUnderline value={productName} onChange={(e)=> setProductName(e.target.value)} sx={{borderBottom:'2px solid gray',color:'white'}}/>
          </Box>
        </Box>
        
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
          width="50%"
          sx={{
            px: { xs: 2, md: 4 },
            bgcolor: 'rgba(38,38,38,0.5)', // Equivalent to bg-opacity-50
          }}
        >
          <Typography variant="h6" color="white">
            Product Brand
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={2}
            width="100%"
          >
            <Input type="text" disableUnderline value={productBrand}
          onChange={(e) => setProductBrand(e.target.value)}
          sx={{borderBottom:'2px solid gray',color:'white'}}/>
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
          marginTop:'20px'
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
          width="50%"
          sx={{
            px: { xs: 2, md: 4 },
            bgcolor: 'rgba(38,38,38,0.5)', // Equivalent to bg-opacity-50
          }}
        >
          <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel
                id="demo-simple-select-filled-label"
                style={{ color: "white" }}
              >
                Super Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                bgcolor="neutral.800"
                borderColor="neutral.800"
                style={{color:'white'}}
                disableUnderline
                value={superCategory}
                onChange={(e) => {
                  setSuperCategory(e.target.value);
                  setCategory(""); // Reset category and subcategory when supercategory changes
                  setSubCategory("");
                }}
              >
                {productData.map((sc) => (
                  <MenuItem key={sc._id} value={sc._id}>
                    {sc.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

        </Box>

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
    
          width="50%"
          sx={{
            px: { xs: 2, md: 4 },
            bgcolor: 'rgba(38,38,38,0.5)', // Equivalent to bg-opacity-50
          }}
        >
          <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel
                id="demo-simple-select-filled-label"
                style={{ color: "white" }}
              >
                Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                bgcolor="neutral.800"
                borderColor="neutral.800"
                style={{color:'white'}}
                disableUnderline
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubCategory(""); // Reset subcategory when category changes
                }}
                disabled={!superCategory}
              >
                {getCategories(superCategory).map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        </Box>
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
          width="50%"
          sx={{
            px: { xs: 2, md: 4 },
            bgcolor: 'rgba(38,38,38,0.5)', // Equivalent to bg-opacity-50
          }}
        >
          <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel
                id="demo-simple-select-filled-label"
                style={{ color: "white" }}
                variant="h1"
              >
                Sub Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                bgcolor="neutral.800"
                borderColor="neutral.800"
                style={{color:'white'}}
                value={subCategory}
                disableUnderline
                onChange={(e) => setSubCategory(e.target.value)}
                disabled={!category}
              >
                {getSubCategories(superCategory, category).map((sub) => (
                  <MenuItem key={sub._id} value={sub._id}>
                    {sub.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
          marginTop:'20px'
        }}
      >
        <Box
          height={'81px'}
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
          width="50%"
          sx={{
            px: { xs: 2, md: 4 },
            bgcolor: 'rgba(38,38,38,0.5)', // Equivalent to bg-opacity-50
          }}
        >
          <FormControl variant="filled">
              <InputLabel
                id="demo-simple-select-filled-label"
                style={{ color: "white" }}
                size="medium"
              >
                Select SI Unit
              </InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                bgcolor="neutral.800"
                borderColor="neutral.800"
                style={{color:'white'}}
                value={siUnits}
                disableUnderline
                onChange={(e) => setSiUnits(e.target.value)}
              >
                <MenuItem value={"Kilograms"}>Kilograms</MenuItem>
                <MenuItem value={"Grams"}>Grams</MenuItem>
                <MenuItem value={"Litres"}>Litres</MenuItem>
                <MenuItem value={"Milli Litres"}>Milli Litres</MenuItem>
                
              </Select>
            </FormControl>

        </Box>

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
            Number of Units
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={2}
            width="100%"
          >
            <Input  type="number" disableUnderline value={noOfUnits}
          onChange={(e) => setNoOfUnits(e.target.value)}
          sx={{borderBottom:'2px solid gray',color:'white'}}/>
          
          </Box>
        </Box>

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
            Unit Weight
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={2}
            width="100%"
          >
            <Input type="number" disableUnderline value={unitWeight}
          onChange={(e) => setUnitWeight(e.target.value)}
          sx={{borderBottom:'2px solid gray',color:'white'}}/>
          
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
          marginTop:'20px'
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
            Net Weight
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={2}
            width="100%"
          >
            <Input type="text" disableUnderline value={netWeight}
          onChange={(e) => setNetWeight(e.target.value)}
          sx={{borderBottom:'2px solid gray',color:'white'}}/>
          
          </Box>
        </Box>
        
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
          width="50%"
          sx={{
            px: { xs: 2, md: 4 },
            bgcolor: 'rgba(38,38,38,0.5)', // Equivalent to bg-opacity-50
          }}
        >
          <Typography variant="h6" color="white">
            Gross Weight
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={2}
            width="100%"
          >
            <Input type="number" disableUnderline value={grossWeight}
          onChange={(e) => setGrossWeight(e.target.value)}
          sx={{borderBottom:'2px solid gray',color:'white'}}/>
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
          marginTop:'20px'
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
            Description
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={2}
            width="100%"
          >
            <textarea type="text" value={description}
          onChange={(e) => setDescription(e.target.value)}
           style={{backgroundColor:"black" ,color:'white',height:'100px',width:'100%',placeholder:'type here'}} />
          
          </Box>
        </Box>
        
        
      </Box>

      

        <Grid
          item
          xs={12}
          marginTop={'20px'}
        >
          <Typography
            style={{ color: "white", fontSize: "25px" }}
          >
            <strong>Nutrition</strong>
          </Typography>
        </Grid>
        
        <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        alignItems="flex-start"
        width="100%"
        sx={{
          maxWidth: { xs: '100%', md: 'auto' },
          marginTop:'20px'
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
          width="50%"
          sx={{
            px: { xs: 2, md: 4 },
            bgcolor: 'rgba(38,38,38,0.5)', // Equivalent to bg-opacity-50
          }}
        >
          <Typography variant="h6" color="white">
            Calories
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={2}
            width="100%"
          >
            <Input type="number" disableUnderline name="calories"
          value={nutrition.calories}
          onChange={handleNutritionChange} sx={{borderBottom:'2px solid gray',color:'white'}}/>
          </Box>
        </Box>  
      

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
            Fat
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={2}
            width="100%"
          >
            <Input type="number" disableUnderline name="fat"
          value={nutrition.fat}
          onChange={handleNutritionChange} sx={{borderBottom:'2px solid gray',color:'white'}}/>
          
          </Box>
        </Box>

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
            Saturated Fat
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={2}
            width="100%"
          >
            <Input type="number" disableUnderline name="saturatedFat"
          value={nutrition.saturatedFat}   onChange={handleNutritionChange}
          sx={{borderBottom:'2px solid gray',color:'white'}}/>
          
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
          marginTop:'20px'
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
          width="50%"
          sx={{
            px: { xs: 2, md: 4 },
            bgcolor: 'rgba(38,38,38,0.5)', // Equivalent to bg-opacity-50
          }}
        >
          <Typography variant="h6" color="white">
            Carbs
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={2}
            width="100%"
          >
            <Input type="number" disableUnderline name="carbs"
          value={nutrition.carbs}
          onChange={handleNutritionChange} sx={{borderBottom:'2px solid gray',color:'white'}}/>
          </Box>
        </Box>  
      

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
            Fibre
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={2}
            width="100%"
          >
            <Input type="number" disableUnderline name="fibre"
          value={nutrition.fibre}
          onChange={handleNutritionChange} sx={{borderBottom:'2px solid gray',color:'white'}}/>
          
          </Box>
        </Box>

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
            Sugar
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={2}
            width="100%"
          >
            <Input type="number" disableUnderline name="sugar"
          value={nutrition.sugar}
          onChange={handleNutritionChange} sx={{borderBottom:'2px solid gray',color:'white'}}/>
          
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
          marginTop:'20px'
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
          width="50%"
          sx={{
            px: { xs: 2, md: 4 },
            bgcolor: 'rgba(38,38,38,0.5)', // Equivalent to bg-opacity-50
          }}
        >
          <Typography variant="h6" color="white">
            Protein
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={2}
            width="100%"
          >
            <Input disableUnderline type="number" name="protein"
          value={nutrition.protein}
          onChange={handleNutritionChange} sx={{borderBottom:'2px solid gray',color:'white'}}/>
          </Box>
        </Box>  
      

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
            Salt
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={2}
            width="100%"
          >
            <Input type="number" disableUnderline name="salt"
          value={nutrition.salt}
          onChange={handleNutritionChange} sx={{borderBottom:'2px solid gray',color:'white'}}/>
          
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
          marginTop:'20px'
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
            Ingredients
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={2}
            width="100%"
          >
            <textarea type="text" value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
 style={{backgroundColor:"black" ,color:'white',height:'100px',width:'100%',placeholder:'type here'}} />
          
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
          marginTop:'20px'
        }}
      >
          <Box
          height={'81px'}
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
          width="50%"
          sx={{
            px: { xs: 2, md: 4 },
            bgcolor: 'rgba(38,38,38,0.5)', // Equivalent to bg-opacity-50
          }}
        >
          <FormControl variant="filled">
              <InputLabel
                id="demo-simple-select-filled-label"
                style={{ color: "white" }}
              >
                Select Dietary
              </InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                bgcolor="neutral.800"
                borderColor="neutral.800"
                style={{color:'white'}}
                value={dietary}
                disableUnderline
                onChange={(e) => setDietary(e.target.value)}
              >
                <MenuItem value={"Vegan"}>Vegan</MenuItem>
                <MenuItem value={"Vegetarain"}>Vegetarian</MenuItem>
                <MenuItem value={"Lactose Free"}>Lactose Free</MenuItem>
                <MenuItem value={"Gluten Free"}>Gluten Free</MenuItem>
                <MenuItem value={"Non Vegetarian"}>Non Vegetarian</MenuItem>
              </Select>
            </FormControl>

        </Box>

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
            Storage
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={2}
            width="100%"
          >
            <Input type="text" disableUnderline value={storage}
          onChange={(e) => setStorage(e.target.value)}
          sx={{borderBottom:'2px solid gray',color:'white'}}/>
          
          </Box>
        </Box>
<Box
          height={'81px'}
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
          width="50%"
          sx={{
            px: { xs: 2, md: 4 },
            bgcolor: 'rgba(38,38,38,0.5)', // Equivalent to bg-opacity-50
          }}
        >
          <FormControl variant="filled">
               <InputLabel
                id="demo-simple-select-filled-label"
                style={{ color: "white" }}
              >
                Select a Country
              </InputLabel> 
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                bgcolor="neutral.800"
                borderColor="neutral.800"
                style={{color:'white'}}
                value={origin}
                disableUnderline
                onChange={(e) => setOrigin(e.target.value)}
              >
                <MenuItem value="Select a country">Select a Country</MenuItem>

                {countries.map((country, index) => (
                  <MenuItem key={index} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
          marginTop:'20px'
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
            Product Id Prefix
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={2}
            width="100%"
          >
            <Input type="text" disableUnderline value={productIdPrefix} readonly sx={{borderBottom:'2px solid gray',color:'white'}}/>
          
          </Box>
        </Box>
        
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
          width="50%"
          sx={{
            px: { xs: 2, md: 4 },
            bgcolor: 'rgba(38,38,38,0.5)', // Equivalent to bg-opacity-50
          }}
        >
          <Typography variant="h6" color="white">
            Added By
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mt={2}
            width="100%"
          >
            <Input type="text" disableUnderline sx={{borderBottom:'2px solid gray',color:'white'}} value={data.info.name} readOnly/>
          </Box>
        </Box>
      </Box>

      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        marginLeft={'300px'}
        width="20%"
        sx={{
          maxWidth: { xs: '100%', md: 'auto' },
          marginTop:'20px'
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
          width="20%"
          sx={{
            px: { xs: 2, md: 4 },
            bgcolor: 'rgba(38,38,38,0.5)', // Equivalent to bg-opacity-50
          }}
        >
          <Button
            component="label"
            variant="contained"
            borderRadius={1}
            border="1px solid"
            bgcolor="neutral.800"
            borderColor="neutral.800"
            height='50px'
            style={{
              backgroundColor:"black",
              color: "white",
            }}
          >
            Upload 
            <VisuallyHiddenInput type="file" multiple
                onChange={handleFileChange}
                name="uploadImage"
                />
          </Button>
          
        </Box>
        
        
      </Box>

      <Box
  display="flex"
  flexWrap="wrap"
  gap={2}
  width="100%"
  mt={2}
>
  {files.map((file, index) => (
    <Box key={index} position="relative">
      <img
        src={URL.createObjectURL(file)} // Ensure that `file` is a valid File object here
        alt={`Preview ${index}`}
        style={{
          width: '100px',
          height: '100px',
          objectFit: 'cover',
          borderRadius: '8px',
        }}
        onLoad={() => URL.revokeObjectURL(file)} // Clean up the object URL after it's loaded
      />
      <IconButton
        onClick={() => handleRemoveFile(index)}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          color: 'red',
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  ))}
</Box>



        <Grid container marginTop={'20px'} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item sx={4}>
            <Button
              variant="contained"
              onClick={handleSave}
              style={{
                backgroundColor: "black",
                color: "white",
                marginLeft: "285px",
              }}
            >
              Save
            </Button>
          </Grid>
          <Grid item sx={4}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              style={{ backgroundColor: "black", color: "white" }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
    
    </>
  );
};

export default ProductForm;
