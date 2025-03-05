import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_API_URL}/user`;

const savedUser = (() => {
    const user = localStorage.getItem("user");
    if (user) {
        try {
            return JSON.parse(user);
        } catch (e) {
            console.error("Erreur de parsing JSON pour l'utilisateur:", e);
            return null; // Retourne null si le JSON est invalide
        }
    }
    return null;
})();
//********** Register User ***********************
export const userRegister = createAsyncThunk("user/register", async (user, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${BASE_URL}/register`, user);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data.user;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Échec de l'inscription");
    }
});

//********** Login User ***********************
export const userLogin = createAsyncThunk("user/login", async (user, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, user);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data.user;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Échec de la connexion");
    }
});

//********** Get Current User ***********************
export const userCurrent = createAsyncThunk("user/current", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        if (!token || token === "undefined") throw new Error("Aucun token trouvé");

        const response = await axios.get(`${BASE_URL}/current`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        localStorage.setItem("user", JSON.stringify(response.data.user)); // Met à jour les données utilisateur

        return response.data.user;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Échec de la récupération de l'utilisateur");
    }
});

export const userSlice = createSlice({
    name: "user",
    initialState: {
        data: savedUser, // Charger les données au démarrage
        status: "idle",
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.data = null;
            state.status = "idle";
            state.error = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user"); // Supprimer l'utilisateur stocké
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(userRegister.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(userRegister.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(userRegister.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Login
            .addCase(userLogin.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Get Current User
            .addCase(userCurrent.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(userCurrent.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(userCurrent.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

// Export des actions et du reducer
export const { logout } = userSlice.actions;
export default userSlice.reducer;
