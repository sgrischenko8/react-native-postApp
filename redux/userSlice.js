import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { authorization, db } from '../config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { Alert } from 'react-native';

import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import date from 'date-and-time';
import uk from 'date-and-time/locale/uk';

date.locale(uk);

const collectionName = 'users';

export const usersApi = createApi({
  reducerPath: 'user',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['User'],
  endpoints: builder => ({
    register: builder.mutation({
      async queryFn({ login, email, password, avatarTemp }) {
        try {
          await createUserWithEmailAndPassword(authorization, email, password);

          await updateProfile(authorization.currentUser, {
            displayName: login,
            photoURL: avatarTemp,
          });
          return { data: null };
        } catch (error) {
          if (error.code === 'auth/email-already-in-use') {
            Alert.alert(
              'Ця пошта вже була зареєстрована раніше',
              '',
              [
                {
                  text: 'Зрозуміло',
                  style: 'cancel',
                },
              ],
              {
                cancelable: true,
              }
            );

            return { error: 'registration failed' };
          }
        }
      },
      invalidatesTags: ['User'],
    }),
    addUser: builder.mutation({
      async queryFn({ login, email, theme, avatarTemp }) {
        try {
          await setDoc(doc(db, collectionName, email.toLowerCase()), {
            login,
            email,
            photoURL: avatarTemp,
            theme: theme,
          });

          return { data: null };
        } catch (e) {
          console.error('Error adding document: ', e);
          return { error };
        }
      },
      invalidatesTags: ['User'],
    }),
    login: builder.mutation({
      async queryFn(data) {
        const { email: userEmail, password: userPassword } = data;
        try {
          await signInWithEmailAndPassword(
            authorization,
            userEmail,
            userPassword
          );

          return { data: 'success' };
        } catch (error) {
          if (error.code === 'auth/invalid-login-credentials') {
            return { error: 'invalid-login-credentials' };
          }
          return { error: 'login failed' };
        }
      },
      invalidatesTags: ['User'],
    }),
    logout: builder.mutation({
      async queryFn() {
        console.log('in slice logout');
        try {
          await signOut(authorization);

          return { data: 'success' };
        } catch (error) {
          console.log(error);
          return { error: 'logout failed' };
        }
      },
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      async queryFn(img) {
        try {
          await updateProfile(authorization.currentUser, { photoURL: img });
          return { data: null };
        } catch (error) {
          console.log(error);
          return { error };
        }
      },
      invalidatesTags: ['User'],
    }),
    updateUserTheme: builder.mutation({
      async queryFn({ theme }) {
        const check = authorization.currentUser;
        if (check === null) {
          return { data: '' };
        }
        try {
          const userRef = doc(
            db,
            collectionName,
            authorization.currentUser?.email
          );

          await updateDoc(userRef, {
            theme,
          });

          return { data: '' };
        } catch (error) {
          console.log(error);
          return { error };
        }
      },
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useAddUserMutation,
  useLoginMutation,
  useLogoutMutation,
  useUpdateUserMutation,
  useUpdateUserThemeMutation,
} = usersApi;
