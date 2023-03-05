import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { InputGroup, Form, Button } from "react-bootstrap";
import { RxHamburgerMenu, RxMagnifyingGlass } from "react-icons/rx";

export default function CustomNavbar({ variant }) {
    function handleSignout() {
        fetch(`http://localhost:8080/logout`, {
            credentials: "include",
            method: "POST",
        })
            .then((res) => res.text())
            .then((data) => {
                window.location = "http://localhost:3000/login";
            })
            .catch((error) => {
                console.log("ERROR:", error);
            });
    }

    return (
        <div className="customnavbar">
            <div className="customnavbar--left">
                <h1 className="customnavbar--header">Cardify</h1>
            </div>
            <div className="hamburger-menu">
                <input id="menu__toggle" type="checkbox" />
                <label className="menu__btn" htmlFor="menu__toggle">
                    <span></span>
                </label>
                <ul className="menu__box">
                    <li>
                        <a
                            className="menu__item"
                            onClick={() =>
                                (window.location =
                                    "http://localhost:3000/dashboard")
                            }
                        >
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a
                            className="menu__item"
                            onClick={() =>
                                (window.location =
                                    "http://localhost:3000/portfolio")
                            }
                        >
                            Portfolio
                        </a>
                    </li>
                    <li>
                        <a
                            className="menu__item"
                            onClick={() =>
                                (window.location = `http://localhost:3000/explore`)
                            }
                        >
                            Explore
                        </a>
                    </li>
                    <li>
                        <a className="menu__item" onClick={handleSignout}>
                            Sign out
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}
