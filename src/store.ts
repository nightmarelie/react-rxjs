import { BehaviorSubject, map, combineLatestWith } from "rxjs";

interface Pokemon {
  id: number;
  name: string;
  type: string[];
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
  power?: number;
  selected?: boolean;
}

const rawData$ = new BehaviorSubject<Pokemon[]>([]);

const rawDataWithPower$ = rawData$.pipe(
  map((pokemon) =>
    pokemon.map((p) => ({
      ...p,
      power:
        p.hp +
        p.attack +
        p.defense +
        p.special_attack +
        p.special_defense +
        p.speed,
    }))
  )
);

const selected$ = new BehaviorSubject<number[]>([]);

const pokemons$ = rawData$.pipe(
  combineLatestWith(selected$),
  map(([pokemon, selected]) =>
    pokemon.map((p) => ({
      ...p,
      selected: selected.includes(p.id),
    }))
  )
);

const deck$ = pokemons$.pipe(
  map((pokemon) => pokemon.filter((p) => p.selected))
);

fetch("/data.json")
  .then((res) => res.json())
  .then((data) => rawData$.next(data));

export type { Pokemon };

export { rawData$, rawDataWithPower$, selected$, pokemons$, deck$ };
