import React from 'react';
import styles from './ViewerDoc.module.css';

const ViewerDoc = () => {
  return (
    <div className={styles.viewerDoc}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.documentIcon}>📄</div>
          <div className={styles.documentInfo}>
            <h1 className={styles.documentTitle}>Título del Documento</h1>
            <p className={styles.documentMeta}>
              Creado el [date] a las [time] por [UserName]
            </p>
          </div>
        </div>
        
        <div className={styles.headerActions}>
          <button className={styles.approveButton}>
            🔒 Aprobar documento
          </button>
          <button className={styles.editButton}>
            ✏️ Editar
          </button>
          <button className={styles.moreButton}>
            ⋯
          </button>
        </div>
      </div>

      {/* Category and Concept Section */}
      <div className={styles.categorySection}>
        <div className={styles.categoryItem}>
          <span className={styles.categoryLabel}>Seleccionar Categoría</span>
          <span className={styles.categoryDropdown}>⭐ ▼</span>
        </div>
        <div className={styles.categoryItem}>
          <span className={styles.categoryLabel}>Concepto</span>
          <span className={styles.categoryDropdown}>▼</span>
        </div>
        <div className={styles.statusBadge}>
          Pagado
        </div>
        <div className={styles.tagSection}>
          <span className={styles.tag}>Etiqueta 1 ✕</span>
        </div>
      </div>

      {/* Toolbar Section */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <button className={styles.toolButton}>➕</button>
          <button className={styles.toolButton}>📞</button>
          <button className={styles.toolButton}>🌐</button>
          <button className={styles.toolButton}>@</button>
          <button className={styles.toolButton}>📍</button>
          <button className={styles.toolButton}>Tt</button>
          <button className={styles.toolButton}>123</button>
          <button className={styles.toolButton}>📷</button>
          <button className={styles.toolButton}>⭕</button>
          <button className={styles.toolButton}>%</button>
          <button className={styles.toolButton}>📅</button>
          <button className={styles.toolButton}>🖨️</button>
          <button className={styles.toolButton}>📤</button>
          <button className={styles.toolButton}>📊</button>
          <button className={styles.toolButton}>📋</button>
          <button className={styles.toolButton}>🔗</button>
          <button className={styles.toolButton}>📊</button>
          <button className={styles.toolButton}>📞</button>
          <button className={styles.toolButton}>⚙️</button>
          <button className={styles.toolButton}>👤</button>
          <button className={styles.toolButton}>📅</button>
          <button className={styles.toolButton}>⚡</button>
        </div>
      </div>

      {/* Info Bar Section */}
      <div className={styles.infoBar}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Método de Pago:</span>
          <span className={styles.infoValue}>Mastercard ****5678</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Contactos:</span>
          <span className={styles.infoValue}>0</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Activos:</span>
          <span className={styles.infoValue}>0</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Balance total:</span>
          <span className={styles.infoValue}>(0,00) - 0,00 EUR</span>
        </div>
        <div className={styles.stripeInfo}>
          <span className={styles.stripeLabel}>stripe</span>
          <span className={styles.stripeText}>Refund full price</span>
        </div>
      </div>

      {/* Document Content Area */}
      <div className={styles.documentContent}>
        {/* Aquí va el contenido del documento */}
      </div>
    </div>
  );
};

export default ViewerDoc;
