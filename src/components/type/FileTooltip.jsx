import React from 'react';
import BaseTooltip from './BaseTooltip';
// import styles from './Tooltip.module.css';
import fileStyles from './FileTooltip.module.css';
// import svgPaths from '../../imports/svg-mr8k9f3odm';



const FileItem = ({ extension, type, selected = false }) => {
  const renderIcon = () => {
    if (type === 'image') {
      return (
        <div>
          image ioc
        </div>
      );
    } else {
      return (
        <div>
          image
        </div>
      );
    }
  };

  return (
    <div className={`${fileStyles.fileItem} ${selected ? fileStyles.fileItemSelected : ''}`}>
      <div className={fileStyles.fileContent}>
        <div className={fileStyles.fileIconContainer}>
          {renderIcon()}
        </div>
        <div className={fileStyles.fileLabel}>
          <div className={fileStyles.fileExtension}>
            {extension}
          </div>
        </div>
      </div>
    </div>
  );
};


const FileTooltip = ({ className }) => {
  return (
    <BaseTooltip className={className} wide>
      <FileItem extension=".jpg" type="image" />
      <FileItem extension=".png" type="image" />
      <FileItem extension=".txt" type="document" selected />
      <FileItem extension=".pdf" type="document" />
      <FileItem extension=".csv" type="document" />
    </BaseTooltip>
  );
};

export default FileTooltip;