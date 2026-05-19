import { createSlice } from "@reduxjs/toolkit";

const initialState={
currentAccount:{
    id:1,
    username: "HaticeT97460896",
    fullName:"Hatice Tanriverdi",
    avatar:'https://pbs.twimg.com/profile_images/1891598633394429952/ieXx21SE_normal.jpg'
},
accounts:[{
    id:1,
    username: "HaticeT97460896",
    fullName:"Hatice Tanriverdi",
    avatar:'https://pbs.twimg.com/profile_images/1891598633394429952/ieXx21SE_normal.jpg'
},{
    id:2,
    username: "gezgor_ist",
    fullName:"Gezgor istanbul",
    avatar:'https://pbs.twimg.com/profile_images/1808158041373556736/N31_2OIF_400x400.jpg'
}]
}
const auth= createSlice({
name: 'auth',
initialState,
reducers:{
    //state manipule etme methodları
    _addAccounts:(state,action)=>{
        state.accounts.push(action.payload)
    },
    _removeAccounts:(state,action)=>{
        state.accounts=state.accounts.filter(account=>account.id !== action.payload)
    },
    _setCurrentAccount:(state,action)=>{
        state.currentAccount=action.payload
    }
}
})
export const {_addAccounts,_setCurrentAccount,_removeAccounts}=auth.actions
export default auth.reducer