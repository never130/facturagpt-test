import DatabaseTableCard from './components/DatabaseTableCard';

export default function App({
  table,
  processTableSelection,
  processTableSelectionProps,
  dispatch,
  activeSelectIndex,
  setActiveSelectIndex,
  index,
  deleteTableAndUpdateView,
  deleteTableAndUpdateViewProps,
  selectRef,
  t,
  setShowDeleteTableModal,
  setEditTable,
  setShowAddRelationModal,
  setShowCreateParameterFromPopup,
  setCurrentTableId,
  setInitialParameterType
}) {
  const handleEdit = () => {
    console.log('Editar tabla');
  };

  const handleAddRelation = () => {
    setShowCreateParameterFromPopup(true)
    setCurrentTableId(table.tableId)
    setInitialParameterType("formula")
  };

  const handleAddRecord = () => {
    console.log('Añadir registro');
  };

  const handleMoreOptions = () => {
    console.log('Más opciones');
  };

  const handleRemoveTag = (index) => {
    console.log('Remover etiqueta:', index);
  };

  const handleAddTag = () => {
    console.log('Añadir nueva etiqueta');
  };

  return (
    <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px'}}>
      <div style={{width: '100%'}}>
        <DatabaseTableCard
          tableName="Nombre de la Tabla"
          category="Público"
          isPrivate={true}
          storageSize="1 GB"
          authorName="Aythen"
          timeAgo="Hace un año"
          tags={["Etiqueta 1", "Etiqueta 2"]}
          onEdit={handleEdit}
          onAddRelation={handleAddRelation}
          onAddRecord={handleAddRecord}
          onMoreOptions={handleMoreOptions}
          onRemoveTag={handleRemoveTag}
          onAddTag={handleAddTag}
          table={table}
          processTableSelection={processTableSelection}
          processTableSelectionProps={processTableSelectionProps}
          dispatch={dispatch}
          activeSelectIndex={activeSelectIndex}
          setActiveSelectIndex={setActiveSelectIndex}
          index={index}
          deleteTableAndUpdateView={deleteTableAndUpdateView}
          deleteTableAndUpdateViewProps={deleteTableAndUpdateViewProps}
          selectRef={selectRef}
          t={t}
          setShowDeleteTableModal={setShowDeleteTableModal}
          setEditTable={setEditTable}
        />
      </div>
    </div>
  );
}