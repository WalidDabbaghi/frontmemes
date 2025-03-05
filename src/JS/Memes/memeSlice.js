import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_API_URL}/api/memes`;

//********** Récupérer les mèmes d'un utilisateur spécifique ***********************
export const getMemesByUserId = createAsyncThunk("memes/getByUserId", async (userId, { rejectWithValue }) => {
  try {
      const response = await axios.get(`${BASE_URL}/m/${userId}`);
      return response.data;
  } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Erreur lors de la récupération des mèmes de l'utilisateur");
  }
});

//********** Poster un mème sans authentification ***********************
export const postMemePublic = createAsyncThunk("memes/postPublic", async (memeData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${BASE_URL}/test`, memeData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Erreur lors de l'ajout du mème public");
    }
});

//********** Récupérer les mèmes de l'utilisateur authentifié ***********************
export const getUserMemes = createAsyncThunk("memes/getUserMemes", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Aucun token trouvé");

        const response = await axios.get(`${BASE_URL}/user`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Erreur lors de la récupération des mèmes de l'utilisateur");
    }
});

//********** Poster un mème avec authentification ***********************
export const postMemeAuth = createAsyncThunk("memes/postAuth", async (memeData, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Aucun token trouvé");

        const response = await axios.post(`${BASE_URL}`, memeData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Erreur lors de l'ajout du mème avec authentification");
    }
});

export const memeSlice = createSlice({
    name: "memes",
    initialState: {
        memes: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(postMemePublic.pending, (state) => {
                state.status = "loading";
            })
            .addCase(postMemePublic.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.memes.push(action.payload);
            })
            .addCase(postMemePublic.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            .addCase(getUserMemes.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getUserMemes.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.memes = action.payload;
            })
            .addCase(getUserMemes.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            .addCase(getMemesByUserId.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getMemesByUserId.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.memes = action.payload;
            })
            .addCase(getMemesByUserId.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            .addCase(postMemeAuth.pending, (state) => {
                state.status = "loading";
            })
            .addCase(postMemeAuth.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.memes.push(action.payload);
            })
            .addCase(postMemeAuth.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

// Export du reducer
export default memeSlice.reducer;
