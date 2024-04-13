import { useState, useEffect } from "react";
import Player from "./Player.tsx";
import Controls from "./Controls.tsx";
import SpotifyData from "./SpotifyData.tsx";
import Playlist from "./Playlist.tsx";
import RecommendationSettingsView from "./RecommendationSettingsView.tsx";
import PlaylistSettingsView from "./PlaylistSettingsView.tsx";
import {
  Tokens,
  TrackObj,
  RecommendationSettings,
  PlaylistSettings,
} from "../../utils/types.ts";
import Heading from "../components/Heading.tsx";

interface TempoProps {
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

const defaultSettings: RecommendationSettings = {
  limit: 30,
  seed_artists: [],
  seed_genres: [],
  seed_tracks: [],
  acousticness: null,
  danceability: null,
  energy: null,
  instrumentalness: null,
  liveness: null,
  loudness: null,
  popularity: null,
  speechiness: null,
  tempo: null,
  valence: null,
  seed_count: 0,
};

const playlistDefaultSettings: PlaylistSettings = {
  name: "",
  public: true,
  tracks: [],
};

export default function Tempo(props: TempoProps) {
  console.log("hello");
  const [recommendations, setRecommendations] = useState(null);
  const [topTracks, setTopTracks] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [current_track, setTrack] = useState(track);
  const [player, setPlayer] = useState(undefined);
  const [recommendationSettings, setRecommendationSettings] =
    useState(defaultSettings);
  const [playlistSettings, setPlaylistSettings] = useState(
    playlistDefaultSettings
  );
  const [restart, setRestart] = useState(false);

  // When the components mount for the first time, fetch the user's top artists and tracks
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
    if (track.uri === current_track.uri) {
      if (player) {
        (player as any).togglePlay();
      }
    } else {
      const play = async () => {
        await fetch(`/api/play?track_uri=${track.uri}`);
        setTrack(track);
      };
      play();
    }
  };

  return (
    <main role="main" className="mt-5">
      {!playlist ? (
        <div className="row mt-5">
          <div className="col-12 col-md-3 px-4">
            <div className="row row-cols-4 row-cols-md-1 sticky-top">
              <div className="col">
                <Heading headingText="Tempo" />
                <p className="fs-7">
                  Select at least one song/artist (and up to 5) to get
                  recommendations for a playlist.
                </p>
              </div>
              <div className="col rounded-1">
                <Player
                  tokens={props.tokens}
                  current_track={current_track}
                  setTrack={setTrack}
                  player={player}
                  setPlayer={setPlayer}
                />
              </div>
              {!recommendations ? (
                <RecommendationSettingsView
                  recommendationSettings={recommendationSettings}
                  setRecommendations={setRecommendations}
                />
              ) : (
                <PlaylistSettingsView
                  playlistSettings={playlistSettings}
                  setPlaylistSettings={setPlaylistSettings}
                  setPlaylist={setPlaylist}
                />
              )}
              <div className="col">
                <p>
                  <a href="/log-out">Sign Out</a>
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-9 island rounded-1">
            {!recommendations ? (
              <>
                <SpotifyData
                  spotifyData={data}
                  currently_playing={current_track}
                  playTrack={updatePlayingSong}
                  recommendationSettings={recommendationSettings}
                  setRecommendationSettings={setRecommendationSettings}
                />
                <Controls
                  recommendationSettings={recommendationSettings}
                  setRecommendationSettings={setRecommendationSettings}
                />
              </>
            ) : (
              <SpotifyData
                spotifyData={data}
                currently_playing={current_track}
                playTrack={updatePlayingSong}
                playlistSettings={playlistSettings}
                setPlaylistSettings={setPlaylistSettings}
              />
            )}
          </div>
        </div>
      ) : (
        <>
          <Playlist
            setPlaylistSettings={setPlaylistSettings}
            defaultPlaylistSettings={playlistDefaultSettings}
            playlist={playlist}
            setPlaylist={setPlaylist}
            setRecommendationSettings={setRecommendationSettings}
            defaultRecommendationSettings={defaultSettings}
            setCurrentTrack={setTrack}
            curentTrack={current_track}
          />
        </>
      )}
    </main>
  );
}

Tempo.url = import.meta.url;
