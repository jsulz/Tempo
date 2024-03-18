import { useEffect, useRef, useState } from "react";

interface CounterProps {
  start: number;
  tokens: object;
  handleClick: object;
}

export default function Counter(props: CounterProps) {
  const [count, setCount] = useState(props.start);
  const [hydrated, setHydrated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      console.log("hydrated", performance.now());
      setHydrated(true);
    }
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    fetch("/api/artists");
  };

  return (
    <div ref={ref}>
      <p style={{ color: hydrated ? "green" : "red" }}>Hydrated</p>
      <p>{count}</p>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={(e) => handleClick(e)}>+1</button>
    </div>
  );
}

/**
 * This is key to make a component island compatible
 */
Counter.url = import.meta.url;
