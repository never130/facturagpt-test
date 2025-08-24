import React from 'react';
import BaseTooltip from './BaseTooltip';
import styles from './Tooltip.module.css';
import assetStyles from './AssetTooltip.module.css';



const AssetItem = ({ name, description, price, highlighted = false }) => {
  return (
    <div className={`${assetStyles.assetItem} ${highlighted ? assetStyles.assetItemHighlighted : ''}`}>
      <div className={assetStyles.assetContent}>
        <div className={assetStyles.assetInner}>
          <div className={assetStyles.assetImage}>
            {/* Placeholder for asset image */}
          </div>
          <div className={assetStyles.assetInfo}>
            <div className={assetStyles.assetName}>
              <div className={assetStyles.nameText}>
                {name}
              </div>
            </div>
            <div className={assetStyles.assetDescription}>
              {description}
            </div>
          </div>
          <div className={assetStyles.assetPrice}>
            {price}
          </div>
        </div>
      </div>
    </div>
  );
};


const AssetTooltip = ({ className }) => {
  return (
    <BaseTooltip className={className}>
      <div className={assetStyles.assetContainer}>
        <AssetItem 
          name="Nombre del Activo" 
          description="Descripción" 
          price="10.00$"
        />
        <AssetItem 
          name="Nombre del Activo" 
          description="Descripción" 
          price="10.00$"
          highlighted
        />
        <AssetItem 
          name="Nombre del Activo" 
          description="Descripción" 
          price="10.00$"
        />
      </div>
    </BaseTooltip>
  );
};

export default AssetTooltip;