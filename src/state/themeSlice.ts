import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: "light"
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers:{
    changeThemeTo: (state, action) => {
      state.theme = action.payload;
    }
  }
})

export default themeSlice.reducer;
export const { changeThemeTo } = themeSlice.actions;