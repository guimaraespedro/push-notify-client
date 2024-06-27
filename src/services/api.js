import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    Promise.reject(error);
  }
});

export const createUserInfo = async ({ id, name, email }) => {
  return api
    .post("/users/create", {
      id,
      name,
      email,
    })
    .catch((error) => Promise.reject(error));
};

export const getUserInfo = async (id) => {
  return api.get(`/users/${id}`).catch((error) => Promise.reject(error));
};

export const registerDeviceForNotifications = async (userId, deviceToken) => {
  return api
    .post(`/push/register-to-notification`, { userId, deviceToken })
    .catch((error) => Promise.reject(error));
};

export const sendNotification = async (
  title,
  content,
  receiverUserId,
  senderUserId
) => {
  return api
    .post("/push/send", {
      title,
      content,
      receiverUserId,
      senderUserId,
    })
    .catch((error) => Promise.reject(error));
};

export const getAllFriends = async () => {
  return api.get("/users/all").catch((error) => Promise.reject(error));
};
