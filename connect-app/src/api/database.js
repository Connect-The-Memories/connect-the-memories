import axiosInstance from "./axiosInstance";

// Firestore API
// Upload Message
export async function uploadMessages(messages, mainUserID) {
    return axiosInstance.put('/database/firestore/messages', {
        messages,
        main_user_id: mainUserID,
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

// Get Linked Accounts
export async function getLinkedAccounts() {
    return axiosInstance.get('/database/firestore/linked_accounts');
}


// Firebase Cloud Storage API
// Upload IMG/VID/TXT