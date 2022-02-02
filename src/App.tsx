import { useKeyCombinations } from "./useKeyCombinations";

const App = () => {
  useKeyCombinations(
    "CONTROL+P+A",
    () => {
      console.log("check");
    },
    true
  );

  return <input type="text" />;
};

export default App;
