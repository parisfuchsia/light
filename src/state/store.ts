import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.ts';
import themeReducer from './themeSlice.ts';

const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer
  }
})

export default store;