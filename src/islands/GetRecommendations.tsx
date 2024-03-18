import island from "ultra/hooks/use-island.js";
import Counter from "./Counter.tsx";
const CounterIsland = island(Counter);

export default function GetRecommendations() {
  return (
    <>
      <p>
        <a href="/log-out">Sign Out</a>
      </p>
      <div>Hello, get recommendations.</div>
      <CounterIsland start={10} hydrationStrategy="visible" />
    </>
  );
}
