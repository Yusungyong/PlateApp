import { configureStore } from '@reduxjs/toolkit';
import mapReducer from './mapSlice';
import videoInfoReducer from './videoInfoSlice';
import userInfoReducer from './userInfoSlice'; // userInfoReducer import 추가

const store = configureStore({
  reducer: {
    map: mapReducer,
    videoInfo: videoInfoReducer,
    userInfo: userInfoReducer, // userInfoReducer 등록 추가
  },
});

// RootState 타입 정의
export type RootState = ReturnType<typeof store.getState>;

// 스토어 타입 정의
export type AppDispatch = typeof store.dispatch;

export default store;
