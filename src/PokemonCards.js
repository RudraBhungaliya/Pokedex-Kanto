import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function PokemonCards({ PokemonData }) {
    return (_jsxs("div", { className: "card", children: [_jsx("div", { className: "card-top", children: _jsx("img", { src: PokemonData.sprites.front_default, alt: PokemonData.name }) }), _jsx("h2", { children: PokemonData.name }), _jsxs("p", { children: ["ID: ", PokemonData.id] })] }));
}
