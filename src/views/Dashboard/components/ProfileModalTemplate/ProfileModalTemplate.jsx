import React, { useState, useRef } from "react";
import emptyImage from "../../assets/ImageEmpty.svg";
import styles from "./ProfileModalTemplate.module.css";
import { ReactComponent as CameraIcon } from "../../assets/camIconBW.svg";
import { useDispatch } from "react-redux";

const ProfileModalTemplate = ({
  id,
  image,
  handleContactData,
  handleAssetData,
  initials,
  letters,
  customStyle={},
  camStyles={},
  sticky,
  type,
  farher
}) => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [imgSrc, setImgSrc] = useState(image || emptyImage);

  const resizeImage = (
    file,
    maxWidth = 500,
    maxHeight = 500,
    quality = 0.7
  ) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          let width = img.width;
          let height = img.height;

          const aspectRatio = width / height;
          if (width > height) {
            width = maxWidth;
            height = maxWidth / aspectRatio;
          } else {
            height = maxHeight;
            width = maxHeight * aspectRatio;
          }

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          const base64Image = canvas.toDataURL("image/jpeg", quality);
          resolve(base64Image);
        };
      };
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const base64Image = await resizeImage(file, 500, 500, 0.7);
      if (handleContactData) {
        initials
          ? handleContactData({ name: "profileImage", newValue: base64Image })
          : handleContactData("image", base64Image);
      } 
      if (handleAssetData) handleAssetData("image", base64Image);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

    React.useEffect(() => {
      setImgSrc(image || emptyImage);
    }, [image]);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  

  return (
    <div className={styles.profileModalContainer} style={{
      position:sticky &&'initial', width: type === "popup" && " 70%",
    marginLeft: type === "popup" && farher !== "doc" &&  windowWidth > 500 && "40px", pointerEvents: type === "popup" && "auto"
    }}>
      <div className={styles.profileModalTemplate} style={customStyle}>
        {initials && !image ? (
          <div className={styles.initials}>
            {letters}
          </div>
        ) : (
          <img
          src={imgSrc}
          alt="Profile"
          onError={() => setImgSrc(emptyImage)}
        />
        )}
      {type !== "navbarAdmin" && 
        <div className={styles.camContainer} style={camStyles} onClick={triggerFileInput}>
          <CameraIcon className={styles.icon} />
        </div>}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          style={{ display: "none" }} 
        />
      </div>
    </div>
  );
};

export default ProfileModalTemplate;
