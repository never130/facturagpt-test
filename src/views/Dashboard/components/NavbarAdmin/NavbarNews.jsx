import React, { useState, useEffect } from 'react'
import { syncNews } from "../../../../actions/news";
import { useDispatch } from 'react-redux';

// import { IconArrowDown, IconArrowUp } from '../../../../assets/icons';
import styles from "./NavbarNews.module.css";

import { setTheme } from "../../../../slices/themeSlices";


import { ReactComponent as IconArrowDown } from "../../screens/News/assets/icon-arrow-down.svg";
import { ReactComponent as IconArrowUp } from "../../screens/News/assets/icon-arrow-up.svg";


const NavbarNews = () => {

    const dispatch = useDispatch();


    const [selectedNews, setSelectedNews] = useState([]);

    const [news, setNews] = useState([]);

    const [showPopUpNews, setShowPopUpNews] = useState(false);


    const fakeNews = [
        {
            title: "FacturaGPT launches CouchDB integration",
            description: "Dynamic news is now available in the system.",
            image: "https://via.placeholder.com/150",
            prompt: "Update",
            time: "10 minutes ago",
            variation: "+10%",
        },
        {
            title: "FacturaGPT launches CouchDB integration",
            description: "Dynamic news is now available in the system.",
            image: "https://via.placeholder.com/150",
            prompt: "Update",
            time: "10 minutes ago",
            variation: "+10%",
        },
        {
            title: "FacturaGPT launches CouchDB integration",
            description: "Dynamic news is now available in the system.",
            image: "https://via.placeholder.com/150",
            prompt: "Update",
            time: "10 minutes ago",
            variation: "+10%",
        },
    ];

    useEffect(() => {
        // const getNews = async () => {
        //     try {
        //         const res = await dispatch(syncNews());
        //         if (res.payload && res.payload.data?.length > 0) {
        //             setNews(res.payload.data.slice(0, 20));
        //         } else {
        //             setNews(fakeNews);
        //         }
        //     } catch (error) {
        //         console.error("Error getting news:", error);
        //         setNews(fakeNews);
        //     }
        // };
        // getNews();
        // const theme = localStorage.getItem("theme");
        // dispatch(setTheme(theme || "light"));
    }, []);





    return (
        <div className={styles.popUpNewsCarousel}>
            <div className={styles.popUpNewsCarouselContent}>
                {news.map((item, index) => (
                    <div
                        key={index}
                        className={styles.popUpNewsCarouselItem}
                        onClick={() => {
                            setSelectedNews(news.slice(0, 20));
                            setShowPopUpNews(true);
                        }}
                        data-tooltip={item.title}
                    >
                        <img
                            src={
                                item.image && item.image.startsWith("http")
                                    ? item.image
                                    : "https://cdn-icons-png.flaticon.com/512/21/21601.png"
                            }
                            alt={item.title}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                    "https://cdn-icons-png.flaticon.com/512/21/21601.png";
                            }}
                        />
                        <div className={styles.popUpNewsCarouselItemContent}>
                            <b>
                                {item.title?.slice(0, 32)}
                                {item.title?.length > 32 ? "..." : ""}
                            </b>
                            <p>
                                {item.description?.slice(0, 32)}
                                {item.description?.length > 32 ? "..." : ""}
                            </p>
                            {/* <span>{item.time}</span> */}
                        </div>
                        {item.variation?.includes("-") ? (
                            <IconArrowDown />
                        ) : item.variation?.includes("+") ? (
                            <IconArrowUp />
                        ) : null}
                    </div>
                ))}
            </div>
        </div>

    )
}

export default NavbarNews;




