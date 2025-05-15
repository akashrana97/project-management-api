// store/dynamicSliceBuilder.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';

export function createDynamicSlice(name, endpoints) {
  const thunks = {};
  const initialState = {
    data: {},
    loading: {},
    error: {},
  };
  const extraReducers = [];

  for (const [actionKey, { url, method = 'get' }] of Object.entries(endpoints)) {
    const thunk = createAsyncThunk(`${name}/${actionKey}`, async (args, { rejectWithValue }) => {
      try {
        const endpoint = typeof url === 'function' ? url(args) : url;
        const payload = ['post', 'put', 'patch'].includes(method) ? args : undefined;
        const { data } = await apiClient[method](endpoint, payload);
        return data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    });

    thunks[actionKey] = thunk;

    extraReducers.push((builder) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading[actionKey] = true;
          state.error[actionKey] = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading[actionKey] = false;
          state.data[actionKey] = action.payload;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading[actionKey] = false;
          state.error[actionKey] = action.payload;
        });
    });
  }

  const slice = createSlice({
    name,
    initialState,
    reducers: {
      reset: (state) => {
        state.data = {};
        state.loading = {};
        state.error = {};
      },
    },
    extraReducers: (builder) => {
      extraReducers.forEach((fn) => fn(builder));
    },
  });

  return {
    reducer: slice.reducer,
    actions: slice.actions,
    thunks,
  };
}

export function buildSlicesFromConfig(config) {
  const reducers = {};
  const allThunks = {};
  const allActions = {};

  for (const [sliceName, sliceDetails] of Object.entries(config)) {
    const { reducer, thunks, actions } = createDynamicSlice(sliceName, sliceDetails.endpoints);
    reducers[sliceName] = reducer;
    allThunks[sliceName] = thunks;
    allActions[sliceName] = actions;
  }

  return { reducers, allThunks, allActions };
}
