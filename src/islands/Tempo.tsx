import { useState, useRef, useEffect } from "react";
import Player from "./Player.tsx";
interface TempoProps {
  start: number;
  tokens: object;
}

export default function Tempo(props: TempoProps) {
  // If we don't have recommendations, then we should show getrecommendations and get info from Spofity
  // If we do have recommendations, then we should show buildplaylist and let the user create the playlist in spotify
  const [recommendations, setRecommendations] = useState(null);
  const [topTracks, setTopTracks] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [count, setCount] = useState(props.start);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const getTopArtists = await (await fetch("/api/artists")).json();
      const getTopTracks = await (await fetch("/api/tracks")).json();
      if (getTopArtists && getTopTracks) {
        setTopArtists(getTopArtists);
        setTopTracks(getTopTracks);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
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
    if (topTracks && topArtists) {
      fetchRecommendations();
    }
  }, [topTracks, topArtists]);

  console.log(recommendations);

  return (
    <div>
      <Player tokens={props.tokens} />
      <p>
        <a href="/log-out">Sign Out</a>
      </p>
      <p style={{ color: hydrated ? "green" : "red" }}>Hydrated</p>
      <p>{count}</p>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <script src="https://open.spotify.com/embed/iframe-api/v1" async></script>
    </div>
  );
}

Tempo.url = import.meta.url;
