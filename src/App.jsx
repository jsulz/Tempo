import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const options = { credentials: "include" };
    fetch("http://localhost:8000/api/auth", options)
      .then(async (response) => await response.json())
      .then((json) => console.log(json));
  }, []);

  return (
    <>
      <h1>Hello</h1>
    </>
  );
}

export default App;
