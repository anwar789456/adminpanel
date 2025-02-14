import axios from 'axios';

const API_BASE_URL_GET = 'http://localhost:3001/api/get-category';
const API_BASE_URL_ADD = 'http://localhost:3001/api/add-category';
const API_BASE_URL_DEL = 'http://localhost:3001/api/delete-category/';
const API_BASE_URL_UPD = 'http://localhost:3001/api/update-category/';


// const API_BASE_URL_GET = 'https://www.samethome.com/api/get-category';
// const API_BASE_URL_ADD = 'https://www.samethome.com/api/add-category';
// const API_BASE_URL_DEL = 'https://www.samethome.com/api/delete-category/';
// const API_BASE_URL_UPD = 'https://www.samethome.com/api/update-category/';



/**
 * Fetch all Category items.
 */
export const FetchAllCategoryItems = async () => {
    try {
        const response = await axios.get(API_BASE_URL_GET);
        return response.data;
    } catch (error) {
        console.error("Error fetching Category data:", error);
        throw error;
    }
};


/**
 * Add a new Category item.
 * @param {Object} dataToSave - The Category item to add.
 */
export const AddCategoryItem = async (dataToSave) => {
    try {
        const response = await axios.post(API_BASE_URL_ADD, dataToSave);
        return response.data;
    } catch (error) {
        console.error('Error adding Category item:', error);
        throw error;
    }
};


/**
 * Update a Category item by its MongoDB _id.
 * @param {string} id - The _id of the Category item to update.
 * @param {Object} updatedData - The updated data for the Category item.
 */
export const UpdateCategoryItem = async (id, updatedData) => {
    try {
        const response = await axios.put(`${API_BASE_URL_UPD}${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating Category item:', error);
        throw error;
    }
};

/**
 * Delete a Category item by its MongoDB _id.
 * @param {string} id - The _id of the Category item to delete.
 */
export const DeleteCategoryItem = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL_DEL}${id}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response.data);
            throw new Error(error.response.data.message || 'Failed to delete item');
        } else if (error.request) {
            console.error('Error request:', error.request);
            throw new Error('No response from server');
        } else {
            console.error('Error message:', error.message);
            throw new Error('Error setting up request');
        }
    }
};