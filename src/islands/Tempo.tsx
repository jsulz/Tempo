import { useState, useRef, useEffect } from "react";

interface TempoProps {
  start: number;
}

export default function Tempo(props: TempoProps) {
  // If we don't have recommendations, then we should show getrecommendations and get info from Spofity
  // If we do have recommendations, then we should show buildplaylist and let the user create the playlist in spotify
  const [recommendations, setRecommendations] = useState(null);
  const [topTracks, setTopTracks] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [count, setCount] = useState(props.start);
  const [hydrated, setHydrated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      console.log("hydrated", performance.now());
      setHydrated(true);
    }
    console.log("thello");
    const fetchData = async () => {
      console.log("here");
      const getTopArtists = await (await fetch("/api/artists")).json();
      const getTopTracks = await (await fetch("/api/tracks")).json();
      setTopArtists(getTopArtists);
      setTopTracks(getTopTracks);
    };
    fetchData();
  }, []);

  console.log(topArtists);
  console.log(topTracks);

  if (topArtists && topTracks && !recommendations) {
    const fetchRecommendations = async () => {
      const params = new URLSearchParams({
        seed_artists: topArtists.artists[0].id,
        seed_songs: topTracks.tracks[0].id,
      });
      const getRecommendations = await (
        await fetch(`api/recommendations?${params}`)
      ).json();
      setRecommendations(getRecommendations);
    };
    fetchRecommendations();
  }

  console.log(recommendations);

  return (
    <div>
      <p>
        <a href="/log-out">Sign Out</a>
      </p>
      <div ref={ref}>
        <p style={{ color: hydrated ? "green" : "red" }}>Hydrated</p>
        <p>{count}</p>
        <button onClick={() => setCount(count - 1)}>-1</button>
        <button onClick={() => setCount(count + 1)}>+1</button>
      </div>
    </div>
  );
}

Tempo.url = import.meta.url;
