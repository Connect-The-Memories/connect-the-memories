import axiosInstance from "./axiosInstance";

// Firestore API
// Upload Message
export async function uploadMessages(messages, mainUserName) {
    return axiosInstance.put('/database/firestore/messages', {
        messages,
        main_user_name: mainUserName,
    });
}

// Get Message
export async function getMessage() {
    return axiosInstance.get('/database/firestore/messages');
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

// Get Linked Accounts
export async function getLinkedAccounts() {
    return axiosInstance.get('/database/firestore/linked_accounts');
}

// Get n amount of Randomized IMG/VID/TXT
export async function getRandomizedMedia(count=1) {
    return axiosInstance.get('/database/firestore/media/random_indexed', {
        params: { count },
    }); 
}

// Firebase Cloud Storage API
// Upload IMG/VID/TXT
export async function uploadMedia(formData) {
    return axiosInstance.post('/database/firebase_storage/media', formData);
}

// Get all IMG/VID/TXT
export async function getMedia() {
    return axiosInstance.get('/database/firebase_storage/media');
}