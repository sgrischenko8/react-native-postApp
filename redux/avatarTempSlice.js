import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'avatarTemp',
  storage: AsyncStorage,
};

const avatarTempSlice = createSlice({
  name: 'avatarTemp',
  initialState: {
    avatarTemp: './a.jpg',
  },
  reducers: {
    setAvatarTemp(state, action) {
      state.avatarTemp = action.payload;
    },
  },
});

export const { setAvatarTemp } = avatarTempSlice.actions;

export const persistedAvatarTempReducer = persistReducer(
  persistConfig,
  avatarTempSlice.reducer
);

export const avatarTempReducer = avatarTempSlice.reducer;
