import axios from 'axios';

const API_BASE_URL_GET = 'http://localhost:3001/api/get-carousel';
const API_BASE_URL_ADD = 'http://localhost:3001/api/add-carousel';
const API_BASE_URL_DEL = 'http://localhost:3001/api/delete-carousel/';
const API_BASE_URL_UPD = 'http://localhost:3001/api/update-carouselaccueil/';

/**
 * Fetch all carousel items.
 */
export const FetchAllCarouselItems = async () => {
    try {
        const response = await axios.get(API_BASE_URL_GET);
        return response.data;
    } catch (error) {
        console.error("Error fetching carousel data:", error);
        throw error;
    }
};


/**
 * Add a new carousel item.
 * @param {Object} dataToSave - The carousel item to add.
 */
export const AddCarouselItem = async (dataToSave) => {
    try {
        const response = await axios.post(API_BASE_URL_ADD, dataToSave);
        return response.data;
    } catch (error) {
        console.error('Error adding carousel item:', error);
        throw error;
    }
};


/**
 * Update a carousel item by its MongoDB _id.
 * @param {string} id - The _id of the carousel item to update.
 * @param {Object} updatedData - The updated data for the carousel item.
 */
export const UpdateCarouselItem = async (id, updatedData) => {
    try {
        const response = await axios.put(`${API_BASE_URL_UPD}${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating carousel item:', error);
        throw error;
    }
};

/**
 * Delete a carousel item by its MongoDB _id.
 * @param {string} id - The _id of the carousel item to delete.
 */
export const DeleteCarouselItem = async (id) => {
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