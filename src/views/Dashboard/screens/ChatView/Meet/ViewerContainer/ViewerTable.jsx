import React from 'react';
import styles from './ViewerTable.module.css';

import TableSkeleton from "../../../../components/TablesComponents/TypedTable/TableSkeleton2";

import { ReactComponent as IconPdf } from "./assets/icon-pdf.svg";
import { ReactComponent as IconLock } from "./assets/icon-lock.svg";
import { ReactComponent as IconEdit } from "./assets/icon-edit.svg";
import { ReactComponent as IconCog } from "./assets/icon-cog.svg";
import { ReactComponent as IconMagic } from "./assets/icon-magic.svg";
import { ReactComponent as IconChernDown } from "./assets/icon-chern-down.svg";
import { ReactComponent as IconClose } from "./assets/icon-close.svg";
import { ReactComponent as IconStripe } from "./assets/icon-stripe.svg";
import { ReactComponent as IconTables } from "./assets/icon-tables.svg";
import { ReactComponent as IconPlus } from "./assets/icon-plus.svg";
import { ReactComponent as IconAddRelation } from "./assets/icon-add-relation.svg";
import { ReactComponent as IconSave } from "./assets/icon-save.svg";
import { ReactComponent as IconPlusStar } from "./assets/icon-plus-star.svg";


// Componente principal
const DataTable = () => {
  // const tableColumns = [
  //   { name: 'Nombre', icon: <NameColumnIcon /> },
  //   { name: 'Categoría', icon: <CategoryColumnIcon /> },
  //   { name: 'Descripción', icon: <DescriptionColumnIcon /> },
  //   { name: 'Código de referéncia', icon: <CategoryColumnIcon /> },
  //   { name: 'URL de referéncia', icon: <CategoryColumnIcon /> },
  //   { name: 'Proveedor', icon: <DescriptionColumnIcon /> },
  //   { name: 'Parámetro', icon: <CategoryColumnIcon /> },
  //   { name: 'Tabla', icon: <NameColumnIcon /> },
  //   { name: 'Tipo de activo', icon: <CategoryColumnIcon /> },
  //   { name: 'Importe', icon: <NameColumnIcon /> },
  //   { name: 'Porcentaje', icon: <CategoryColumnIcon /> },
  //   { name: 'Activos', icon: <NameColumnIcon /> }
  // ];

  const tableRows = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    data: ['param', 'value', 'text', 'code', 'url', 'provider', 'param', 'table', 'type', 'amount', 'percent', 'assets']
  }));

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.mainContent}>
          {/* Sección del header */}
          <div className={styles.headerSection}>
            <div className={styles.headerInner}>
              <div className={styles.headerContent}>
                <div className={styles.mainInfo}>
                  <div className={styles.avatarContainer}>
                    {/* <DatabaseIcon /> */}
                    <IconTables />
                  </div>
                  <div className={styles.tableInfo}>
                    <div className={styles.tableNameContainer}>
                      <div className={styles.tableName}>
                        <p className={styles.tableNameText}>
                          Nombre de la Tabla
                        </p>
                      </div>
                    </div>
                    <div className={styles.metaInfo}>
                      <div className={styles.publicLabel}>
                        <p className={styles.publicText}>Público</p>
                      </div>
                      <div className={styles.privateContainer}>
                        {/* <LockIcon /> */}
                        <IconLock />
                        <div className={styles.publicLabel}>
                          <p className={styles.publicText}>Privado</p>
                        </div>
                      </div>
                      <div className={styles.categoryLabel}>
                        <p className={styles.tableNameText}>
                          Categoría
                        </p>
                      </div>
                    </div>
                    <div className={styles.sizeInfo}>
                      <div className={styles.sizeText}>
                        <p className={styles.sizeSpan}>1 GB</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.actionsSection}>
                  <div className={styles.actionButtons}>
                    <div className={styles.authorContainer}>
                      <div className={styles.authorInfo}>
                        <div className={styles.authorName}>
                          <p className={styles.publicText}>Aythen</p>
                        </div>
                        {/* <VerifiedIcon /> */}
                        <IconPlusStar />
                      </div>
                      <div className={styles.timeLabel}>
                        <p className={styles.tableNameText}>
                          Hace un año
                        </p>
                      </div>
                    </div>
                    <div className={styles.editButton}>
                      <div className={styles.editButtonBorder} />
                      <div className={styles.editButtonContent}>
                        {/* <EditIcon /> */}
                        <IconEdit />
                        <div className={styles.editText}>
                          <p className={styles.publicText}>Editar</p>
                        </div>
                      </div>
                    </div>
                    <div className={styles.moreButton}>
                      <div className={styles.editButtonBorder} />
                      {/* <MoreIcon /> */}
                      <IconCog />
                    </div>
                  </div>
                  <div className={styles.tagsContainer}>
                    <div className={styles.tagContainer}>
                      <div className={styles.tagText}>
                        <p className={styles.publicText}>Etiqueta 1</p>
                      </div>
                      <div className={styles.closeButton}>
                        <div className={styles.closeText}>
                          <p className={styles.publicText}>×</p>
                        </div>
                      </div>
                    </div>
                    <div className={styles.tagContainer}>
                      <div className={styles.tagText}>
                        <p className={styles.publicText}>Etiqueta 2</p>
                      </div>
                      <div className={styles.closeButton}>
                        <div className={styles.closeText}>
                          <p className={styles.publicText}>×</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de datos */}
          <div className={styles.dataSection}>
            <div className={styles.dataSectionInner}>
              <div className={styles.dataContent}>
                <div className={styles.statsContainer}>
                  <div className={styles.statsRow}>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>
                        <p className={styles.publicText}>Filas </p>
                      </div>
                      <div className={styles.statBadge}>
                        <div className={styles.statValue}>
                          <p className={styles.tableNameText}>9.999</p>
                        </div>
                      </div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>
                        <p className={styles.publicText}>Columnas</p>
                      </div>
                      <div className={styles.statBadge}>
                        <div className={styles.statValue}>
                          <p className={styles.tableNameText}>9.999</p>
                        </div>
                      </div>
                    </div>
                    <div className={styles.statItem}>
                      <div className={styles.statLabel}>
                        <p className={styles.publicText}>Relaciones</p>
                      </div>
                      <div className={styles.statBadge}>
                        <div className={styles.statValue}>
                          <p className={styles.tableNameText}>99</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.buttonSection}>
                  <div className={styles.addRelationButton}>
                    <div className={styles.addRelationButtonBorder} />
                    {/* <AddRelationIcon /> */}
                    <IconAddRelation />
                    <div className={styles.addRelationText}>
                      <p className={styles.publicText}>Añadir Relación</p>
                    </div>
                  </div>
                  <div className={styles.newAssetButton}>
                    {/* <NewAssetIcon /> */}
                    <IconSave />
                    <div className={styles.newAssetText}>
                      <p className={styles.publicText}>Guardar</p>
                    </div>
                  </div>
                  <div className={styles.moreButton}>
                    <div className={styles.editButtonBorder} />
                    {/* <MoreIcon /> */}
                    <IconPlus />
                  </div>
                </div>
                <TableSkeleton />

                {/* <div className={styles.tableSection}>
                  <div className={styles.tableContainer}>
                    <div className={styles.tableWrapper}>
                      <div className={styles.tableWrapperBorder} />
                      <div className={styles.tableInner}>
                        <div className={styles.tableHeader}>
                          <div className={styles.tableHeaderBorder} />
                          {tableColumns.map((column, index) => (
                            <div key={index} className={styles.headerColumn}>
                              <div className={styles.headerColumnContent}>
                                <ExpandIcon />
                                {column.icon}
                                <div className={styles.columnText}>
                                  <p className={styles.columnTextSpan}>{column.name}</p>
                                </div>
                              </div>
                              <div className={styles.headerColumnBorder} />
                            </div>
                          ))}
                          <div className={styles.headerColumn} style={{ width: '84px' }} />
                        </div>

                        <div className={styles.tableRows}>
                          {tableRows.map((row) => (
                            <div key={row.id} className={styles.tableRow}>
                              <div className={styles.tableRowBorder} />
                              <div className={styles.rowControls}>
                                <div className="flex h-[20px] items-center justify-center relative shrink-0 w-[20px]">
                                  <OptionsVerticalIcon />
                                </div>
                                <CheckBox />
                              </div>
                              <div className={styles.rowData}>
                                <div className={styles.rowDataContent}>
                                  {row.data.map((cellData, cellIndex) => (
                                    <div key={cellIndex} className={styles.dataCell}>
                                      <div className={styles.dataCellContent}>
                                        <div className={styles.dataCellText}>
                                          <p className={styles.dataCellTextSpan}>{cellData}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.showMoreSection}>
                    <div className={styles.divider}>
                      <div className={styles.dividerLine}>
                        <svg
                          className={styles.dividerSvg}
                          fill="none"
                          preserveAspectRatio="none"
                          viewBox="0 0 266 1"
                        >
                          <line
                            stroke="var(--stroke-0, #DEDEDF)"
                            x2="266"
                            y1="0.5"
                            y2="0.5"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className={styles.showMoreButton}>
                      <div className={styles.showMoreText}>
                        <p className={styles.showMoreTextSpan}>Show more</p>
                      </div>
                      <DownIcon />
                    </div>
                    <div className={styles.divider}>
                      <div className={styles.dividerLine}>
                        <svg
                          className={styles.dividerSvg}
                          fill="none"
                          preserveAspectRatio="none"
                          viewBox="0 0 266 1"
                        >
                          <line
                            stroke="var(--stroke-0, #DEDEDF)"
                            x2="266"
                            y1="0.5"
                            y2="0.5"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;