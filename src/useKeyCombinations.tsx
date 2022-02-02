import { useEffect, useMemo, useState } from "react";

type BaseKeys = "ALT" | "CONTROL" | "META";
type AlphaNum =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z"
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9";

type Two = `${BaseKeys}+${AlphaNum}`;
type Three = `${BaseKeys}+${AlphaNum}+${AlphaNum}`;
type Combinations = Two | Three;

export const useKeyCombinations = (
  combination: Combinations,
  callback: () => void,
  preventDefault = false
) => {
  const keys = useMemo(() => {
    return combination.split("+");
  }, [combination]);
  const [current, setCurrent] = useState<Set<string>>(new Set([]));

  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      const newSet = new Set(current);

      const key = e.key.toUpperCase();

      if (newSet.has(key)) {
        return;
      } else {
        newSet.add(key);
        setCurrent(newSet);
      }

      const isMatching = [...newSet.values()].every((item, idx) => {
        return item === keys[idx];
      });

      if (isMatching && preventDefault) {
        e.preventDefault();
      }

      if (keys.length === newSet.size && isMatching) {
        callback();
      }
    };

    const upHandler = (e: KeyboardEvent) => {
      const newCurrent = [...current.values()];
      const { length } = newCurrent;
      const key = e.key.toUpperCase();

      if (newCurrent[length - 1] === key) {
        newCurrent.pop();

        setCurrent(new Set(newCurrent));
      } else {
        setCurrent(new Set([]));
      }
    };

    document.addEventListener("keydown", downHandler);
    document.addEventListener("keyup", upHandler);

    return () => {
      document.removeEventListener("keydown", downHandler);
      document.removeEventListener("keyup", upHandler);
    };
  }, [callback, current, keys, preventDefault]);
};
