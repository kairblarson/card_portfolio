import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import LineChart from "./LineChart";
import { Alert } from "react-bootstrap";
import { motion } from "framer-motion";
import { MdLocalFireDepartment } from "react-icons/md";

export default function Card({
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
        background: isHover ? "#f0f0f0" : "white",
        cursor: isHover ? "pointer" : "default",
        transition: "linear all .1s",
        borderRadius: "10px"
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
            className="carde"
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
            <div className="card--content">
                <div className="card--left">
                    <img src={image} className="card--image"></img>
                </div>
                <div className="card--right">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            height: "30px",
                            gap: "10px",
                        }}
                    >
                        <div className="card--title">{title}</div>
                        {isTrending ? (
                            <MdLocalFireDepartment
                                style={{
                                    color: "#f0941d",
                                    fontSize: "1.3em",
                                    width: "20px",
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: "20px",
                                    height: "20px",
                                }}
                                className="dummy-div"
                            ></div>
                        )}
                    </div>
                    <h2 className="card--subset">{subset}</h2>
                    <h2 className="card--marketprice">${marketPrice}</h2>
                    <small className="card--lastupdated">
                        Last updated: {lastUpdated}
                    </small>
                    <div className="card--buttons">
                        <Button
                            variant={portfoliod ? "danger" : "primary"}
                            onClick={addCardToPortfolio}
                            size="sm"
                        >
                            {portfoliod
                                ? "Remove from portfolio"
                                : "Add to portfolio"}
                        </Button>
                        <Button
                            variant="warning"
                            onClick={addCardToWatchlist}
                            size="sm"
                        >
                            {watched ? "Unwatch" : "Watch"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
//if price == 0 then show N/A OR just dont display at all
