import axiosInstance from "./axiosInstance";

// Upload Message
export async function uploadMessage(message) {
    return axiosInstance.put('/database/firestore/messages', {
        message,
    });
}

// Get Message
export async function getMessage(last_message_id, limit) {
    return axiosInstance.get('/database/firestore/messages', {
        params: {
            last_message_id,
            limit,
        },
    });
}

// Generate OTP
export async function generateOTP() {
    return axiosInstance.post('/database/firestore/otp');
}

// Validate OTP
export async function validateOTP(code) {
    return axiosInstance.put('/database/firestore/otp', {
        otp: code,
    });
}