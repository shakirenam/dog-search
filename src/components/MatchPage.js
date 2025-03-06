import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function MatchPage() {
    const { matchId } = useParams(); // ✅ Get matched dog ID from URL
    const [matchedDog, setMatchedDog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!matchId) {
            setLoading(false);
            setError("Invalid Match ID.");
            return;
        }

        console.log("Fetching dog details for Match ID:", matchId); // ✅ Debugging Log

        // ✅ Fetch the full dog details using the matched dog ID
        fetch("https://frontend-take-home-service.fetch.com/dogs", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([matchId]), // API requires an array of IDs
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch matched dog.");
                return res.json();
            })
            .then((data) => {
                console.log("Dog details received:", data); // ✅ Debugging Log
                if (data.length > 0) {
                    setMatchedDog(data[0]); // ✅ Store the matched dog's details
                } else {
                    setMatchedDog(null);
                    setError("No matching dog found.");
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching matched dog:", error);
                setMatchedDog(null);
                setError("Failed to load match.");
                setLoading(false);
            });
    }, [matchId]);

    return (
        <div className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-6">Your Perfect Match! 🐶</h1>

            {loading ? (
                <p className="text-xl text-gray-500">Loading your match...</p>
            ) : error ? (
                <p className="text-red-500 text-xl">{error}</p>
            ) : matchedDog ? (
                <div className="bg-white p-6 rounded-lg shadow-md inline-block">
                    <img src={matchedDog.img} alt={matchedDog.name} className="w-64 h-64 object-cover rounded-lg" />
                    <h2 className="text-2xl font-semibold mt-4">{matchedDog.name}</h2>
                    <p className="text-gray-600">Breed: {matchedDog.breed}</p>
                    <p className="text-gray-600">Age: {matchedDog.age} years</p>
                </div>
            ) : (
                <p className="text-red-500 text-xl">No match found. Try selecting more favorites.</p>
            )}

            <div className="mt-6">
                <Link to="/search" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Search Again
                </Link>
            </div>
        </div>
    );
}

export default MatchPage;
