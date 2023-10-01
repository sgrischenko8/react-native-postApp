// Для роботи із firebase обовʼязково треба ініціалізувати проект
import { initializeApp } from 'firebase/app';
// Функція для підключення авторизації в проект
import { getAuth } from 'firebase/auth';
// Функція для підключення бази даних у проект
import { getFirestore } from 'firebase/firestore';
// Функція для підключення сховища файлів в проект
import { getStorage } from 'firebase/storage';

// ----------part of tips:-------------
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCZrhbQ9LB44cRloTUP1MlkGC8XOneAaEw',
  authDomain: 'project-47869.firebaseapp.com',
  databaseURL: 'https://project-47869.firebaseio.com',
  projectId: 'project-47869',
  storageBucket: 'project-47869.appspot.com',
  messagingSenderId: '778680888352',
  appId: '1:778680888352:android:580073d17cc8e1f01ca045',
  measurementId: 'G-measurement-id',
};

const app = initializeApp(firebaseConfig);

// export const authorization = getAuth(app);
export const authorization = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
export const dbStorage = getStorage(app);
