import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import LineChart from "./LineChart";
import { Alert } from "react-bootstrap";
import { motion } from "framer-motion";
import { MdLocalFireDepartment } from "react-icons/md";

export default function MiniCard({
    title,
    image,
    subset,
    category,
    marketPrice,
    id,
    inPortfolio,
    inWatchlist,
    lastUpdated,
    dates,
    priceHistory,
    isTrending,
}) {
    const [watched, setWatched] = useState(inWatchlist);
    const [portfoliod, setPortfoliod] = useState(inPortfolio);
    const [prices, setPrices] = useState([]);
    const [isHover, setHover] = useState(false);
    const [alertType, setAlertType] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [motionZIndex, setMotionZIndex] = useState("-1");

    const cardStyle = {
        background: isHover ? "#e6e6e6" : "#f0f0f0",
        cursor: isHover ? "pointer" : "default",
        transition: "linear all .1s",
    };

    function addCardToPortfolio(e) {
        e.stopPropagation();
        fetch(`http://localhost:8080/card/${id}/add/portfolio`, {
            credentials: "include",
            method: "PUT",
        })
            .then((res) => res.text())
            .then((data) => {
                console.log(data);
                if (data != "not logged in") {
                    setPortfoliod((prev) => !prev);
                } else {
                    setMotionZIndex("2");
                    setAlertType("warning");
                    setAlertMessage("Sign in to interact with cards.");
                    setTimeout(() => {
                        setMotionZIndex("-1");
                        setAlertType("");
                        setAlertMessage("");
                    }, 3000);
                }
            })
            .catch((error) => {
                console.log("ERROR:", error);
                window.location = "http://localhost:3000/login";
            });
    }

    function addCardToWatchlist(e) {
        e.stopPropagation();
        fetch(`http://localhost:8080/card/${id}/add/watchlist`, {
            credentials: "include",
            method: "PUT",
        })
            .then((res) => res.text())
            .then((data) => {
                console.log(data);
                if (data != "not logged in") {
                    setWatched((prev) => !prev);
                } else {
                    setMotionZIndex("2");
                    setAlertType("warning");
                    setAlertMessage("Sign in to interact with cards.");
                    setTimeout(() => {
                        setMotionZIndex("-1");
                        setAlertType("");
                        setAlertMessage("");
                    }, 3000);
                }
                //if the response is "NOT LOGGED IN then give red alert"
                //if the response is "success then give a green alert"
            })
            .catch((error) => {
                console.log("ERROR:", error);
                window.location = "http://localhost:3000/login";
            });
    }

    useEffect(() => {
        if (priceHistory != null) {
            const map = new Map(Object?.entries(priceHistory));
            setPrices([...map.values()]);
        }
    }, [priceHistory]);

    return (
        <div
            className="minicard"
            onClick={() =>
                (window.location = `http://localhost:3000/card/${id}`)
            }
            style={cardStyle}
            onMouseEnter={() => setHover((prev) => !prev)}
            onMouseLeave={() => setHover((prev) => !prev)}
        >
            <div
                className="motion--container"
                style={{
                    zIndex: motionZIndex,
                }}
            >
                {alertMessage != "" && (
                    <motion.div
                        style={{
                            position: "absolute",
                            width: "80%",
                            maxWidth: "500px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        initial={{ x: "-300px", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-300px", opacity: 1 }}
                    >
                        <Alert variant={alertType} style={{ width: "80%" }}>
                            {alertMessage}
                        </Alert>
                    </motion.div>
                )}
            </div>
            <div className="minicard--content">
                <div className="minicard--left">
                    {image != null ? <img src={image} className="card--image"></img> : <div className="card--image"></div>}
                </div>
            </div>
        </div>
    );
}
