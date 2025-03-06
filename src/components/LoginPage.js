import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ setIsAuthenticated }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        const response = await fetch("https://frontend-take-home-service.fetch.com/auth/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email }),
        });

        if (response.ok) {
            setIsAuthenticated(true);
            navigate("/search");
        } else {
            alert("Login failed!");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">Login</h1>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
                       className="w-full p-3 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-blue-400" />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                       className="w-full p-3 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-blue-400" />
                <button onClick={handleLogin}
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                    Login
                </button>
            </div>
        </div>
    );
}

export default LoginPage;
