import { useState, useEffect } from "react";
import Player from "./Player.tsx";
import Controls from "./Controls.tsx";
import SpotifyData from "./SpotifyData.tsx";
import { Tokens, TrackObj } from "../../utils/types.ts";

interface TempoProps {
  start: number;
  tokens: Tokens;
}

const track: TrackObj = {
  name: "",
  duration: 0,
  popularity: 0,
  id: "",
  album: {
    images: [{ height: 1, width: 1, size: "UNKNOWN", url: "" }],
    name: "",
    release_date: "",
    artists: [],
  },
  artists: [
    {
      name: "",
      id: "",
      genres: [""],
      images: [],
      popularity: 0,
      external_urls: { spotify: "" },
    },
  ],
};

export default function Tempo(props: TempoProps) {
  // If we don't have recommendations, then we should show getrecommendations and get info from Spofity
  // If we do have recommendations, then we should show buildplaylist and let the user create the playlist in spotify
  const [recommendations, setRecommendations] = useState(null);
  const [topTracks, setTopTracks] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [current_track, setTrack] = useState(track);
  const [player, setPlayer] = useState(undefined);

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

  const updatePlayingSong = async (track: TrackObj) => {
    console.log(track.uri, current_track.uri);
    if (track.uri === current_track.uri) {
      player.togglePlay();
    } else {
      const play = async () => {
        await fetch(`/api/play?track_uri=${track.uri}`);
        setTrack(track);
      };
      play();
    }
  };

  return (
    <main role="main">
      <div className="row mt-3">
        <div className="col-12 col-md-3 mt-5 sticky-top vh-100">
          <div className="row row-cols-4 row-cols-md-1 sticky-top">
            <div className="col mt-5">
              <Player
                tokens={props.tokens}
                current_track={current_track}
                setTrack={setTrack}
                player={player}
                setPlayer={setPlayer}
              />
            </div>
            <p className="mt-auto">
              <a href="/log-out">Sign Out</a>
            </p>
          </div>
        </div>
        <div className="col-12 col-md-9">
          {!recommendations ? (
            <SpotifyData
              spotifyData={data}
              currently_playing={current_track}
              playTrack={updatePlayingSong}
            />
          ) : (
            <SpotifyData
              spotifyData={data}
              currently_playing={current_track}
              playTrack={updatePlayingSong}
            />
          )}
          <Controls />
        </div>
      </div>
    </main>
  );
}

Tempo.url = import.meta.url;
