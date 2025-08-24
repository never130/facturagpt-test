import styles from "./PaginationTables.module.css"; 
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import { ReactComponent as Arrow } from "../../assets/ArrowLeftWhite.svg";
import Button from "../Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setPaginationSlice } from "../../../../slices/paginationSlices";
import { useLocation, useNavigate } from "react-router-dom";
const PaginationTables = ({
  totalData,
  limit,
  page,
  setPage,
  setLimit,
  father,
  customStyleExplore,
  customPaginationContainer,
  customPaginationNumbers
}) => {

  const location = useLocation()
  const navigate = useNavigate()


   const addFilterPath = (nuevoFiltro) => {
    if(father != "home" && father != "tables"){
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', nuevoFiltro); 

    navigate({
      pathname: location.pathname,
      search: `?${searchParams.toString()}`,
    }, { replace: true }); 
  }
  }

  if(father != "home" && father != "tables"){
  useEffect(() => {
    if(location.search){
    let path = location.search.slice(1,)
      if(path.includes("&")){
      path =  path.split("&").filter(filter => {
       let type =  filter.split("=").slice(0,1)
       if(type == "page") return true
       else return false
      })
     const [type, pag] = path.join("").split("=")
      if(pag && pag != page){
        setTimeout(()=>{
                  addFilterPath(pag)
                },100)
               setPage(Number(pag))
      }
      } else {
        if(path.split("=")[0] == "page"){
          const [type, pag] = path.split("=")
          if(pag && pag != page){
            setTimeout(()=>{
              addFilterPath(pag)
            },100)
           setPage(Number(pag))
          }
      }
      }
    }
  },[location.search])
}
  const totalPages = Math.ceil(totalData / limit);

  const { pageSlice, limitSlice, contactLimitSlice, contactPageSlice } =
    useSelector((state) => state.pagination);
  const dispatch = useDispatch();
  useEffect(() => {
    if (limitSlice) {
      setLimit(limitSlice);
      setPage(pageSlice);
      addFilterPath(pageSlice)
      dispatch(setPaginationSlice({ pageSlice: null, limitSlice: null }));
    } else if (father === "contact" && contactLimitSlice) {
      setLimit(contactLimitSlice);
      setPage(contactPageSlice);
      addFilterPath(contactPageSlice)
      dispatch(
        setPaginationSlice({ contactPageSlice: null, contactLimitSlice: null })
      );
    }
  }, [pageSlice, limitSlice]);

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; 
    let startPage = Math.max(0, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const options = [20,50]
  if (totalData > 50) options.push(100);
  if (totalData > 100) options.push(250);
  if(totalData > 250) options.push(500);


  return (
    <div className={`${styles.paginationContainer} ${styles.pagination}`}  style={father === 'automate' ? {width:"100%", maxWidth:"100%", justifyContent:"space-between",...customStyleExplore}:{}}>
      {totalData > limit && (
        <div className={styles.paginationContainer} style={customPaginationContainer}>
          <Button
            action={() => {
              setPage((prev) => Math.max(prev - 1, 0));
              addFilterPath(Math.max(page - 1, 0))
            }}
            
            headerStyle={{
              width: "22px",
              height: "22px",
              padding: "0",
              background: page === 0 ? "#cccccc" : "",
              cursor: page === 0 ? "not-allowed" : "",
            }}
          >
            <Arrow />
          </Button>

          {page > 2 && totalPages >= 6 && (
            <>
              <Button
                action={() => {
                  setPage(0);
                  addFilterPath(0)
                }}
                headerStyle={{ width: "22px", height: "22px", padding: "0" }}
              >
                1
              </Button>

              {page > 3 && (
                <span className={styles.paginationEllipsis}>...</span>
              )}
            </>
          )}

          <div className={styles.paginationNumbers} style={customPaginationNumbers}>
            {getPageNumbers().map((pageNum) => (
              <Button
                key={pageNum}
                action={() => {
                  setPage(pageNum);
                  addFilterPath(pageNum)
                }}
                headerStyle={{
                  width: "22px",
                  height: "22px",
                  padding: "0",
                  background: pageNum === page ? "#cccccc" : "",
                  cursor: pageNum === page ? "not-allowed" : "",
                }}
              >
                {pageNum + 1}
              </Button>
            ))}
          </div>

          {page < totalPages - 3 && totalPages > 5 && (
            <>
              {page < totalPages - 4 && (
                <span className={styles.paginationEllipsis}>...</span>
              )}
              <Button
                action={() => {
                  setPage(totalPages - 1)
                  addFilterPath(totalPages - 1)
                }}
                headerStyle={{
                  width: "22px",
                  height: "22px",
                  padding: "0",
                }}
              >
                {totalPages}
              </Button>
            </>
          )}

          <Button
            action={() => {
              setPage((prev) => Math.min(prev + 1, totalPages - 1));
              addFilterPath(Math.min(page + 1, totalPages - 1))
            }}
            headerStyle={{
              width: "22px",
              height: "22px",
              padding: "0",
              background: page >= totalPages - 1 ? "#cccccc" : "",
              cursor: page >= totalPages - 1 ? "not-allowed" : "",
            }}
          >
            <Arrow style={{ transform: "rotate(180deg)" }} />
          </Button>
        </div>
      )}

      <CustomDropdown
        height="25px"
        options={options}
        selectedOption={limit}
        setSelectedOption={(option) => { return setLimit(Number(option))}}
        father={father}
        type={'pagination'}
      />
    </div>
  );
};

export default PaginationTables;
