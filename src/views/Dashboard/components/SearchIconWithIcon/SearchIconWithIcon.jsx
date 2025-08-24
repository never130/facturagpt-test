import React, { forwardRef, memo, useEffect} from "react";
import styles from "./SearchIconWithIcon.module.css";
import searchMagnify from "../../assets/searchMagnify.svg";
import newChatIcon from "../../assets/newChatIcon.svg"
import newChatWithAgent from "../../assets/newChatWithAgent.svg"
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const SearchIconWithIcon = memo(
  forwardRef(
    (
      {
        children,
        searchTerm,
        setSearchTerm,
        iconRight,
        classNameIconRight,
        onClickIconRight,
        placeholder,
        stylesComponent = {},
        onFocusP,
        onBlurP,
        selectedAgent,
        father,
        count,
        customShadowContainer,
        readOnly = false
      },
      ref
    ) => {
      const { t } = useTranslation("dashboard");
      const {agentId} = useParams()
      const navigate = useNavigate()
      const location = useLocation();

     if(father === "contacts" || father === "assets" || father === "notifications" || father === "docs"){
useEffect(() => {
    if(location.search){
          let path = location.search.slice(1,)
            if(path.includes("&")){
            const searchParams = new URLSearchParams(location.search);
           const valorOriginal = decodeURIComponent(searchParams.get('search') || '');
            if(searchTerm !== valorOriginal && valorOriginal) {
          setTimeout(()=>{
            addFilterPath(valorOriginal)
            setSearchTerm(valorOriginal)
          },50)
        }
            } else {
              if(location.search.split("=")[0] == "?search"){
         const searchParams = new URLSearchParams(location.search);
        const valorOriginal = decodeURIComponent(searchParams.get('search') || '');
        if(searchTerm !== valorOriginal) {
          setTimeout(()=>{
            addFilterPath(valorOriginal)
            setSearchTerm(valorOriginal)
          },50)
        }
      }
            }

    }
  },[location.search])
     }

  const addFilterPath = (nuevoFiltro) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('search', nuevoFiltro);

    navigate({
      pathname: location.pathname,
      search: `?${searchParams.toString()}`,
    }, { replace: true }); 
  }

     



      const onClicNewChat = (e) => {       
        const new_id = uuidv4();
        localStorage.setItem("selectedChatId", "");
       navigate(`/admin/chat/${agentId}/${new_id}`);
      }

      return (
        <div className={styles.searchContainer} style={{ ...stylesComponent }}>
          <div className={styles.searchInputWrapper}>
            <div className={styles.searchIcon}>
              <img src={searchMagnify} alt="searchMagnify" />
            </div>
            <input
              ref={ref}
              type="text"
              autoComplete="off"
              readOnly={readOnly}
              placeholder={placeholder || t('placeholder')}
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value)
                if(father === "contacts" || father === "assets" || father === "notifications" || father === "docs") addFilterPath(e.target.value)
              }}
              onFocus={onFocusP}
              onBlur={onBlurP}
            />

            {children}
          </div>
          <div className={styles.imageHover}>
          {selectedAgent ?  <img onClick={(e) => { e.stopPropagation();
            onClicNewChat(e)}} className={classNameIconRight} src={newChatWithAgent} alt="newChatIcon" />
            : <>
            <img
            src={iconRight}
            className={classNameIconRight}
            onClick={onClickIconRight}
            />
            {count > 0 && (
                <div className={styles.count}>
                  {count}
                </div>
              )}
            </>
          }
          <div className={styles.shadowContainer} style={customShadowContainer} ></div>
          </div>
        </div>
      );
    }
  )
);

export default SearchIconWithIcon;
