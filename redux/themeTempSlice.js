import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDefaultTheme } from '../utils/getDefaultTheme';

const persistConfig = {
  key: 'themeTemp',
  storage: AsyncStorage,
};

let themePreferance = getDefaultTheme();

const themeTempSlice = createSlice({
  name: 'themeTemp',
  initialState: {
    themeTemp: themePreferance,
  },
  reducers: {
    setThemeTemp(state, action) {
      state.themeTemp = action.payload;
    },
  },
});

export const { setThemeTemp } = themeTempSlice.actions;

export const persistedThemeTempReducer = persistReducer(
  persistConfig,
  themeTempSlice.reducer
);

export const themeTempReducer = themeTempSlice.reducer;
