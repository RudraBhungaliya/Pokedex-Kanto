import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import "./index.css";
import { PokemonCards } from "./PokemonCards";
export default function App() {
    const API = "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0";
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [description, setDescription] = useState("");
    const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const fetchPokemon = async () => {
        try {
            const res = await fetch(API);
            const data = await res.json();
            const details = data.results.map(async (curr) => {
                const res = await fetch(curr.url);
                const data = await res.json();
                return data;
            });
            const detailedResponses = await Promise.all(details);
            setPokemon(detailedResponses);
            setLoading(false);
        }
        catch (err) {
            console.error("Fetching Failed!", err);
            setLoading(false);
            setError(err instanceof Error ? err : new Error("Something went wrong"));
        }
    };
    const handlePokemonClick = async (poke) => {
        setSelectedPokemon(poke);
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${poke.id}`);
            const data = await res.json();
            const flavor = data.flavor_text_entries.find((entry) => entry.language.name === "en");
            setDescription(flavor
                ? flavor.flavor_text.replace(/\f/g, " ")
                : "No description available.");
        }
        catch (err) {
            setDescription("Failed to load description.");
        }
    };
    useEffect(() => {
        fetchPokemon();
    }, []);
    if (loading) {
        return (_jsx("div", { children: _jsx("h1", { children: "Loading..." }) }));
    }
    if (error) {
        return (_jsx("div", { children: _jsx("h1", { children: error.message }) }));
    }
    return (_jsxs("div", { children: [_jsx("header", { children: _jsx("h1", { children: "Gotta Catch 'Em All" }) }), _jsx("div", { className: "cards", children: pokemon.map((curr) => (_jsx("div", { onClick: () => handlePokemonClick(curr), style: { cursor: "pointer" }, children: _jsx(PokemonCards, { PokemonData: curr }) }, curr.id))) }), selectedPokemon && (_jsx("div", { className: "modal-overlay", onClick: () => setSelectedPokemon(null), children: _jsxs("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [_jsx("img", { src: selectedPokemon.sprites.front_default, alt: selectedPokemon.name }), _jsxs("h2", { children: ["#", selectedPokemon.id, " ", capitalizeFirst(selectedPokemon.name)] }), _jsxs("p", { children: [_jsx("strong", { children: "Height:" }), " ", (selectedPokemon.height / 10).toFixed(1), " m (", ((selectedPokemon.height / 10) * 3.28084).toFixed(1), " ft)"] }), _jsxs("p", { children: [_jsx("strong", { children: "Weight:" }), " ", (selectedPokemon.weight / 10).toFixed(1), " kg (", ((selectedPokemon.weight / 10) * 2.20462).toFixed(1), " lbs)"] }), _jsxs("p", { children: [_jsx("strong", { children: "Types:" }), " ", selectedPokemon.types
                                    .map((t) => capitalizeFirst(t.type.name))
                                    .join(", ")] }), _jsxs("p", { children: [_jsx("strong", { children: "Description:" }), " ", description] }), _jsx("p", { children: _jsx("strong", { children: "Stats:" }) }), _jsx("ul", { children: selectedPokemon.stats.map((s) => (_jsxs("li", { children: [capitalizeFirst(s.stat.name), ": ", s.base_stat] }, s.stat.name))) }), _jsx("button", { onClick: () => setSelectedPokemon(null), children: "Close" })] }) }))] }));
}
