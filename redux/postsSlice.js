import {
  collection,
  doc,
  updateDoc,
  getDocs,
  setDoc,
  arrayUnion,
} from 'firebase/firestore';
import { authorization, db } from '../config';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import date from 'date-and-time';
import uk from 'date-and-time/locale/uk';

date.locale(uk);

const collectionName = 'posts';

export const postsApi = createApi({
  reducerPath: 'posts',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Post'],
  endpoints: builder => ({
    fetchPosts: builder.query({
      async queryFn() {
        try {
          const snapshot = await getDocs(collection(db, 'posts'));
          const documents = [];
          snapshot.forEach(doc => {
            documents.push(doc.data());
          });

          const copy = [...documents].sort((b, a) => a.date - b.date);
          return { data: copy };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Post'],
    }),
    fetchUserPosts: builder.query({
      async queryFn(email) {
        try {
          const snapshot = await getDocs(collection(db, 'posts'));
          const documents = [];
          snapshot.forEach(doc => {
            if (doc.data()?.owner?.email === email) {
              documents.push(doc.data());
            }
          });

          const copy = [...documents].sort((b, a) => a.date - b.date);
          return { data: copy };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Post'],
    }),
    // fetchSinglePost: builder.query({
    //   async queryFn(id) {
    //     try {
    //       const docRef = doc(db, 'posts', id);
    //       const snapshot = await getDoc(docRef);
    //       return { data: snapshot.data() };
    //     } catch (error) {
    //       return { error };
    //     }
    //   },
    //   providesTags: ['Post'],
    // }),
    // fetchComments: builder.query({
    //   async queryFn(docId) {
    //     try {
    //       const docRef = doc(db, collectionName, docId);
    //       const docSnap = await getDoc(docRef);

    //       if (docSnap.exists()) {
    //         const data = docSnap.data().comments.reverse();

    //         return { data };
    //       }
    //     } catch (error) {
    //       console.log(error);
    //       return { error };
    //     }
    //   },
    //   providesTags: ['Post'],
    // }),
    addPost: builder.mutation({
      async queryFn({ photoSource, geolocation, title, location, owner }) {
        const date = Date.now();
        try {
          await setDoc(doc(db, collectionName, `${owner.email}-${date}`), {
            date: date,
            photoSource: photoSource || '',
            title: title || '',
            comments: [],
            likes: [],
            isLikesDisabled: false,
            location: location || '',
            geolocation: {
              latitude: geolocation?.latitude || null,
              longitude: geolocation?.longitude || null,
              country: geolocation?.country || '',
              region: geolocation?.region || '',
            },
            owner,
          });

          return { data: '' };
        } catch (e) {
          console.error('Error adding document: ', e);
          return { error };
        }
      },
      invalidatesTags: ['Post'],
    }),
    addComment: builder.mutation({
      async queryFn({ newComment, postId }) {
        try {
          const ref = doc(db, collectionName, postId);
          await updateDoc(ref, {
            comments: arrayUnion(newComment),
          });
          return { data: '' };
        } catch (error) {
          console.log(error);
          return { error };
        }
      },
      invalidatesTags: ['Post'],
    }),
    incrementLikes: builder.mutation({
      async queryFn(docId) {
        try {
          const likesRef = doc(db, collectionName, docId);

          await updateDoc(likesRef, {
            likes: arrayUnion(authorization.currentUser.email),
          });
          return { data: '' };
        } catch (error) {
          console.log(error);
          return { error };
        }
      },
      invalidatesTags: ['Post'],
    }),
  }),
});

export const {
  useFetchPostsQuery,
  useFetchUserPostsQuery,
  useAddPostMutation,
  useAddCommentMutation,
  useIncrementLikesMutation,
} = postsApi;
