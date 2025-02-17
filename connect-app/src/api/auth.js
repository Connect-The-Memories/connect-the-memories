import axiosInstance from "./axiosInstance";

export async function createAccount(email, password, birthday, accountType) {
  return axiosInstance.post('/auth/create_account', {
    email,
    password,
    dob: birthday,
    account_type: accountType,
  });
}

export async function login(email, password) {
    return axiosInstance.post('/auth/logging_in', {
        email,
        password,
    });
}