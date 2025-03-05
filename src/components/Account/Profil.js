import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Accueil from "../Accueil/Accueil";
import MemeList from "../MemeList";
import axios from "axios";
import { userCurrent } from "../../JS/userSlice/userSlice"; // 🔥 Importer userCurrent

const Profil = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user?.data);
  const isAuthenticated = !!userState;
  const [memes, setMemes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !userState) {
      dispatch(userCurrent()); // 🔥 Recharger l'utilisateur si le token est présent
    }
  }, [dispatch, userState]);

  useEffect(() => {
    const fetchMemes = async () => {
      if (!userState?._id) return;

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`https://backmemes-production.up.railway.app/api/m/${userState._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMemes(response.data);
        setError(null);
      } catch (error) {
        console.error("Erreur lors de la récupération des mèmes:", error);
        setError(error.response?.data?.message || "Impossible de charger les mèmes.");
      }
    };

    if (isAuthenticated) {
      fetchMemes();
    }
  }, [isAuthenticated, userState?._id]);

  return (
    <div>
      <h1>{userState ? `Bonjour, ${userState.name} 👋` : "Chargement..."}</h1>

      <Accueil isAuthenticated={isAuthenticated} />

      <div>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {isAuthenticated ? (
          memes.length > 0 ? (
            <MemeList isAuthenticated={isAuthenticated} memes={memes} />
          ) : (
            <p>Aucun mème disponible.</p>
          )
        ) : (
          <p>Veuillez vous connecter pour voir vos mèmes.</p>
        )}
      </div>
    </div>
  );
};

export default Profil;
