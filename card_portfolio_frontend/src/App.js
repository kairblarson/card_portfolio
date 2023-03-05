import Dashboard from "./components/Dashboard";
import Portfolio from "./components/Portfolio";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Watchlist from "./components/Watchlist";
import Explore from "./components/Explore";
import CardExpanded from "./components/CardExpanded";
import Login from "./components/Login";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Dashboard />}/>
                    <Route path="/dashboard" element={<Dashboard />}/>
                    <Route path="/portfolio" element={<Portfolio />}/>
                    <Route path="/watchlist" element={<Watchlist />}/>
                    <Route path="/explore" element={<Explore />}/>
                    <Route path="/card/:id" element={<CardExpanded />}/>
                    <Route path="/login" element={<Login />}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
