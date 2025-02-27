import axiosInstance from "./axiosInstance";

// Upload Message
export async function uploadMessage(message) {
    return axiosInstance.put('/api/database/firestore/messages', {
        message,
    });
}

// Get Message
export async function getMessage(last_message_id, limit) {
    return axiosInstance.get('/api/database/firestore/messages', {
        params: {
            last_message_id,
            limit,
        },
    });
}