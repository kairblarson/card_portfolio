import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import CustomNavbar from "./CustomNavbar";
import LineChart from "./LineChart";
import Card from "./Card";
import { Alert } from "react-bootstrap";
import { motion } from "framer-motion";
import { MdLocalFireDepartment } from "react-icons/md";
import { TiArrowDown, TiArrowUp } from "react-icons/ti";

export default function CardExpanded() {
    const [card, setCard] = useState(null);
    const [similarCards, setSimilarCards] = useState(null);
    const [watched, setWatched] = useState(false);
    const [portfoliod, setPortfoliod] = useState(false);
    const [dates, setDates] = useState(null);
    const [values, setValues] = useState(null);
    const [alertType, setAlertType] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [percentChange, setPercentChange] = useState(null);
    const [isPortfolioPositive, setPortfolioPositive] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        axios({
            url: `http://localhost:8080/card/${id}`,
            withCredentials: true,
            method: "GET",
        }).then(
            (res) => {
                setCard(res.data);
                setWatched(res.data.watched);
                setPortfoliod(res.data.inPortfolio);
                const map = new Map(Object.entries(res.data.priceHistory));
                const orderedMap = new Map(
                    [...map.entries()].sort((a, b) => b[0] - a[0])
                );
                const convertedDates = [...orderedMap.keys()].map((date) => {
                    return new Date(Number(date)).toDateString().substring(3);
                });
                const values = [...orderedMap.values()];
                
                setValues(values.reverse().slice(1).slice(-7));
                setDates(convertedDates.reverse().slice(1).slice(-7));
            },
            (error) => {
                console.error(error);
            }
        );
    }, []);


    useEffect(() => {
        axios({
            url: `http://localhost:8080/search?keyword=${card?.title?.substring(
                card.title.length - 3
            )}&page=1`,
            withCredentials: true,
            method: "GET",
        }).then(
            (res) => {
                setSimilarCards([...res.data]);
            },
            (error) => {
                console.error(error);
            }
        );
    }, [card]);

    useEffect(() => {
        let prevPrice = values?.[values?.length - 2];
        let curPrice = values?.[values?.length - 1];
        if (curPrice > prevPrice) {
            setPercentChange(
                (Math.abs(prevPrice / curPrice - 1) * 100).toFixed(2)
            );
            setPortfolioPositive(true);
        } else if (curPrice < prevPrice) {
            setPercentChange(
                (((prevPrice - curPrice) / prevPrice) * 100).toFixed(2)
            );
            setPortfolioPositive(false);
        } else if (curPrice == prevPrice) {
            setPercentChange(0.0);
            setPortfolioPositive(true);
        }
    }, [card, values]);

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
                    setAlertType("success");
                    setAlertMessage(
                        portfoliod
                            ? "card was removed from your portfolio."
                            : "Card was added to your portfolio."
                    );
                    setPortfoliod((prev) => !prev);
                } else {
                    setAlertType("danger");
                    setAlertMessage(
                        "Card was unable to be added to your portfolio."
                    );
                }
                setTimeout(() => {
                    resetAlert();
                }, 3000);
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
                    setAlertType("success");
                    setAlertMessage(
                        watched
                            ? "Card was removed from your watchlist."
                            : "Card was added to your watchlist."
                    );
                } else {
                    setAlertType("danger");
                    setAlertMessage(
                        "Card was unable to be added to your watchlist."
                    );
                }
                setTimeout(() => {
                    resetAlert();
                }, 3000);
                //if the response is "NOT LOGGED IN then give red alert"
                //if the response is "success then give a green alert"
            })
            .catch((error) => {
                console.log("ERROR:", error);
                window.location = "http://localhost:3000/login";
            });
    }

    function handleForceUpdate(e) {
        e.stopPropagation();
        setAlertType("warning");
        setAlertMessage("Card is updating, this might take a few seconds...");
        fetch(
            `http://localhost:8080/search?keyword=${card.title}+${card.subset}&deep=true&page=1`,
            {
                credentials: "include",
                method: "GET",
            }
        )
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                window.location = `http://localhost:3000/card/${id}`;
            })
            .catch((error) => {
                console.log("ERROR:", error);
                setAlertType("danger");
                setAlertMessage("Uh oh, something went wrong :/");
                // window.location = "http://localhost:3000/login";
            });
    }

    function resetAlert() {
        setAlertMessage("");
    }

    //put these alerts on a timer and when the timer is up after x sec
    //make it go away. Use framer motion as well to make them animate in

    return (
        <div className="cardexpanded">
            <CustomNavbar variant={"dark"}/>
            <br></br>
            <br></br>
            <br></br>
            <div className="cardexpanded--content">
                {alertMessage != "" && (
                    <motion.div
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        initial={{ x: "-300px", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-300px", opacity: 0 }}
                    >
                        <Alert variant={alertType} style={{ width: "80%" }}>
                            {alertMessage}
                        </Alert>
                    </motion.div>
                )}
                <div className="cardexpanded--container">
                    <div className="cardexpanded--left">
                        <div className="cardexpanded--titles">
                            <h1
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                            >
                                {card?.title}
                                {card?.trending && (
                                    <MdLocalFireDepartment
                                        style={{
                                            color: "#f0941d",
                                            position: "absolute",
                                            top: "10",
                                            right: "10",
                                        }}
                                    />
                                )}
                            </h1>
                            <h2>{card?.subset}</h2>
                        </div>
                        <br></br>
                        <img
                            src={card?.image}
                            className="cardexpanded--image"
                        ></img>
                    </div>
                    <br></br>
                    <div className="cardexpanded--right">
                        <p>Current Marketprice:</p>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }}
                        >
                            <h1 className="cardexpanded--price">
                                ${card?.marketPrice}
                            </h1>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                {isPortfolioPositive ? (
                                    <TiArrowUp
                                        style={{
                                            fontSize: "40px",
                                            color: "#32ba25",
                                        }}
                                    />
                                ) : (
                                    <TiArrowDown
                                        style={{
                                            fontSize: "40px",
                                            color: "#d61111",
                                        }}
                                    />
                                )}
                                <small
                                    style={{
                                        fontSize: "1em",
                                        color: isPortfolioPositive
                                            ? "#32ba25"
                                            : "#d61111",
                                    }}
                                >
                                    {isPortfolioPositive ? "" : "-"}
                                    {percentChange}%
                                </small>
                            </div>
                        </div>
                        <br></br>
                        <small>Last updated: {card?.lastUpdated}</small>
                        <LineChart priceHistory={values} dates={dates} />
                        <br></br>
                        <div className="cardexpanded--buttons">
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
                            <Button
                                variant="secondary"
                                onClick={handleForceUpdate}
                                size="sm"
                            >
                                Force update
                            </Button>
                        </div>
                    </div>
                </div>
                <br></br>
                <h3 className="cardexpanded--similar-header">
                    Cards similar to this one
                </h3>
                <div className="cardexpanded--similar">
                    {similarCards?.map((card, key) => {
                        const map = new Map(Object.entries(card.priceHistory));
                        return (
                            <Card
                                key={key}
                                title={card.title}
                                image={card.image}
                                subset={card.subset}
                                marketPrice={card.marketPrice}
                                id={card.id}
                                lastUpdated={card.lastUpdated}
                                inPortfolio={card.inPortfolio}
                                inWatchlist={card.watched}
                                priceHistory={card.priceHistory}
                                isTrending={card.trending}
                                dates={[...map.keys()]}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
