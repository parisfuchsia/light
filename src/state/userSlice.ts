import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: {},
  loading: false,
  error: false
}

export const fetchUser = createAsyncThunk("fetchUser", async(_, thunkAPI) => {
  try {
    const res = await axios.get("http://localhost:8520/checksession", {
    withCredentials: true
    } )
    
    
    return res?.data?.user;
  }catch(e){
    
    return thunkAPI.rejectWithValue("Rejected");
  }
})

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers:{
    reset() {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
      state.user = {};
      state.error = false;
    }) 
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action?.payload;
      state.error = false;
      state.loading = false;
    }) 
    builder.addCase(fetchUser.rejected, (state) => {
      state.error = true;
      state.loading = false;
      
    }) 
  }
})

export default userSlice.reducer;
export const { reset } = userSlice.actions;