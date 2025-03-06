import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function SearchPage({ favorites, setFavorites }) {
    const [dogs, setDogs] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [selectedBreed, setSelectedBreed] = useState("");
    const [page, setPage] = useState(0);
    const [sortOrder, setSortOrder] = useState("asc");
    const [totalResults, setTotalResults] = useState(0);
    const pageSize = 12;

    useEffect(() => {
        fetchBreeds();
        fetchDogs();
    }, [selectedBreed, page, sortOrder]);

    const fetchBreeds = async () => {
        const response = await fetch("https://frontend-take-home-service.fetch.com/dogs/breeds", { credentials: "include" });
        setBreeds(await response.json());
    };

    const fetchDogs = async () => {
        const params = new URLSearchParams();

        if (selectedBreed) {
            params.append("breeds", selectedBreed);
        }

        params.append("size", pageSize);
        params.append("from", page * pageSize);
        params.append("sort", `breed:${sortOrder}`);

        try {
            const response = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search?${params.toString()}`, {
                credentials: "include",
            });

            const data = await response.json();

            if (data.resultIds.length > 0) {
                const dogDetails = await fetchDogsByIds(data.resultIds);
                setDogs(dogDetails);
                setTotalResults(data.total);
            }
        } catch (error) {
            console.error("Error fetching dogs:", error);
        }
    };

    const fetchDogsByIds = async (ids) => {
        try {
            const response = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ids),
            });

            return response.json();
        } catch (error) {
            console.error("Error fetching dog details:", error);
            return [];
        }
    };

    const toggleFavorite = (id) => {
        setFavorites(favorites.includes(id) ? favorites.filter(fav => fav !== id) : [...favorites, id]);
    };


    const totalPages = Math.ceil(totalResults / pageSize);
    const maxPagesToShow = 5;
    const startPage = Math.max(0, Math.min(page - Math.floor(maxPagesToShow / 2), totalPages - maxPagesToShow));
    const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);
    const pages = [];

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Search for a Dog</h1>
                <Link to="/favorites" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                    View Favorites ({favorites.length})
                </Link>
            </div>

            <div className="flex justify-center gap-4 mb-6">
                <select
                    value={selectedBreed}
                    onChange={(e) => {
                        setSelectedBreed(e.target.value);
                        setPage(0);  // Reset pagination when breed changes
                    }}
                    className="p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400">
                    <option value="">All Breeds</option>
                    {breeds.map((breed) => (
                        <option key={breed} value={breed}>{breed}</option>
                    ))}
                </select>
                <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                    Sort: {sortOrder === "asc" ? "Descending" : "Ascending"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dogs.map((dog) => (
                    <div key={dog.id} className="bg-white p-4 rounded-lg shadow-md">
                        <img src={dog.img} alt={dog.name} className="w-full h-48 object-cover rounded-lg" />
                        <h2 className="text-xl font-semibold mt-2">{dog.name}</h2>
                        <p className="text-gray-600">Breed: {dog.breed}</p>
                        <button onClick={() => toggleFavorite(dog.id)}
                                className={`mt-2 py-1 px-4 rounded text-white ${favorites.includes(dog.id) ? "bg-red-500" : "bg-gray-500"} transition`}>
                            {favorites.includes(dog.id) ? "Unfavorite" : "Favorite"}
                        </button>
                    </div>
                ))}
            </div>

            {/* Pagination Section */}
            <div className="flex justify-center mt-6 gap-2">
                {page > 0 && (
                    <button onClick={() => setPage(0)} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
                        First
                    </button>
                )}

                {page > 0 && (
                    <button onClick={() => setPage(page - 1)} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
                        Prev
                    </button>
                )}

                {pages.map((p) => (
                    <button key={p} onClick={() => setPage(p)}
                            className={`px-3 py-1 rounded ${p === page ? "bg-blue-600 text-white" : "bg-gray-300 text-black hover:bg-gray-400"}`}>
                        {p + 1}
                    </button>
                ))}

                {page < totalPages - 1 && (
                    <button onClick={() => setPage(page + 1)} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
                        Next
                    </button>
                )}

                {page < totalPages - 1 && (
                    <button onClick={() => setPage(totalPages - 1)} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
                        Last
                    </button>
                )}
            </div>
        </div>
    );
}

export default SearchPage;
