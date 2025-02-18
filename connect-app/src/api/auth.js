import axiosInstance from "./axiosInstance";

// Create an Account
export async function createAccount(email, password, birthday, accountType) {
  return axiosInstance.post('/auth/account', {
    email,
    password,
    dob: birthday,
    account_type: accountType,
  });
}

// Login to Account
export async function login(email, password) {
    return axiosInstance.post('/auth/account/login', {
        email,
        password,
    });
}

// Logout of Account
export async function logout() {
    return axiosInstance.post('/auth/account/logout');
}