import { useEffect, useState } from "react";
import "./index.css";
import { PokemonCards } from "./PokemonCards";

interface PokemonListResponse {
  results: { name: string; url: string }[];
}

interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  height: number; // in decimetres
  weight: number; // in hectograms
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}

export default function App() {
  const API = "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0";
  const [pokemon, setPokemon] = useState<PokemonDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(
    null
  );
  const [description, setDescription] = useState<string>("");

  const capitalizeFirst = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const fetchPokemon = async () => {
    try {
      const res = await fetch(API);
      const data: PokemonListResponse = await res.json();

      const details = data.results.map(async (curr): Promise<PokemonDetail> => {
        const res = await fetch(curr.url);
        const data = await res.json();
        return data;
      });

      const detailedResponses = await Promise.all(details);
      setPokemon(detailedResponses);
      setLoading(false);
    } catch (err: unknown) {
      console.error("Fetching Failed!", err);
      setLoading(false);
      setError(
        err instanceof Error ? err : new Error("Something went wrong")
      );
    }
  };

  const handlePokemonClick = async (poke: PokemonDetail) => {
    setSelectedPokemon(poke);
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${poke.id}`
      );
      const data = await res.json();
      const flavor = data.flavor_text_entries.find(
        (entry: any) => entry.language.name === "en"
      );
      setDescription(
        flavor
          ? flavor.flavor_text.replace(/\f/g, " ")
          : "No description available."
      );
    } catch (err) {
      setDescription("Failed to load description.");
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>{error.message}</h1>
      </div>
    );
  }

  return (
    <div>
      <header>
        <h1>Gotta Catch 'Em All</h1>
      </header>
      <div className="cards">
        {pokemon.map((curr) => (
          <div
            key={curr.id}
            onClick={() => handlePokemonClick(curr)}
            style={{ cursor: "pointer" }}
          >
            <PokemonCards PokemonData={curr} />
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPokemon && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedPokemon(null)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPokemon.sprites.front_default}
              alt={selectedPokemon.name}
            />
            <h2>
              #{selectedPokemon.id} {capitalizeFirst(selectedPokemon.name)}
            </h2>
            <p>
              <strong>Height:</strong>{" "}
              {(selectedPokemon.height / 10).toFixed(1)} m (
              {((selectedPokemon.height / 10) * 3.28084).toFixed(1)} ft)
            </p>
            <p>
              <strong>Weight:</strong>{" "}
              {(selectedPokemon.weight / 10).toFixed(1)} kg (
              {((selectedPokemon.weight / 10) * 2.20462).toFixed(1)} lbs)
            </p>
            <p>
              <strong>Types:</strong>{" "}
              {selectedPokemon.types
                .map((t) => capitalizeFirst(t.type.name))
                .join(", ")}
            </p>
            <p>
              <strong>Description:</strong> {description}
            </p>
            <p>
              <strong>Stats:</strong>
            </p>
            <ul>
              {selectedPokemon.stats.map((s) => (
                <li key={s.stat.name}>
                  {capitalizeFirst(s.stat.name)}: {s.base_stat}
                </li>
              ))}
            </ul>

            <button onClick={() => setSelectedPokemon(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
