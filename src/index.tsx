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
    if (keys.length !== current.size) {
      return;
    }

    const currentIt = current.values();

    const isEqual = keys.every((item) => {
      return item === currentIt.next().value;
    });

    if (isEqual) {
      callback();
    }
  }, [callback, current, keys]);

  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      if (preventDefault) {
        e.preventDefault();
      }

      const newSet = new Set(current);

      const key = e.key.toUpperCase();

      if (newSet.has(key)) {
        return;
      } else {
        newSet.add(key);
        setCurrent(newSet);
      }
    };

    const upHandler = (e: KeyboardEvent) => {
      if (preventDefault) {
        e.preventDefault();
      }

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
  }, [callback, current, preventDefault]);
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
