import { useState, useRef, useEffect } from "react";
import Player from "./Player.tsx";
import Controls from "./Controls.tsx";
import SpotifyData from "./SpotifyData.tsx";
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

  let data = null;
  if (recommendations === null && topArtists !== null && topTracks !== null) {
    data = [topTracks, topArtists];
  } else if (recommendations !== null) {
    data = [recommendations];
  }

  /*
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
  */

  console.log(recommendations);

  return (
    <main role="main">
      <div className="row mt-5 ">
        <div className="col-12 col-md-9">
          <Player tokens={props.tokens} />
          {!recommendations ? (
            <SpotifyData data={data} />
          ) : (
            <SpotifyData data={data} />
          )}
        </div>
        <div className="col-12 col-md-3">
          <div className="row">
            <p>
              <a href="/log-out">Sign Out</a>
            </p>
          </div>
          <div className="row">
            <Controls />
          </div>
        </div>
        <p style={{ color: hydrated ? "green" : "red" }}>Hydrated</p>
        <p>{count}</p>
        <button onClick={() => setCount(count - 1)}>-1</button>
        <button onClick={() => setCount(count + 1)}>+1</button>
      </div>
    </main>
  );
}

Tempo.url = import.meta.url;
