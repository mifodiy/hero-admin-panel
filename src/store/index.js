
import { configureStore } from '@reduxjs/toolkit';

import heroes from '../components/heroesList/heroesSlice'
import filters from '../components/heroesFilters/filtersSlice'

const store = configureStore({
  reducer: {heroes, filters },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
})

export default store;