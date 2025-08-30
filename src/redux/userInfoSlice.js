import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loginUserName: null,
};

const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setLoginUserName: (state, action) => {
            state.loginUserName = action.payload; // 수정: loginUserName을 업데이트하도록 변경
        },
    },
});

export const { 
    setLoginUserName, 
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
