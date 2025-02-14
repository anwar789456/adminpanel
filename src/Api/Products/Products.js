import axios from 'axios';
const API_BASE_URL_GET = 'http://localhost:3001/api/get-products';
const API_BASE_URL_DEL = 'http://localhost:3001/api/delete-product/';
const API_BASE_URL_UPDATE = 'http://localhost:3001/api/update-product/';
const API_BASE_URL_ADD = 'http://localhost:3001/api/add-product';
// Fetch all products
export const FetchAllProductItems = async () => {
  try {
    const response = await axios.get(API_BASE_URL_GET);
    return response.data;
  } catch (error) {
    console.error('Error finding products:', error);
    throw error;
  }
};
// Delete a product by its _id
export const DeleteProductById = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL_DEL}${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw error;
  }
};
// Update a product by its _id
export const UpdateProductById = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL_UPDATE}${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw error;
  }
};
// Function to add a new product
export const addProduct = async (newProductData) => {
  try {
    const response = await axios.post(API_BASE_URL_ADD, newProductData);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};