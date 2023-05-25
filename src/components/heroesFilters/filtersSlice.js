import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {useHttp} from '../../hooks/http.hook';

const initialState = {
  filters: [],
  filtersLoadingStatus: 'idle',
  activeFilter: 'all',
}

export const filterFetch = createAsyncThunk(
  'filters/filterFetch',
  () => {
    const { request } = useHttp();
    return request("http://localhost:3001/filters")
  }
)

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    changeFilter: (state, action) => {
      state.activeFilter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(filterFetch.pending, state => {state.filtersLoadingStatus = 'loading'})
      .addCase(filterFetch.fulfilled, (state, action) => {
        state.filters = action.payload;
        state.filtersLoadingStatus = 'idle';
      })
      .addCase(filterFetch.rejected, state => {state.filtersLoadingStatus = 'error'})
  }
})

const {actions, reducer} = filtersSlice;


export default reducer;
export const {
  changeFilter
} = actions