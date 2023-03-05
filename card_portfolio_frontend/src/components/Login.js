import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import CustomNavbar from "./CustomNavbar";
import { Alert } from "react-bootstrap";
import { motion } from "framer-motion";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alertType, setAlertType] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const { id } = useParams();

    useEffect(() => {
        fetch(`http://localhost:8080/session-id`, {
            credentials: "include",
            method: "GET",
        })
            .then((res) => {
                return res.text();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log("ERROR:", error);
            });
    }, []);

    function handleSubmit() {
        fetch(`http://localhost:8080/process`, {
            credentials: "include",
            method: "POST",
            body: new URLSearchParams({
                email: email,
                password: password,
                grant_type: "ROLE_USER",
            }),
        })
            .then((res) => {
                if (res.status == 200 || res.status == 500) {
                    return "success";
                }
                return "bad credentials";
            })
            .then((data) => {
                if (data == "success") {
                    window.location = "http://localhost:3000/dashboard";
                } else {
                    console.log("HERE");
                    setAlertType("danger");
                    setAlertMessage("Email and password do not match.");
                }
            })
            .catch((error) => {
                console.log("ERROR:", error);
            });
    }
    function handleReset() {}
    function handleSignUp() {}

    return (
        <div className="login">
            <CustomNavbar />
            <br></br>
            <br></br>
            <br></br>
            <div className="login--content">
                {alertMessage != "" && (
                    <motion.div
                        style={{
                            width: "100%",
                            maxWidth: "700px",
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
                <div className="login--main">
                    <h1 className="login--header">Login to Cardify</h1>
                    <br></br>
                    <div className="login--fields">
                        <Form.Group
                            className="mb-3 w-100"
                            controlId="formBasicEmail"
                        >
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSubmit();
                                    }
                                }}
                            />
                        </Form.Group>
                        <br></br>
                        <Form.Group
                            className="mb-3 w-100"
                            controlId="formBasicEmail"
                        >
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSubmit();
                                    }
                                }}
                            />
                        </Form.Group>
                    </div>
                    <br></br>
                    <div className="login--buttons">
                        <Button
                            onClick={handleSubmit}
                            variant="primary"
                            className="w-50"
                        >
                            Login
                        </Button>
                        <Button
                            onClick={handleReset}
                            variant="danger"
                            className="w-50"
                        >
                            Reset
                        </Button>
                    </div>
                    <br></br>
                    <p style={{ textAlign: "center" }}>OR</p>
                    <br></br>
                    <div className="login--buttons">
                        <Button
                            onClick={handleSignUp}
                            variant="secondary"
                            className="w-100"
                        >
                            Sign up
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
