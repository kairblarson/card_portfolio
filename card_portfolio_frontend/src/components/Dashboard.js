import { useEffect, useState } from "react";
import Navbar from "./CustomNavbar";
import { InfinitySpin } from "react-loader-spinner";
import MiniCard from "./MiniCard";
import { TiChevronLeft, TiChevronRight } from "react-icons/ti";
import CustomNavbar from "./CustomNavbar";

export default function Dashboard() {
    const [loading, toggleLoading] = useState(true);
    const [trending, setTrending] = useState(new Array(20));
    const [watchlist, setWatchlist] = useState(new Array(20));
    const [suggestions, setSuggestions] = useState(new Array(20));
    const [cardLimit, setCardLimit] = useState(3);
    const [trendingPointer, setTrendingPointer] = useState(0);
    const [watchlistPointer, setWatchlistPointer] = useState(0);
    const [suggestionsPointer, setSuggestionsPointer] = useState(0);
    const [chevronStates, setChevronStates] = useState({
        tLeftChev: false,
        tRightChev: false,
        wLeftChev: false,
        wRightChev: false,
        sLeftChev: false,
        sRightChev: false,
    });

    useEffect(() => {
        fetch(`http://localhost:8080/card/suggestions`, {
            credentials: "include",
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                setSuggestions([...data]);
            })
            .catch((error) => {
                console.log("ERROR:", error);
            });
    }, []);

    useEffect(() => {
        fetch(`http://localhost:8080/card/trending`, {
            credentials: "include",
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                setTrending([...data]);
            })
            .catch((error) => {
                console.log("ERROR:", error);
            });
    }, []);

    useEffect(() => {
        fetch(`http://localhost:8080/watchlist?page=${1}`, {
            credentials: "include",
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                setWatchlist([...data]);
                toggleLoading(false);
            })
            .catch((error) => {
                console.log("ERROR:", error);
                window.location = "http://localhost:3000/login";
            });
    }, []);

    function handleResize() {
        if (window.innerWidth >= 1200) {
            setCardLimit(7);
        } else if (850 <= window.innerWidth) {
            setCardLimit(5);
        } else if (window.innerWidth < 850) {
            setCardLimit(3);
        }
    }

    useEffect(() => {
        if (window.innerWidth >= 1200) {
            setCardLimit(7);
        } else if (850 <= window.innerWidth) {
            setCardLimit(5);
        } else if (window.innerWidth < 850) {
            setCardLimit(3);
        }
    }, []);

    window.addEventListener("resize", handleResize);

    function handleWatchlistShift(e) {
        const { name } = e.target;
    }

    const watchListElements = watchlist
        .slice(watchlistPointer, watchlistPointer + cardLimit)
        .map((card, key) => {
            const map = new Map(Object?.entries(card?.priceHistory));
            return (
                <MiniCard
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
        });

    const trendingElement = trending
        .slice(trendingPointer, trendingPointer + cardLimit)
        .map((card, key) => {
            const map = new Map(Object?.entries(card?.priceHistory));
            return (
                <MiniCard
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
        });

    console.log(watchlist);

    const suggestionsElement = suggestions
        .slice(suggestionsPointer, suggestionsPointer + cardLimit)
        .map((card, key) => {
            const map = new Map(Object?.entries(card?.priceHistory));
            return (
                <MiniCard
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
        });

    return (
        <div className="dashboard">
            <CustomNavbar />
            <br></br>
            {loading ? (
                <div className="dashboard--loading">
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
                <div className="dashboard--content">
                    <img
                        src="images/cards.jpg"
                        style={{
                            width: "100%",
                            opacity: "100%",
                            height: "30em",
                            maxHeight: "30em",
                            objectFit: "cover",
                        }}
                    ></img>
                    <br></br>
                    <div className="dashboard--banner">
                        <h1 style={{ color: "Black", fontFamily: "Oswald" }}>
                            Dashboard
                        </h1>
                        <h4>Welcome to Cardify!</h4>
                    </div>
                    <br></br>
                    <div className="dashboard--main">
                        <h2 className="dashboard--subheading">Watchlist</h2>
                        <section className="dashboard--section">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                            >
                                <TiChevronLeft
                                    onClick={() => {
                                        if (watchlistPointer >= 1) {
                                            setWatchlistPointer(
                                                (prev) => prev - 1
                                            );
                                        }
                                    }}
                                    style={{
                                        minWidth: "30px",
                                        minHeight: "30px",
                                        background: chevronStates.wLeftChev
                                            ? "rgba(255, 173, 58, .7)"
                                            : "rgb(255, 173, 58)",
                                        borderRadius: "20px",
                                        color: "white",
                                        cursor: chevronStates.wLeftChev
                                            ? "pointer"
                                            : "default",
                                        transition: "linear all .2s",
                                    }}
                                    onMouseEnter={() =>
                                        setChevronStates((prev) => ({
                                            ...prev,
                                            wLeftChev: !prev.wLeftChev,
                                        }))
                                    }
                                    onMouseLeave={() =>
                                        setChevronStates((prev) => ({
                                            ...prev,
                                            wLeftChev: !prev.wLeftChev,
                                        }))
                                    }
                                />
                                <div className="dashboard--watchlist">
                                    {watchListElements}
                                </div>
                                <TiChevronRight
                                    onClick={() => {
                                        if (
                                            watchlistPointer <=
                                            watchlist.length - (cardLimit + 1)
                                        ) {
                                            setWatchlistPointer(
                                                (prev) => prev + 1
                                            );
                                        }
                                    }}
                                    style={{
                                        minWidth: "30px",
                                        minHeight: "30px",
                                        background: chevronStates.wRightChev
                                            ? "rgba(255, 173, 58, .7)"
                                            : "rgb(255, 173, 58)",
                                        borderRadius: "20px",
                                        color: "white",
                                        cursor: chevronStates.wRightChev
                                            ? "pointer"
                                            : "default",
                                        transition: "linear all .2s",
                                    }}
                                    onMouseEnter={() =>
                                        setChevronStates((prev) => ({
                                            ...prev,
                                            wRightChev: !prev.wRightChev,
                                        }))
                                    }
                                    onMouseLeave={() =>
                                        setChevronStates((prev) => ({
                                            ...prev,
                                            wRightChev: !prev.wRightChev,
                                        }))
                                    }
                                />
                            </div>
                        </section>
                        <br></br>
                        <h2 className="dashboard--subheading">Trending</h2>
                        <section className="dashboard--section">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                            >
                                <TiChevronLeft
                                    onClick={() => {
                                        if (trendingPointer >= 1) {
                                            setTrendingPointer(
                                                (prev) => prev - 1
                                            );
                                        }
                                    }}
                                    style={{
                                        minWidth: "30px",
                                        minHeight: "30px",
                                        background: chevronStates.tLeftChev
                                            ? "rgba(255, 173, 58, .7)"
                                            : "rgb(255, 173, 58)",
                                        borderRadius: "20px",
                                        color: "white",
                                        cursor: chevronStates.tLeftChev
                                            ? "pointer"
                                            : "default",
                                        transition: "linear all .2s",
                                    }}
                                    onMouseEnter={() =>
                                        setChevronStates((prev) => ({
                                            ...prev,
                                            tLeftChev: !prev.tLeftChev,
                                        }))
                                    }
                                    onMouseLeave={() =>
                                        setChevronStates((prev) => ({
                                            ...prev,
                                            tLeftChev: !prev.tLeftChev,
                                        }))
                                    }
                                />
                                <div className="dashboard--trending">
                                    {trendingElement}
                                </div>
                                <TiChevronRight
                                    onClick={() => {
                                        if (
                                            trendingPointer <=
                                            trending.length - (cardLimit + 1)
                                        ) {
                                            setTrendingPointer(
                                                (prev) => prev + 1
                                            );
                                        }
                                    }}
                                    style={{
                                        minWidth: "30px",
                                        minHeight: "30px",
                                        background: chevronStates.tRightChev
                                            ? "rgba(255, 173, 58, .7)"
                                            : "rgb(255, 173, 58)",
                                        borderRadius: "20px",
                                        color: "white",
                                        cursor: chevronStates.tRightChev
                                            ? "pointer"
                                            : "default",
                                        transition: "linear all .2s",
                                    }}
                                    onMouseEnter={() =>
                                        setChevronStates((prev) => ({
                                            ...prev,
                                            tRightChev: !prev.tRightChev,
                                        }))
                                    }
                                    onMouseLeave={() =>
                                        setChevronStates((prev) => ({
                                            ...prev,
                                            tRightChev: !prev.tRightChev,
                                        }))
                                    }
                                />
                            </div>
                        </section>
                        <br></br>
                        <h2 className="dashboard--subheading">
                            Cards you might like
                        </h2>
                        <section className="dashboard--section">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                            >
                                <TiChevronLeft
                                    onClick={() => {
                                        if (suggestionsPointer >= 1) {
                                            setSuggestionsPointer(
                                                (prev) => prev - 1
                                            );
                                        }
                                    }}
                                    style={{
                                        minWidth: "30px",
                                        minHeight: "30px",
                                        background: chevronStates.sLeftChev
                                            ? "rgba(255, 173, 58, .7)"
                                            : "rgb(255, 173, 58)",
                                        borderRadius: "20px",
                                        color: "white",
                                        cursor: chevronStates.sLeftChev
                                            ? "pointer"
                                            : "default",
                                        transition: "linear all .2s",
                                    }}
                                    onMouseEnter={() =>
                                        setChevronStates((prev) => ({
                                            ...prev,
                                            sLeftChev: !prev.sLeftChev,
                                        }))
                                    }
                                    onMouseLeave={() =>
                                        setChevronStates((prev) => ({
                                            ...prev,
                                            sLeftChev: !prev.sLeftChev,
                                        }))
                                    }
                                />
                                <div className="dashboard--trending">
                                    {suggestionsElement}
                                </div>
                                <TiChevronRight
                                    onClick={() => {
                                        if (
                                            suggestionsPointer <=
                                            suggestions.length - (cardLimit + 1)
                                        ) {
                                            setSuggestionsPointer(
                                                (prev) => prev + 1
                                            );
                                        }
                                    }}
                                    style={{
                                        minWidth: "30px",
                                        minHeight: "30px",
                                        background: chevronStates.sRightChev
                                            ? "rgba(255, 173, 58, .7)"
                                            : "rgb(255, 173, 58)",
                                        borderRadius: "20px",
                                        color: "white",
                                        cursor: chevronStates.sRightChev
                                            ? "pointer"
                                            : "default",
                                        transition: "linear all .2s",
                                    }}
                                    onMouseEnter={() =>
                                        setChevronStates((prev) => ({
                                            ...prev,
                                            sRightChev: !prev.sRightChev,
                                        }))
                                    }
                                    onMouseLeave={() =>
                                        setChevronStates((prev) => ({
                                            ...prev,
                                            sRightChev: !prev.sRightChev,
                                        }))
                                    }
                                />
                            </div>
                        </section>
                    </div>
                    <br></br>
                    <br></br>
                    <br></br>
                </div>
            )}
        </div>
    );
}
//features:
//-show total portfolio value with a line graph like stocks
//-show cards in portfolio below but only show like 5 unless user clicks
//show more and then direct to portfolio page that shows all the cards
//-show trending cards, either trending down in value or trending up in value
//-show a few cards in watchlist and do the same thing as with the portfolio

//disable the chevron if you cant click anymore
//display placeholder cards before the cards fully load
