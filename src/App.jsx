import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { tw } from "twind";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <img src="/vite-deno.svg" alt="Vite with Deno" />
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <h1
        className={tw`font-bold text(center 5xl white sm:gray-800 md:pink-700)`}
      >
        This is Twind!
      </h1>
    </>
  );
}

export default App;
