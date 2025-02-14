import axios from 'axios';

const API_BASE_URL_GET = 'http://localhost:3001/api/get-chat-from-database';

/**
 * Fetch all chat items.
 */
export const FetchAllChatItems = async () => {
    try {
        const response = await axios.get(API_BASE_URL_GET);
        return response.data;
    } catch (error) {
        console.error("Error fetching commande data:", error);
        throw error;
    }
};
