// Для роботи із firebase обовʼязково треба ініціалізувати проект
import { initializeApp } from 'firebase/app';
// Функція для підключення авторизації в проект
import { getAuth } from 'firebase/auth';
// Функція для підключення бази даних у проект
import { getFirestore } from 'firebase/firestore';
// Функція для підключення сховища файлів в проект
import { getStorage } from 'firebase/storage';

import Config from 'react-native-config';

// ----------part of tips:-------------
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: `${Config.APP_ID}`,
  authDomain: `${Config.AUTH_DOMAIN}`,
  databaseURL: `${Config.DATA_BASE_URL}`,
  projectId: `${Config.PROJECT_ID}`,
  storageBucket: `${Config.STORAGE_BUCKET}`,
  messagingSenderId: `${Config.MESSAGING_SENDER_ID}`,
  appId: `${Config.APP_ID}`,
  measurementId: `${Config.MEASURMENT_ID}`,
};

const app = initializeApp(firebaseConfig);

// export const authorization = getAuth(app);
export const authorization = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
export const dbStorage = getStorage(app);
