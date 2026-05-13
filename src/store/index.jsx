import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth/index";
const store= configureStore({
    reducer:{
        //store
        auth
    }
})
export default store;