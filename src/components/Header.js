import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Header({ setIsAuthenticated }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        fetch("https://frontend-take-home-service.fetch.com/auth/logout", {
            method: "POST",
            credentials: "include",
        }).then(() => {
            setIsAuthenticated(false);
            navigate("/");
        });
    };

    return (
        <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Fetch Dog Adoption</h1>
            <nav className="flex gap-6">
                <Link to="/search" className="hover:underline">Home</Link>
                <Link to="/favorites" className="hover:underline">Favorites</Link>
                <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition">
                    Logout
                </button>
            </nav>
        </header>
    );
}

export default Header;
