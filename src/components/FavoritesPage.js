import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function FavoritesPage({ favorites, setFavorites }) {
    const [favoriteDogs, setFavoriteDogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (favorites.length === 0) return;

        //Fetch full dog details from API
        fetch("https://frontend-take-home-service.fetch.com/dogs", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(favorites),
        })
            .then((res) => res.json())
            .then((data) => setFavoriteDogs(data))
            .catch((error) => console.error("Error fetching favorite dogs:", error));
    }, [favorites]);

    const removeFavorite = (id) => {
        setFavorites(favorites.filter(fav => fav !== id));
    };

    const findMatch = async () => {
        if (favorites.length === 0) return alert("No favorite dogs selected!");

        try {
            const response = await fetch("https://frontend-take-home-service.fetch.com/dogs/match", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(favorites),
            });

            if (!response.ok) throw new Error("Failed to find a match.");

            const data = await response.json();
            if (data.match) {
                navigate(`/match/${data.match}`); // Redirect to the match page with matched dog ID
            } else {
                alert("No match found. Try selecting more favorites.");
            }
        } catch (error) {
            console.error("Error finding match:", error);
            alert("Something went wrong. Please try again.");
        }
    };



    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-center mb-6">Your Favorite Dogs</h1>

            {favoriteDogs.length === 0 ? (
                <p className="text-center text-gray-600">No favorites selected.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteDogs.map((dog) => (
                        <div key={dog.id} className="bg-white p-4 rounded-lg shadow-md">
                            <img src={dog.img} alt={dog.name} className="w-full h-48 object-cover rounded-lg" />
                            <h2 className="text-xl font-semibold mt-2">{dog.name}</h2>
                            <p className="text-gray-600">Breed: {dog.breed}</p>
                            <button onClick={() => removeFavorite(dog.id)}
                                    className="mt-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 transition">
                                Remove from Favorites
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-center mt-6 gap-4">
                <button onClick={findMatch} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition">
                    Find My Match
                </button>
                <Link to="/search" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Back to Search
                </Link>
            </div>
        </div>
    );
}

export default FavoritesPage;
