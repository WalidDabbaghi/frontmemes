import React, { useEffect, useState } from "react";
import "../styles/MemeList.css";
import { FaDownload, FaShareAlt } from "react-icons/fa"; // Import des icônes
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  LinkedinShareButton 
} from "react-share";

const MemeList = ({ memes }) => {
  const [displayedMemes, setDisplayedMemes] = useState([]);
  const [hoveredMeme, setHoveredMeme] = useState(null); // Gérer l'affichage du menu de partage

  useEffect(() => {
    setDisplayedMemes(memes);
  }, [memes]);

  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "meme.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Erreur lors du téléchargement :", error);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Liste des Mèmes</h2>
      <div className="meme-container">
        {displayedMemes.map((meme) => (
          <div key={meme._id} className="meme-card">
            {/* Icône de partage */}
            <div
              className="share-icon"
              onMouseEnter={() => setHoveredMeme(meme._id)}
              onMouseLeave={() => setHoveredMeme(null)}
            >
              <FaShareAlt />
              {hoveredMeme === meme._id && (
                <div className="share-menu">
                  <LinkedinShareButton url={meme.imageUrl}>
                    <span>LinkedIn</span>
                  </LinkedinShareButton>
                  <TwitterShareButton url={meme.imageUrl}>
                    <span>Twitter</span>
                  </TwitterShareButton>
                  <FacebookShareButton url={meme.imageUrl}>
                    <span>Facebook</span>
                  </FacebookShareButton>
                </div>
              )}
            </div>

            {/* Icône de téléchargement */}
            <div className="download-icon" onClick={() => handleDownload(meme.imageUrl)}>
              <FaDownload />
            </div>

            {/* Image du mème */}
            <img src={meme.imageUrl} alt="Meme" />
            <p className="meme-text">{meme.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemeList;
