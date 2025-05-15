// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { sliceConfig } from './sliceConfig';
import { buildSlicesFromConfig } from './dynamicSliceBuilder';

const { reducers, allThunks, allActions } = buildSlicesFromConfig(sliceConfig);

export const store = configureStore({
  reducer: reducers,
});

export const RTK = {
  thunks: allThunks,
  actions: allActions,
};
