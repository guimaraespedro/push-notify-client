import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { getApp } from "firebase/app";
import { registerDeviceForNotifications } from "../services/api";

export const configureFirebase = async () => {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  };

  // Initialize Firebase
  initializeApp(firebaseConfig);
};

export const configureFCM = async (userId) => {
  try {
    const app = getApp();
    const messaging = getMessaging(app);
    const deviceToken = await getToken(
      messaging,
      process.env.REACT_APP_PUBLIC_KEY
    );
    await registerDeviceForNotifications(userId, deviceToken);
  } catch (err) {
    console.error(err);
  }
};
