interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

export function PokemonCards({ PokemonData }: { PokemonData: PokemonDetail }) {
  return (
    <div className="card">
      <div className="card-top">
        <img src={PokemonData.sprites.front_default} alt={PokemonData.name} />
      </div>
      <h2>{PokemonData.name}</h2>
      <p>ID: {PokemonData.id}</p>
    </div>
  );
}
