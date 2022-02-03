import { useMultiCombinations } from "./useKeyCombinations";

const App = () => {
  useMultiCombinations([
    {
      combination: ["CONTROL", "KEY-P", "DIGIT-1"],
      callBack: (e) => {
        console.log({ key: e.key });
      },
      preventDefault: true,
    },
    {
      combination: ["ALT", "CONTROL", "KEY-A"],
      callBack: (e) => {
        console.log({ key: e.code });
      },
      preventDefault: true,
    },
    {
      combination: ["ALT", "KEY-X"],
      callBack: (e) => {
        console.log({ key: e.code });
      },
      preventDefault: true,
    },
    {
      combination: ["CONTROL", "SHIFT", "DIGIT-1"],
      callBack: (e) => {
        console.log({ key: e.code });
      },
      preventDefault: true,
    },
  ]);

  return <input type="text" />;
};

export default App;
