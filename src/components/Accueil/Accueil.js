// import React from "react";
import styles from "../../styles/accueil.module.css";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; // Vérifie que le fichier existe
import MemeList from "../MemeList";
const Accueil = ({ isAuthenticated }) => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMemes();
  }, [isAuthenticated]); // Relancer si l'état d'auth change

  const fetchMemes = async () => {
    try {
      setLoading(true);
      setError(null);

      let token = localStorage.getItem("token");
      if (token && token.startsWith("Bearer ")) {
        token = token.replace("Bearer ", ""); // Corrige le token si nécessaire
      }

      const apiUrl = isAuthenticated
        ? "https://backmemes-production.up.railway.app/api/m" // Authentifié
        : "https://backmemes-production.up.railway.app/api/memes"; // Non authentifié

      const headers = {
        "Content-Type": "application/json",
        ...(isAuthenticated && token ? { Authorization: `Bearer ${token}` } : {}),
      };

      console.log("📥 Fetching memes from:", apiUrl);
      console.log("🔑 Token utilisé:", token ? `Bearer ${token}` : "Pas de token trouvé");
      
      const response = await axios.get(apiUrl, { headers });

      console.log("✅ Memes récupérés:", response.data);
      setMemes(response.data);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des mèmes:", error);
      setError(error.response?.data?.message || "Erreur de chargement des mèmes.");
    } finally {
      setLoading(false);
    }
  };
  // ✅ 🔥 Ajoute le mème immédiatement après l'upload
  const handleUploadSuccess = (newMeme) => {
    setMemes((prevMemes) => {
      const updatedMemes = [newMeme, ...prevMemes];
      console.log("Liste des mèmes mise à jour:", updatedMemes);
      return updatedMemes;
    });
  };
  const [texts, setTexts] = useState([]); // Liste des textes
  const [currentText, setCurrentText] = useState(""); // Texte en cours d'ajout
  const [textAngle, setTextAngle] = useState(""); // ✅ Angle sans valeur par défaut
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(process.env.PUBLIC_URL + "/memes.jpg"); // 🔥 Image par défaut
  const [uploading, setUploading] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [rotation, setRotation] = useState(0); // État pour stocker l'angle de rotation
  const handleRotate = () => {
    setRotation((prevRotation) => prevRotation + 90); // Ajoute 45° à chaque clic
  };
  // ✅ Référence pour l'input file
  const defaultImages = [
    process.env.PUBLIC_URL + "/memes.jpg",
    process.env.PUBLIC_URL + "/memme.jpg",
    process.env.PUBLIC_URL + "/Cyber attack-pana.png",
    process.env.PUBLIC_URL + "/—Pngtree—ninja with hoodie mascot e_5538541.png"
  ];

  const handleReset = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImagePreview(defaultImages[0]); // Toujours revenir à la première image par défaut
    setTexts([]);
    setTextAngle("");
    setCurrentText("");
  };

  // ✅ Fonction pour changer l'image en cliquant sur une image de la liste
  const handleDefaultImageSelect = (selectedImage) => {
    setImage(null); // Supprime toute image uploadée
    setImagePreview(selectedImage);
  };
  useEffect(() => {
    if (imagePreview) {
      drawMeme();
    }
  }, [imagePreview, texts, rotation]); // 🔥 Ajout de `rotation`

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Remplace l'image par la nouvelle
    }
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (currentText.trim() !== "") {
      setTexts([...texts, { text: currentText, x, y, angle: textAngle || 0 }]); // 🔥 Ajoute l'angle uniquement si renseigné
      setCurrentText("");
      setTextAngle(""); // ✅ Réinitialiser après ajout
    }
  };

  const drawMeme = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imagePreview;
  
    img.onload = () => {
      const width = img.width / 2;
      const height = img.height / 2;
      canvas.width = width;
      canvas.height = height;
  
      // Appliquer la couleur de fond
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -width / 2, -height / 2, width, height);
      ctx.restore();
  
      ctx.font = "30px Impact";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      texts.forEach(({ text, x, y, angle }) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.fillText(text, 0, 0);
        ctx.strokeText(text, 0, 0);
        ctx.restore();
      });
    };
  };
  const handleUpload = async () => {
    if (!image) {
      alert("Veuillez sélectionner une image !");
      return;
    }
  
    setUploading(true);
  
    try {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL("image/png");
      const blob = await fetch(dataUrl).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "meme.png");
      formData.append("texts", JSON.stringify(texts));
  
      // ✅ Récupération et correction du token
      let token = localStorage.getItem("token");
      if (token && token.startsWith("Bearer ")) {
        token = token.replace("Bearer ", ""); // Enlever le doublon éventuel
      }
  
      const apiUrl = isAuthenticated
        ? "https://backmemes-production.up.railway.app/api/memes" // Après auth
        : "https://backmemes-production.up.railway.app/api/memes/test"; // Avant auth
  
      const headers = {
        "Content-Type": "multipart/form-data",
        ...(isAuthenticated && token ? { Authorization: `Bearer ${token}` } : {}),
      };
  
      console.log("📤 Uploading meme to:", apiUrl);
      console.log("🔑 Token utilisé:", token ? `Bearer ${token}` : "Pas de token trouvé");
      console.log("🔗 Headers envoyés:", headers);
  
      const response = await axios.post(apiUrl, formData, { headers });
  
      console.log("✅ Meme uploaded:", response.data);
  
      if (response.data && response.data.imageUrl) {
        handleUploadSuccess({
          _id: response.data._id,
          imageUrl: response.data.imageUrl,
          texts,
        });
      }
  
      // ✅ Réinitialiser l’input file après l’upload
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
  
      setImage(null);
      setImagePreview(null);
      setTexts([]);
      setTextAngle(""); // ✅ Réinitialiser après l’upload
    } catch (error) {
      console.error("❌ Erreur lors de l'upload:", error);
      if (error.response) {
        console.error("🔍 Réponse du serveur:", error.response.status, error.response.data);
        if (error.response.status === 401) {
          alert("🚨 Erreur 401: Non autorisé. Veuillez vous reconnecter.");
        }
      }
    } finally {
      setUploading(false);
    }
  };
  
  
  
  return (
    <div className={styles.AccueilContainer}>
      <div className={styles.modal}>
        <div className={styles.gauche}>
          <div className={styles.listegauche}>
            <div className={styles.liste1}>
              <button
                type="button"
                className="mm-rotate l but sml"
                title="Rotate image"
                onClick={handleRotate} // Ajoute l'événement au clic
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  cursor: "pointer",
                }}
              >
                <svg
                  x="0px"
                  y="0px"
                  width="50px"
                  height="50px"
                  viewBox="0 0 50 50"
                  enableBackground="new 0 0 50 50"
                >
                  <path d="M41.038,24.1l-7.152,9.342L26.734,24.1H31.4c-0.452-4.397-4.179-7.842-8.696-7.842c-4.82,0-8.742,3.922-8.742,8.742 s3.922,8.742,8.742,8.742c1.381,0,2.5,1.119,2.5,2.5s-1.119,2.5-2.5,2.5c-7.576,0-13.742-6.165-13.742-13.742 s6.166-13.742,13.742-13.742c7.274,0,13.23,5.686,13.697,12.842H41.038z"></path>
                </svg>
              </button>
            </div>
            <div className={styles.liste2}>
              {imagePreview && (
                <div className="blocimg">
                  <h1 onUploadSuccess={handleUploadSuccess}></h1>
                  <h3>Aperçu du Mème</h3>
                  <canvas
                  className="immg"
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    style={{
                      width: "21vw",
                      height: "38vh"
                    
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.droit}>
          <div className={styles.listedroit}>
            <div className={styles.liste3}>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              <img
                src={imagePreview}
                alt="Mème par défaut"
                style={{ maxWidth: "10%", marginTop: "10px" }}
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                {defaultImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Mème ${index + 1}`}
                    style={{
                      width: "50px",
                      height: "50px",
                      cursor: "pointer",
                      border: imagePreview === img ? "2px solid blue" : "none",
                    }}
                    onClick={() => handleDefaultImageSelect(img)}
                  />
                ))}
              </div>
            </div>
            <div className={styles.liste6}>
              <input
                type="text"
                placeholder="Écrire un texte..."
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
              />
              <input
                type="number"
                placeholder="Angle (°)"
                value={textAngle}
                onChange={(e) => setTextAngle(e.target.value)}
              />
            </div>
            <p>💡 Clique sur l’image pour positionner le texte</p>

            <div className={styles.liste7}>
              <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Uploader"}
              </button>
              <button onClick={handleReset}>Reset</button>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* <MemeList key={memes.length} memes={memes} /> */}
      </div>
    </div>
  );
};

export default Accueil;
