export default function Tempo() {
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
