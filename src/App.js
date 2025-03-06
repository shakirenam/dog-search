import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import LoginPage from "./components/LoginPage";
import SearchPage from "./components/SearchPage";
import FavoritesPage from "./components/FavoritesPage";
import MatchPage from "./components/MatchPage";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const token = document.cookie.includes("fetch-access-token");
        setIsAuthenticated(token);
    }, []);

    return (
        <Router>
            {isAuthenticated && <Header setIsAuthenticated={setIsAuthenticated} />}
            <Routes>
                <Route path="/" element={isAuthenticated ? <Navigate to="/search" /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/search" element={isAuthenticated ? <SearchPage favorites={favorites} setFavorites={setFavorites} /> : <Navigate to="/" />} />
                <Route path="/favorites" element={isAuthenticated ? <FavoritesPage favorites={favorites} setFavorites={setFavorites} /> : <Navigate to="/" />} />
                <Route path="/match/:matchId" element={isAuthenticated ? <MatchPage /> : <Navigate to="/" />} /> {/* ✅ Fix: Dynamic Match Page Route */}
            </Routes>
        </Router>
    );
}

export default App;
