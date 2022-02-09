import React, { FC, useEffect, useMemo, useState } from "react";
import "./App.css";
import { Pokemon, selected$, pokemons$, deck$ } from "./store";

type DeckProps = {};

const Deck: FC<DeckProps> = () => {
  return <h4>Deck</h4>;
};

type SearchType = {
  value: string;
  onChange: (data: string) => void;
};

const Search: FC<SearchType> = ({ value, onChange }) => {
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

type ListType = {
  value: string;
};

const List: FC<ListType> = ({ value }) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    const sub = pokemons$.subscribe(setPokemons);

    return () => sub.unsubscribe();
  }, []);

  const filterPokemons = useMemo(
    () =>
      pokemons.filter((p) =>
        p.name.toLowerCase().includes(value.toLowerCase())
      ),
    [pokemons, value]
  );

  return (
    <>
      {filterPokemons.map((p) => (
        <div key={p.id}>
          <input
            type="checkbox"
            checked={p.selected}
            onChange={() => {
              if (selected$.value.includes(p.id)) {
                selected$.next(selected$.value.filter((id) => id !== p.id));
              } else {
                selected$.next([...selected$.value, p.id]);
              }
            }}
          />
          <strong>{p.name}</strong> - {p.power}
        </div>
      ))}
    </>
  );
};
function App() {
  const [search, setSearch] = useState("");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
      }}
    >
      <div>
        <Search value={search} onChange={setSearch} />
        <List value={search} />
      </div>
      <Deck />
    </div>
  );
}

export default App;
