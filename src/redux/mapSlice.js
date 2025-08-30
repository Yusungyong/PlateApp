import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLocation: null,
  destination: null,
  selectedMarker: null,
  markers: [],
  walkingRoutes: [],
  transitRoutes: [],
  transitDetails: [],
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setSelectedMarker: (state, action) => {
      state.selectedMarker = action.payload;
    },
    setMarkers: (state, action) => {
      state.markers = action.payload;
    },
    setWalkingRoutes: (state, action) => {
      state.walkingRoutes = action.payload;
    },
    setTransitRoutes: (state, action) => {
      state.transitRoutes = action.payload;
    },
    setTransitDetails: (state, action) => {
      state.transitDetails = action.payload;
    },
  },
});

export const { 
  setCurrentLocation, 
  setDestination, 
  setSelectedMarker, 
  setMarkers,
  setWalkingRoutes,
  setTransitRoutes,
  setTransitDetails 
} = mapSlice.actions;

export default mapSlice.reducer;
