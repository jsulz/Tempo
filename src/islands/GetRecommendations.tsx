import island from "ultra/hooks/use-island.js";
import Counter from "./Counter.tsx";
const CounterIsland = island(Counter);

export default function GetRecommendations() {
  return (
    <>
      <div>Hello, get recommendations.</div>
    </>
  );
}
