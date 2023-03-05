import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Button, Form } from "react-bootstrap";
import Card from "../components/Card";
import CustomNavbar from "./CustomNavbar";
import { InfinitySpin } from "react-loader-spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Explore() {
    const searchParams = new URLSearchParams(document.location.search);
    const [keyword, setKeyword] = useState(
        searchParams.get("q") ? searchParams.get("q") : ""
    );
    const [cards, setCards] = useState([]);
    const [loading, toggleLoading] = useState(false);
    const [deepSearch, enableDeepSearch] = useState(false);
    const [update, toggleUpdate] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [search, updateSearch] = useState(true);
    const [alertType, setAlertType] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (keyword.trim() != "") {
            navigate(`/explore?q=${keyword}`);
            fetch(
                `http://localhost:8080/search?keyword=${keyword}&page=${page}`,
                {
                    credentials: "include",
                    method: "GET",
                }
            )
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    if (data.length <= 0 || data.length >= 200) {
                        setHasMore(false);
                    } else {
                        setCards((prev) => {
                            return [...prev, ...data];
                        });
                    }
                    enableDeepSearch(true);
                })
                .catch((error) => {
                    console.log("ERROR:", error);
                    // window.location = "http://localhost:3000/login";
                });
        }
    }, [page, search]);

    function fetchMoreData() {
        console.log("FETCH MORE");
        setTimeout(() => {
            setPage((prev) => prev + 1);
        }, 500);
    }

    function handleDeepSearch() {
        setCards([]);
        toggleLoading(true);
        setAlertType("warning");
        setAlertMessage("Searching... This might take awhile.");
        axios({
            url: `http://localhost:8080/search?keyword=${keyword}&deep=true&page=${page}`,
            withCredentials: true,
            method: "GET",
        })
            .then((res) => {
                console.log(res);
                setCards([...res.data]);
                toggleLoading(false);
                setAlertMessage("");
                enableDeepSearch(false);
            })
            .catch((err) => {
                console.log("ERROR: ", err);
            });
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setKeyword(value);
    }

    function handleSort(e) {
        switch (e.target.value) {
            case "random": //regular
                break;
            case "hightolow":
                console.log("sorting");
                setCards(
                    cards.sort(
                        (a, b) =>
                            parseFloat(b.marketPrice) -
                            parseFloat(a.marketPrice)
                    )
                );
                toggleUpdate((prev) => !prev);
                break;
            case "lowtohigh":
                setCards(
                    cards.sort(
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
        <div className="explore">
            <CustomNavbar />
            <br></br>
            <br></br>
            <br></br>
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
            <div className="explore--banner" style={{ width: "100%" }}>
                <h1 style={{ color: "Black", fontFamily: "Oswald" }}>
                    Explore
                </h1>
                <h4>Find something new!</h4>
            </div>
            <div className="explore--content">
                <div className="explore--search">
                    <Form.Group
                        className="mb-3 w-50"
                        controlId="formBasicEmail"
                    >
                        <Form.Control
                            type="text"
                            placeholder="Search Cardify"
                            value={keyword}
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    updateSearch((prev) => !prev);
                                }
                            }}
                        />
                    </Form.Group>
                    <div className="explore--buttons">
                        <Button
                            onClick={() => {
                                setCards([]);
                                setPage(1);
                                updateSearch((prev) => !prev);
                            }}
                        >
                            Search
                        </Button>
                        <OverlayTrigger
                            placement="right"
                            overlay={
                                <Tooltip id={`tooltip-right`}>
                                    This will deep search our database but could
                                    take a few minutes.
                                </Tooltip>
                            }
                        >
                            <Button
                                onClick={handleDeepSearch}
                                variant="secondary"
                                disabled={false}
                            >
                                Deep search
                            </Button>
                        </OverlayTrigger>
                        <Button variant="danger" onClick={() => setKeyword("")}>Clear</Button>
                    </div>
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
                </div>
                {cards != null && loading ? (
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
                    <>
                        {cards.length != 0 && (
                            <InfiniteScroll
                                dataLength={cards.length} //This is important field to render the next data
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
                                {cards?.map((card, key) => {
                                    const map = new Map(
                                        Object.entries(card.priceHistory)
                                    );
                                    return (
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
                                            dates={[...map.keys()]}
                                        />
                                    );
                                })}
                            </InfiniteScroll>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
