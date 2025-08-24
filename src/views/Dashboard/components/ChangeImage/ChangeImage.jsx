import React, { useRef, useState } from "react";
import emptyImage from "../../assets/ImageEmpty.svg";
import { ReactComponent as CamIconBW } from "../../assets/camIconWhiteFill.svg";
import { ReactComponent as Eye } from "../../assets/eyeIconNew.svg";
import { ReactComponent as EyeIconNewSlashed } from "../../assets/eyeIconNewSlashed.svg";
import { resizeImage } from "../../../../utils/resizeImage";
import styles from "./ChangeImage.module.css";
import { useDispatch } from "react-redux";
import { createAsset, getAsset, updateAsset } from "../../../../actions/assets";
const ChangeImage = ({ rounded = false,imageAsset,setImageAsset,article,customStyle }) => {
  const [showImage, setShowImage] = useState(true);
  const [currentImageId, setCurrentImageId] = useState(false)
  const dispatch = useDispatch()
  const handleImageUpload = async (event) => {

    const file = event.target.files[0];
    if (!file) return;

    try {

         const isSvg = file.type === "image/svg+xml";

    let imageUrl;

    if (isSvg) {
      imageUrl = URL.createObjectURL(file);
    } else {


      const resizedImage = await resizeImage(file, 500, 500, 0.7);
       imageUrl = URL.createObjectURL(resizedImage); 
      const fileNew = URL.createObjectURL(file); 
    }

     const response =  await dispatch(getAsset({id:article?._id}))

      if(response.payload.message === "Asset encontrado"){
            dispatch(updateAsset({
            id: article?._id,
            assetData: {...article, image:imageUrl},
          }))
      }else if(currentImageId){
        const response =  await dispatch(getAsset({id:currentImageId}))
           dispatch(updateAsset({
            id: currentImageId,
            assetData: {...response.payload.data, image:imageUrl},
          }))
      }
      else{
       const response = await dispatch(createAsset({assetData:{
        category: "Selecciona una opción",
        parameters: [],
        tags: [],
        selectedTags: [],
        suppliesData: [],
        alternateData: [],
        name: "",
        image:imageUrl}}))
        if(response.payload.message === "Activo creado exitosamente")setCurrentImageId(response.payload.data.id)
      }
  
      setImageAsset(imageUrl);


    } catch (error) {
      console.error("Error al procesar la imagen:", error);
    }
  };

  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    
    fileInputRef.current.click();
  };
  return (
    <div className={styles.ChangeImageContainer}>
      <div  className={`${styles.imageContainer} ${rounded && styles.rounded}`}>
        <img style={customStyle} src={imageAsset || emptyImage} alt="" />
        <div className={styles.optionsImage}>
          <CamIconBW onClick={(e) => {
            e.stopPropagation()
            handleIconClick()}} />
          {showImage ? (
            <Eye onClick={() => setShowImage(false)} />
          ) : (
            <EyeIconNewSlashed onClick={() => setShowImage(true)} />
          )}
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
      />
    </div>
  );
};

export default ChangeImage;
