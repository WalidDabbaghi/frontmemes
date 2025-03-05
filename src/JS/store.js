import { configureStore } from "@reduxjs/toolkit";
import memeReducer from "./Memes/memeSlice";
import userSlice from "./userSlice/userSlice";

const store = configureStore({
  reducer: {
    memes: memeReducer,
    user:userSlice,
  },
});

export default store;