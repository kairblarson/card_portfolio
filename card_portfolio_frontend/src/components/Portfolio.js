import { useEffect, useState } from "react";
import CustomNavbar from "./CustomNavbar";
import Card from "./Card";
import InfiniteScroll from "react-infinite-scroll-component";
import { InfinitySpin } from "react-loader-spinner";
import LineChart from "./LineChart";
import { RxArrowDown, RxArrowUp } from "react-icons/rx";
import { Button, Alert } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { motion } from "framer-motion";

export default function Portfolio() {
    const [loading, toggleLoading] = useState(true);
    const [portfolio, setPortfolio] = useState([]);
    const [priceHistory, setPriceHistory] = useState(null);
    const [dates, setDates] = useState(null);
    const [update, toggleUpdate] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [currentValue, setCurrentValue] = useState(0);
    const [rendered, setRendered] = useState(false);
    const [isPortfolioPositive, setPortfolioPositive] = useState(null);
    const [percentChange, setPercentChange] = useState(null);
    const [alertType, setAlertType] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        console.log("FETCH");
        fetch(`http://localhost:8080/portfolio?page=${page}`, {
            credentials: "include",
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
                if (data.length <= 0 || data.length >= 200) {
                    setHasMore(false);
                } else {
                    setPortfolio((prev) => {
                        return [...prev, ...data];
                    });
                }
                toggleLoading(false);
            })
            .catch((error) => {
                console.log("ERROR:", error);
                window.location = "http://localhost:3000/login";
            });
    }, [page, rendered]);

    useEffect(() => {
        fetch(`http://localhost:8080/portfolio/graph`, {
            credentials: "include",
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                const map = new Map(Object.entries(data));
                const orderedMap = new Map(
                    [...map.entries()].sort((a, b) => b[0] - a[0])
                );
                const convertedDates = [...orderedMap.keys()].map((date) => {
                    return new Date(Number(date)).toDateString().substring(3);
                });
                const values = [...orderedMap.values()];
                setPriceHistory(values.reverse().slice(1).slice(-7));
                setDates(convertedDates.reverse().slice(1).slice(-7));
            })
            .catch((error) => {
                console.log("ERROR:", error);
            });
    }, []);

    function fetchMoreData() {
        setTimeout(() => {
            setPage((prev) => prev + 1);
        }, 500);
    }

    useEffect(() => {
        setCurrentValue(priceHistory?.[priceHistory.length - 1].toFixed(2));
    }, [priceHistory, dates]);

    useEffect(() => {
        let prevPrice = priceHistory?.[priceHistory?.length - 2];
        let curPrice = priceHistory?.[priceHistory?.length - 1];
        if (curPrice > prevPrice) {
            setPercentChange((curPrice / prevPrice).toFixed(2));
            setPortfolioPositive(true);
        } else {
            setPercentChange(
                (((prevPrice - curPrice) / prevPrice) * 100).toFixed(2)
            );
            setPortfolioPositive(false);
        }
    }, [priceHistory]);

    function handleUpdateAll() {
        setAlertType("warning");
        setAlertMessage("Updating... This might take a few minutes.");
        fetch(`http://localhost:8080/portfolio/update`, {
            credentials: "include",
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                // setPortfolio([...data]);
                // setAlertType("success");
                // setAlertMessage("Portfolio was updated successfully.");
                // setTimeout(() => {
                //     setAlertMessage("");
                // }, 5000);
                window.location = "http://localhost:3000/portfolio";
            })
            .catch((error) => {
                console.log("ERROR:", error);
                window.location = "http://localhost:3000/login";
            });
    }

    function handleSort(e) {
        switch (e.target.value) {
            case "random": //regular
                break;
            case "hightolow":
                console.log("sorting");
                setPortfolio(
                    portfolio.sort(
                        (a, b) =>
                            parseFloat(b.marketPrice) -
                            parseFloat(a.marketPrice)
                    )
                );
                toggleUpdate((prev) => !prev);
                break;
            case "lowtohigh":
                setPortfolio(
                    portfolio.sort(
                        (a, b) =>
                            parseFloat(a.marketPrice) -
                            parseFloat(b.marketPrice)
                    )
                );
                toggleUpdate((prev) => !prev);
                break;
            default: //none
        }
    }

    return (
        <div className="portfolio">
            <div className="portfolio--content">
                <CustomNavbar />
                <br></br><br></br><br></br>
                {!loading ? (
                    <div className="portfolio--main">
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
                                <Alert
                                    variant={alertType}
                                    style={{ width: "80%" }}
                                >
                                    {alertMessage}
                                </Alert>
                            </motion.div>
                        )}
                        <h1 style={{ color: "Black", fontFamily: "Oswald" }}>
                            Porfolio
                        </h1>
                        <div className="portfolio--info">
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                }}
                            >
                                <h4>Current value:</h4>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: "row",
                                    }}
                                >
                                    <h1 className="portfolio--value">
                                        ${currentValue}
                                    </h1>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }}
                                    >
                                        {isPortfolioPositive ? (
                                            <RxArrowUp
                                                style={{
                                                    fontSize: "40px",
                                                    color: "#32ba25",
                                                }}
                                            />
                                        ) : (
                                            <RxArrowDown
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
                            </div>
                            <div>
                                <LineChart
                                    priceHistory={priceHistory}
                                    dates={dates}
                                />
                            </div>
                        </div>
                        <br></br>
                        <OverlayTrigger
                            placement="right"
                            overlay={
                                <Tooltip id={`tooltip-right`}>
                                    This will update all your cards but will
                                    take a few minutes.
                                </Tooltip>
                            }
                        >
                            <Button
                                variant="secondary"
                                onClick={handleUpdateAll}
                            >
                                Update all
                            </Button>
                        </OverlayTrigger>
                        <br></br>
                        <select onChange={handleSort}>
                            <option value="orderby">Order by</option>
                            <option
                                value="random"
                                onChange={() => {
                                    setSortType("random");
                                    handleSort();
                                }}
                            >
                                Random
                            </option>
                            <option
                                value="hightolow"
                                onClick={() => {
                                    setSortType("hightolow");
                                    handleSort();
                                }}
                            >
                                Hight to Low
                            </option>
                            <option
                                value="lowtohigh"
                                onSelect={() => {
                                    setSortType("lowtohigh");
                                    handleSort();
                                }}
                            >
                                Low to High
                            </option>
                        </select>
                        <br></br>
                        {portfolio != null && loading ? (
                            <div className="explore--results-loading">
                                <InfinitySpin
                                    height="100"
                                    width="200"
                                    radius="10"
                                    color="black"
                                    ariaLabel="loading"
                                    wrapperStyle
                                    wrapperClass
                                />
                            </div>
                        ) : (
                            <div className="explore--results">
                                {portfolio.length != 0 && (
                                    <InfiniteScroll
                                        dataLength={portfolio.length} //This is important field to render the next data
                                        next={fetchMoreData}
                                        hasMore={hasMore}
                                        loader={
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <InfinitySpin
                                                    height="100"
                                                    width="200"
                                                    radius="10"
                                                    color="black"
                                                    ariaLabel="loading"
                                                    wrapperStyle
                                                    wrapperClass
                                                />
                                            </div>
                                        }
                                        className="explore--results"
                                    >
                                        {portfolio?.map((card, key) => (
                                            <Card
                                                key={key}
                                                title={card.title}
                                                image={card.image}
                                                subset={card.subset}
                                                marketPrice={card.marketPrice}
                                                id={card.id}
                                                inPortfolio={card.inPortfolio}
                                                inWatchlist={card.watched}
                                                lastUpdated={card.lastUpdated}
                                                priceHistory={card.priceHistory}
                                                isTrending={card.trending}
                                                dates={dates}
                                            />
                                        ))}
                                    </InfiniteScroll>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <InfinitySpin
                            height="100"
                            width="200"
                            radius="10"
                            color="black"
                            ariaLabel="loading"
                            wrapperStyle
                            wrapperClass
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
