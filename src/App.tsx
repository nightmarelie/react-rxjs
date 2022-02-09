import React, { FC, useCallback, useMemo } from "react";
import { useObservableState } from "observable-hooks";
import { BehaviorSubject, map, Observable, combineLatestWith } from "rxjs";
import "./App.css";
import { PokemonProvider, usePokemon, Pokemon } from "./store";

type DeckProps = {};

const Deck: FC<DeckProps> = () => {
  const { deck$ } = usePokemon();

  const deck = useObservableState(deck$, []);
  return (
    <div>
      <h4>Deck</h4>
      <div>
        {deck.map((p) => (
          <div key={p.id} style={{ display: "flex" }}>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
              alt={p.name}
            />
            <div>
              <div>{p.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

type SearchType = {
  value: string;
  onChange: (value: string) => void;
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
  search$: Observable<string>;
};

const List: FC<ListType> = ({ search$ }) => {
  const { pokemons$, selected$ } = usePokemon();

  const [filterPokemons] = useObservableState<Pokemon[]>(
    () =>
      pokemons$.pipe(
        combineLatestWith(search$),
        map(([pokemon, search]) =>
          pokemon.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
          )
        )
      ),
    []
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
  const search$ = useMemo(() => new BehaviorSubject(""), []);

  const value = useObservableState(search$);

  return (
    <PokemonProvider>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        <div>
          <Search value={value} onChange={(value) => search$.next(value)} />
          <List search$={search$} />
        </div>
        <Deck />
      </div>
    </PokemonProvider>
  );
}

export default App;
