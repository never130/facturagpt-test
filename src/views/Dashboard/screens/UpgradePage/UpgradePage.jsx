import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import useFocusShortcut from "../../../../utils/useFocusShortcut";
import { ReactComponent as Arrow } from "../../assets/BlackDiagonalArrow.svg";
import { ReactComponent as HelpIcon } from "../../assets/HelpIcon.svg";
import KIcon from "../../assets/KIcon.svg";
import FooterLanding from "../../components/FooterLanding/FooterLanding";
import Navbar from "../../components/Navbar/Navbar";
import SearchIconWithIcon from "../../components/SearchIconWithIcon/SearchIconWithIcon";
import styles from "./UpgradePage.module.css";
import { deleteCategoryNote, deleteUpgradeNote, getUpgradeNotes, upgradeNote } from "../../../../actions/user";
import { setNotes } from "../../../../slices/userSlices";
import { v4 as uuidv4 } from 'uuid';

const UpgradePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { t } = useTranslation(["helpPage", "ChatView"]);

  const { user, notes, categories } = useSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const searchInputRef = useRef();
  const { categoryId } = useParams();

  useFocusShortcut(searchInputRef, "k");
  const [isFocused, setIsFocused] = useState(false);

  const [editNote, setEditNote] = useState(null);

  const [ref, setRef] = useState("");
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");


  const [filteredCategories, setFilteredCategories] = useState([]);


  const [isLoading, setIsLoading] = useState(false);
 


  React.useEffect(
    () => {
      const translationId = localStorage.getItem("translationId");
      document.title = `${translationId?.replace(translationId
        ?.slice(translationId?.length - 3, translationId?.length), 'GPT')
        ?.toUpperCase() || t("ChatView:facturaGPT")} - ${t('helpCenter')}`;
    }, []
  )


  const handleSaveNote = async () => {

    const language = localStorage.getItem("language").toLowerCase() || "español";

    setIsLoading(true);


    await dispatch(upgradeNote({
      lan: language,
      category: {
        ref: categoryId,
        name: category,
        description: description,
      },
      data: note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));


    setIsLoading(false);
  }

  const handleDeleteCategory = async (id) => {
    await dispatch(deleteCategoryNote({
      id: id,
      lan: localStorage.getItem("language").toLowerCase() || "español"
    }));
  }


  const handleDeleteNote = async (id) => {
    if (id === 'all') {
      dispatch(deleteUpgradeNote({ id: 'all' }));
      dispatch(setNotes([]));
    } else {
      dispatch(deleteUpgradeNote({
        id: id,
        lan: localStorage.getItem("language").toLowerCase() || "español"
      }));
      const newNotes = notes.filter((note) => (note._id !== id));
      dispatch(setNotes(newNotes));
    }

  }

  const [isSearching, setIsSearching] = useState(false);


  const fn = async () => {
    const language = localStorage.getItem("language").toLowerCase() || "español";

    const response = await dispatch(getUpgradeNotes({
      lan: language,
      category: selectedCategory || categoryId,
      search: searchTerm
    }));

    if (selectedCategory || categoryId) {
      setRef(selectedCategory || categoryId);
    }

    if (searchTerm) {
      setIsSearching(true);
      navigate(`/upgrade?search=${encodeURIComponent(searchTerm)}`);
    } else if (isSearching && !searchTerm.trim()) {
      setIsSearching(false);
      setRef(null);
      setCategory(null);
      setDescription(null);
      setNote(null);
      setTitle(null);
      setSelectedCategory(null);
    }

  }

  useEffect(() => {
    if (selectedCategory !== 'editNote') {
      fn()
    }
  }, [localStorage.getItem("language"), selectedCategory, categoryId, searchTerm]);

  const renderComponent = () => {
    if (selectedCategory === 'editNote') {
      return (<EditUpgradeNote
        handleDeleteNote={handleDeleteNote}
        handleSaveNote={handleSaveNote}
        note={note}
        setNote={setNote}
        title={title}
        setTitle={setTitle}
        category={category}
        categories={categories}
        setCategory={setCategory}
        description={description}
        setDescription={setDescription}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        isLoading={isLoading}
      />);
    } else {

      return (
        <div className={styles.upgradeNotesContainerList} >
          {notes?.map((note, index) => (
            <div key={index} className={styles.upgradeNotesItem}>
              <label>
                {new Date(note.createdAt).getDate()} de {new Date(note.createdAt).toLocaleString('es-ES', { month: 'long' })}
              </label>
              {(user?.role === 'superadmin' && selectedCategory && selectedCategory !== 'editNote') && (
                <div className={styles.upgradeNotesItemButtons}>
                  <button onClick={() => {
                    setSelectedCategory('editNote');
                    setCategory(category);
                    setDescription(description);
                    setNote(note.data);
                    setRef(note.ref);
                  }}>
                    Editar
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => {
                      handleDeleteNote(note._id);
                    }}>
                    Eliminar
                  </button>
                </div>
              )}
              <h3>{note.name}</h3>
              <div
                className={styles.noteContent}
                dangerouslySetInnerHTML={{ __html: note.data }}
              />
            </div>
          ))}
        </div>
      )

    }
  }



  return (
    <div className={styles.HelpPage}>
      <Navbar />
      <div className={styles.HelpPageBody}>
        <div className={styles.HelpPageBodyLeft}>
          <div className={styles.searchArticleContainer}>
            <h3>
              <HelpIcon /> Upgrader del día {new Date().getDate()} de {new Date().toLocaleString('es-ES', { month: 'long' })}
            </h3>
            <p>{t("detailedInfo")}</p>
            <div className={styles.inputContainer}>
              <SearchIconWithIcon
                ref={searchInputRef}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                classNameIconRight={styles.searchContainerL}
                placeholder={"Buscar upgrade por título o fecha"}
                onFocusP={() => setIsFocused(true)}
                onBlurP={() => setIsFocused(false)}
              >
                <img
                  src={KIcon}
                  alt="filterIcon"
                  className={styles.searchContainerIcon}
                />
              </SearchIconWithIcon>
              {searchTerm && isFocused && filteredCategories.length > 0 && (
                <div className={styles.recomendQuestions}>
                  {filteredCategories.map((category, index) => (
                    <div key={index} className={styles.recommendationItem}>
                      {category.map((article, articleIndex) => (
                        <div
                          key={articleIndex}
                          onMouseDown={() => {
                            navigate(`/help/${category.id}`);
                            setSelectedCategory(category.id);
                          }}
                          className={styles.articleItem}
                        >
                          <div>
                            <p>
                              <strong>{category.name}</strong>
                            </p>
                            <span>{article.title}</span>
                          </div>
                          <Arrow />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              {(user?.role === 'superadmin' && selectedCategory && selectedCategory !== "editNote") && (
                <>
                  <button
                    className={styles.deleteButton}
                    onClick={() => {
                      handleDeleteCategory(selectedCategory);
                    }}
                  >
                    Borrar
                  </button>
                  <button
                    className={styles.addButton}
                    onClick={() => {
                      setSelectedCategory('editNote');
                      navigate(`/upgrade/${ref}`);

                      const index = categories.findIndex(category => category.ref === ref);
                      if (index !== -1) {
                        setCategory(categories[index].name);
                        setDescription(categories[index].description);
                        setRef(categories[index].ref);
                      }
                    }}
                  >
                    Nuevo
                  </button>
                </>
              )}
            </div>
          </div>

          <div className={styles.HelpPageBodyComponent}>
            {renderComponent()}
          </div>
        </div>
        <div className={styles.HelpPageBodyRight}>
          <MenuCategories
            categories={categories}
            setSelectedCategory={setSelectedCategory}
            navigate={navigate}
            ref={ref}
            setRef={setRef}
            setCategory={setCategory}
            setDescription={setDescription}
          />
        </div>
      </div>


      <FooterLanding />
    </div>
  );
};

export default UpgradePage;



const MenuCategories = ({
  categories,
  setSelectedCategory,
  navigate,
  ref,
  setRef,
  setCategory,
  setDescription,
}) => {

  return (
    <div
      className={styles.recomendQuestions}
      style={{
        position: 'relative',
        top: '80px',
        maxHeight: '80%',
      }}
    >
      {categories.map((category, index) => (
        <div key={index} className={styles.recommendationItem}>
          <div
            key={index}
            onClick={() => {
              setCategory(category.name);
              setDescription(category.description);

              if (category.ref === 'editNote') {
                const id = uuidv4();
                setSelectedCategory('editNote');
                setRef(id);
                navigate(`/upgrade/${id}`);
              } else {
                navigate(`/upgrade/${category.ref || category._id}`);
                setRef(category.ref || category._id);
                setSelectedCategory(category.ref || category._id);
              }
            }}
            className={styles.articleItem}
          >
            <div>
              <p>
                <strong>{category?.name || 'No hay categoría'}</strong>
              </p>
              <span>{category?.description || 'No hay descripción'}</span>
            </div>
            <Arrow />
          </div>
        </div>
      ))}
    </div>
  )
}

const EditUpgradeNote = ({
  handleDeleteNote,
  handleSaveNote,
  note,
  setNote,
  ref,
  setRef,
  title,
  setTitle,
  category,
  setCategory,
  description,
  setDescription,
  categories,
  selectedCategory,
  setSelectedCategory,
  isLoading,
}) => {

  const navigate = useNavigate();

  const [isUserTyping, setIsUserTyping] = useState(false);
  const editorRef = useRef(null);
  const descriptionRef = useRef(null);


  const autoResize = () => {
    if (editorRef.current) {
      const editor = editorRef.current;
      editor.style.height = 'auto';
      const scrollHeight = editor.scrollHeight;
      const maxHeight = 400; 
      const newHeight = Math.min(scrollHeight, maxHeight);
      editor.style.height = `${newHeight}px`;

      if (scrollHeight > maxHeight) {
        editor.style.overflowY = 'auto';
      } else {
        editor.style.overflowY = 'hidden';
      }
    }
  };

  const autoResizeDescription = () => {
    if (descriptionRef.current) {
      const textarea = descriptionRef.current;
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 200; 
      const newHeight = Math.min(scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;

      if (scrollHeight > maxHeight) {
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.overflowY = 'hidden';
      }
    }
  };

  const handleEditorInput = (e) => {
    setIsUserTyping(true);
    const content = e.currentTarget.innerHTML;
    setNote(content);
    autoResize();
  };

  const handleEditorFocus = () => {
    autoResize();
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    autoResizeDescription();
  };

  const handleDescriptionFocus = () => {
    autoResizeDescription();
  };


  const handleSave = async () => {
    await handleSaveNote();

  }

  useEffect(() => {
    if (editorRef.current && note && !isUserTyping && editorRef.current.innerHTML !== note) {
      editorRef.current.innerHTML = note;
      autoResize();
    }
    setIsUserTyping(false);
  }, [note, isUserTyping]);

  useEffect(() => {
    if (descriptionRef.current && description) {
      autoResizeDescription();
    }
  }, [description]);


  const [editCategory, setEditCategory] = useState(false);

  return (
    <>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
        </div>
      ) : (
        <div className={styles.upgradeNotesContainer}>
          <div className={styles.formActions}>
            <button
              onClick={() => {
                if (categories.length > 1) {
                  setSelectedCategory(null);
                  navigate(`/upgrade`);

                } else {
                  setSelectedCategory('editNote');
                }
              }}
            >
              Cancelar
            </button>
            <button onClick={() => { setEditCategory(prev => !prev); }} >
              Editar Categoria
            </button>
            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={!(category?.trim() && description?.trim())}

            >
              Guardar Nota
            </button>
            <button
              className={styles.deleteAllButton}
              onClick={() => {
                if (window.confirm('¿Estás seguro de que quieres eliminar todas las notas?')) {
                  handleDeleteNote('all');
                }
              }}
            >
              Eliminar Todo
            </button>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.editorToolbar}>
              <button
                type="button"
                onClick={() => document.execCommand('bold', false, null)}
                className={styles.toolbarButton}
                title="Negrita"
              >
                <strong>B</strong>
              </button>
              <button
                type="button"
                onClick={() => document.execCommand('italic', false, null)}
                className={styles.toolbarButton}
                title="Cursiva"
              >
                <em>I</em>
              </button>
              <button
                type="button"
                onClick={() => document.execCommand('underline', false, null)}
                className={styles.toolbarButton}
                title="Subrayado"
              >
                <u>U</u>
              </button>
              <button
                type="button"
                onClick={() => document.execCommand('insertUnorderedList', false, null)}
                className={styles.toolbarButton}
                title="Lista"
              >
                • Lista
              </button>
              <button
                type="button"
                onClick={() => document.execCommand('insertOrderedList', false, null)}
                className={styles.toolbarButton}
                title="Lista numerada"
              >
                1. Lista
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = prompt('Introduce la URL de la imagen:');
                  if (url) {
                    document.execCommand('insertImage', false, url);
                  }
                }}
                className={styles.toolbarButton}
                title="Insertar imagen"
              >
                🖼️
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = prompt('Introduce la URL del enlace:');
                  if (url) {
                    document.execCommand('createLink', false, url);
                  }
                }}
                className={styles.toolbarButton}
                title="Insertar enlace"
              >
                🔗
              </button>
              <button
                type="button"
                onClick={() => document.execCommand('formatBlock', false, 'h1')}
                className={styles.toolbarButton}
                title="Título 1"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => document.execCommand('formatBlock', false, 'h2')}
                className={styles.toolbarButton}
                title="Título 2"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => document.execCommand('formatBlock', false, 'h3')}
                className={styles.toolbarButton}
                title="Título 3"
              >
                H3
              </button>
            </div>
            <div className={styles.formGroup}>
              <label>Título</label>
              <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Contenido</label>
              <div
                ref={editorRef}
                className={styles.editorContent}
                contentEditable={true}
                onInput={handleEditorInput}
                onFocus={handleEditorFocus}
                data-placeholder="Escribe tu nota aquí..."
                suppressContentEditableWarning={true}
              />
            </div>
          </div>
          <div className={styles.upgradeNotesForm}>
            {(editCategory && (category.trim() && description.trim())) ? (
              <div>
                <b>
                  {category}
                </b>
                <p>
                  {description}
                </p>
              </div>
            ) : (
              <>

                <div className={styles.formGroup}>
                  <label>Categoría</label>
                  <input
                    type="text"
                    placeholder="Categoría"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Descripción</label>
                  <textarea
                    ref={descriptionRef}
                    placeholder="Descripción de la categoría"
                    value={description}
                    onChange={handleDescriptionChange}
                    onFocus={handleDescriptionFocus}
                    style={{
                      minHeight: '60px',
                      resize: 'none',
                      overflow: 'hidden'
                    }}
                  />
                </div>
              </>
            )}


          </div>
        </div>
      )}
    </>
  );
};



