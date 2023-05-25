import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";

import {useHttp} from '../../hooks/http.hook';
import store from "../../store";



const heroesAdapter = createEntityAdapter();

const initialState = heroesAdapter.getInitialState({
  heroesLoadingStatus: 'idle'
})

export const heroesFetch = createAsyncThunk(
  'heroes/heroesFetch',
  () => {
    const { request } = useHttp();
    return request("http://localhost:3001/heroes")
  }
)

const heroesSlice = createSlice({
  name: 'heroes',
  initialState,
  reducers: {
    heroesRemove: (state, action) => {
      heroesAdapter.removeOne(state, action.payload)
    },
    heroesAdd: (state, action) => {
      heroesAdapter.addOne(state, action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(heroesFetch.pending, state => {state.heroesLoadingStatus = 'loading'})
      .addCase(heroesFetch.fulfilled, (state, action) => {
        state.heroesLoadingStatus = 'idle';
        heroesAdapter.setAll(state, action.payload);
      })
      .addCase(heroesFetch.rejected, state => {state.heroesLoadingStatus = 'error'})
  }
})

const {actions, reducer} = heroesSlice;


export const {selectAll} = heroesAdapter.getSelectors((state) => state.heroes);

export const {
  heroesRemove,
  heroesAdd
} = actions;

export default reducer;
