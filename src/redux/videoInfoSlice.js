import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    storeId: 0,
    arrayVideo: [],
    videoUserName: null,
    likeYn: null,
    likeCount: 0,  // likeCount 추가
};

const videoInfoSlice = createSlice({
    name: 'videoInfo',
    initialState,
    reducers: {
        setStoreId: (state, action) => {
            state.storeId = action.payload; 
        },
        setArrayVideo: (state, action) => {
            state.arrayVideo = action.payload; 
        },
        setvideoUserName: (state, action) => {
            state.videoUserName = action.payload; 
        },
        setLikeYn: (state, action) => {
            state.likeYn = action.payload;
        },
        setLikeCount: (state, action) => {  // likeCount를 업데이트하는 리듀서 추가
            state.likeCount = action.payload;
        }
    },
});

export const { 
  setStoreId, 
  setArrayVideo,
  setvideoUserName,
  setLikeYn,
  setLikeCount,  // setLikeCount 추가
} = videoInfoSlice.actions;

export default videoInfoSlice.reducer;
