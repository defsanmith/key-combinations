import { useEffect, useState } from "react";

type BaseKeys = "ALT" | "CONTROL" | "META" | "SHIFT";
type Alpha =
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
  | "Z";

type Nums = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type Combination = [
  BaseKeys,
  BaseKeys | `KEY-${Alpha}` | `DIGIT-${Nums}`,
  (`KEY-${Alpha}` | `DIGIT-${Nums}`)?
];

interface KeyCombination {
  combination: Combination;
  callBack: (e: KeyboardEvent) => void;
  preventDefault?: boolean;
}

export const useMultiCombinations = (combinations: KeyCombination[]) => {
  const [current, setCurrent] = useState<Set<string>>(new Set([]));

  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      if (e.repeat) {
        return;
      }

      const newCurrent = new Set(current);

      const key = e.code.toUpperCase();

      if (newCurrent.has(key)) {
        return;
      } else {
        newCurrent.add(key);
        setCurrent(newCurrent);
      }

      const matched = combinations.find(({ combination }) => {
        return [...newCurrent].every((key, idx) => {
          return key.includes(combination[idx]?.split("-").join("") || "");
        });
      });

      if (matched && matched.preventDefault) {
        e.preventDefault();
      }

      if (matched?.combination.length === newCurrent.size) {
        matched.callBack(e);
      }
    };

    const upHandler = (e: KeyboardEvent) => {
      if (e.repeat) {
        return;
      }

      const newCurrent = [...current.values()];
      const { length } = newCurrent;
      const key = e.code.toUpperCase();

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
  }, [combinations, current]);
};

export const useKeyCombinations = (
  combination: Combination,
  callback: (e: KeyboardEvent) => void,
  preventDefault = false
) => {
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
        return item === combination[idx];
      });

      if (isMatching && preventDefault) {
        e.preventDefault();
      }

      if (combination.length === newSet.size && isMatching) {
        callback(e);
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
  }, [callback, current, combination, preventDefault]);
};
