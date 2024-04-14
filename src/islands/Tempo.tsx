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

const testPlaylist = {
  collaborative: false,
  description: "",
  external_urls: {
    spotify: "https://open.spotify.com/playlist/2Zi5lAJD9TX0SjNWfIcc6o",
  },
  followers: {
    href: null,
    total: 0,
  },
  href: "https://api.spotify.com/v1/playlists/2Zi5lAJD9TX0SjNWfIcc6o?locale=*",
  id: "2Zi5lAJD9TX0SjNWfIcc6o",
  images: [
    {
      height: null,
      url: "https://i.scdn.co/image/ab67616d00001e02424c1cdcf219c073899f1c52",
      width: null,
    },
  ],
  name: "Crazy cool playlist",
  owner: {
    display_name: "jsulz",
    external_urls: {
      spotify: "https://open.spotify.com/user/jsulz",
    },
    href: "https://api.spotify.com/v1/users/jsulz",
    id: "jsulz",
    type: "user",
    uri: "spotify:user:jsulz",
  },
  primary_color: null,
  public: true,
  snapshot_id: "MSwyMjUyZTY2MTg2ZTg3YzAzODhmNjMyNGNiNzg4YzcxNjlhOWFmODUz",
  tracks: {
    href: "https://api.spotify.com/v1/playlists/2Zi5lAJD9TX0SjNWfIcc6o/tracks?offset=0&limit=100&locale=*",
    items: [
      {
        added_at: "2024-04-14T20:48:32Z",
        added_by: {
          external_urls: {
            spotify: "https://open.spotify.com/user/jsulz",
          },
          href: "https://api.spotify.com/v1/users/jsulz",
          id: "jsulz",
          type: "user",
          uri: "spotify:user:jsulz",
        },
        is_local: false,
        primary_color: null,
        track: {
          preview_url:
            "https://p.scdn.co/mp3-preview/3672e35a35e233509260de4c5e551eb2482e450a?cid=9111aa4b1aa54ce5a8435d0fd12f45c5",
          available_markets: ["US"],
          explicit: false,
          type: "track",
          episode: false,
          track: true,
          album: {
            available_markets: ["US"],
            type: "album",
            album_type: "single",
            href: "https://api.spotify.com/v1/albums/6yvkLNZeQb4HaXM2kZky9y",
            id: "6yvkLNZeQb4HaXM2kZky9y",
            images: [
              {
                url: "https://i.scdn.co/image/ab67616d0000b273424c1cdcf219c073899f1c52",
                width: 640,
                height: 640,
              },
              {
                url: "https://i.scdn.co/image/ab67616d00001e02424c1cdcf219c073899f1c52",
                width: 300,
                height: 300,
              },
              {
                url: "https://i.scdn.co/image/ab67616d00004851424c1cdcf219c073899f1c52",
                width: 64,
                height: 64,
              },
            ],
            name: "A Hot Second With The Velveteins",
            release_date: "2016-05-27",
            release_date_precision: "day",
            uri: "spotify:album:6yvkLNZeQb4HaXM2kZky9y",
            artists: [
              {
                external_urls: {
                  spotify:
                    "https://open.spotify.com/artist/1jUEqf1F3oW4JGoMfYxCvN",
                },
                href: "https://api.spotify.com/v1/artists/1jUEqf1F3oW4JGoMfYxCvN",
                id: "1jUEqf1F3oW4JGoMfYxCvN",
                name: "The Velveteins",
                type: "artist",
                uri: "spotify:artist:1jUEqf1F3oW4JGoMfYxCvN",
              },
            ],
            external_urls: {
              spotify: "https://open.spotify.com/album/6yvkLNZeQb4HaXM2kZky9y",
            },
            total_tracks: 6,
          },
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/1jUEqf1F3oW4JGoMfYxCvN",
              },
              href: "https://api.spotify.com/v1/artists/1jUEqf1F3oW4JGoMfYxCvN",
              id: "1jUEqf1F3oW4JGoMfYxCvN",
              name: "The Velveteins",
              type: "artist",
              uri: "spotify:artist:1jUEqf1F3oW4JGoMfYxCvN",
            },
          ],
          disc_number: 1,
          track_number: 1,
          duration_ms: 163826,
          external_ids: {
            isrc: "CACB11600031",
          },
          external_urls: {
            spotify: "https://open.spotify.com/track/5Cldr1TxGp9gtWqXqrSnnq",
          },
          href: "https://api.spotify.com/v1/tracks/5Cldr1TxGp9gtWqXqrSnnq",
          id: "5Cldr1TxGp9gtWqXqrSnnq",
          name: "Monica Louise",
          popularity: 14,
          uri: "spotify:track:5Cldr1TxGp9gtWqXqrSnnq",
          is_local: false,
        },
        video_thumbnail: {
          url: null,
        },
      },
      {
        added_at: "2024-04-14T20:48:32Z",
        added_by: {
          external_urls: {
            spotify: "https://open.spotify.com/user/jsulz",
          },
          href: "https://api.spotify.com/v1/users/jsulz",
          id: "jsulz",
          type: "user",
          uri: "spotify:user:jsulz",
        },
        is_local: false,
        primary_color: null,
        track: {
          preview_url:
            "https://p.scdn.co/mp3-preview/02d039af00079d7c8a6a8456f0ef55b3741cc69a?cid=9111aa4b1aa54ce5a8435d0fd12f45c5",
          available_markets: ["AR"],
          explicit: false,
          type: "track",
          episode: false,
          track: true,
          album: {
            available_markets: ["AR"],
            type: "album",
            album_type: "album",
            href: "https://api.spotify.com/v1/albums/2UC6E2eFp6ixqvbe4oVjex",
            id: "2UC6E2eFp6ixqvbe4oVjex",
            images: [
              {
                url: "https://i.scdn.co/image/ab67616d0000b273c5132c2f69f041ff769ac493",
                width: 640,
                height: 640,
              },
              {
                url: "https://i.scdn.co/image/ab67616d00001e02c5132c2f69f041ff769ac493",
                width: 300,
                height: 300,
              },
              {
                url: "https://i.scdn.co/image/ab67616d00004851c5132c2f69f041ff769ac493",
                width: 64,
                height: 64,
              },
            ],
            name: "The Ides",
            release_date: "2013-07-09",
            release_date_precision: "day",
            uri: "spotify:album:2UC6E2eFp6ixqvbe4oVjex",
            artists: [
              {
                external_urls: {
                  spotify:
                    "https://open.spotify.com/artist/6b0G9aPXmaLLDWJHhCrv1Q",
                },
                href: "https://api.spotify.com/v1/artists/6b0G9aPXmaLLDWJHhCrv1Q",
                id: "6b0G9aPXmaLLDWJHhCrv1Q",
                name: "Me Like Bees",
                type: "artist",
                uri: "spotify:artist:6b0G9aPXmaLLDWJHhCrv1Q",
              },
            ],
            external_urls: {
              spotify: "https://open.spotify.com/album/2UC6E2eFp6ixqvbe4oVjex",
            },
            total_tracks: 14,
          },
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/6b0G9aPXmaLLDWJHhCrv1Q",
              },
              href: "https://api.spotify.com/v1/artists/6b0G9aPXmaLLDWJHhCrv1Q",
              id: "6b0G9aPXmaLLDWJHhCrv1Q",
              name: "Me Like Bees",
              type: "artist",
              uri: "spotify:artist:6b0G9aPXmaLLDWJHhCrv1Q",
            },
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/6b0G9aPXmaLLDWJHhCrv1Q",
              },
              href: "https://api.spotify.com/v1/artists/6b0G9aPXmaLLDWJHhCrv1Q",
              id: "6b0G9aPXmaLLDWJHhCrv1Q",
              name: "Me Like Bees",
              type: "artist",
              uri: "spotify:artist:6b0G9aPXmaLLDWJHhCrv1Q",
            },
          ],
          disc_number: 1,
          track_number: 4,
          duration_ms: 272319,
          external_ids: {
            isrc: "TCABO1369267",
          },
          external_urls: {
            spotify: "https://open.spotify.com/track/78QcVePceDlBJkuNDSN654",
          },
          href: "https://api.spotify.com/v1/tracks/78QcVePceDlBJkuNDSN654",
          id: "78QcVePceDlBJkuNDSN654",
          name: "Naked Trees",
          popularity: 24,
          uri: "spotify:track:78QcVePceDlBJkuNDSN654",
          is_local: false,
        },
        video_thumbnail: {
          url: null,
        },
      },
    ],
    limit: 100,
    next: null,
    offset: 0,
    previous: null,
    total: 2,
  },
  type: "playlist",
  uri: "spotify:playlist:2Zi5lAJD9TX0SjNWfIcc6o",
};

export default function Tempo(props: TempoProps) {
  const [recommendations, setRecommendations] = useState(null);
  const [topTracks, setTopTracks] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [playlist, setPlaylist] = useState(testPlaylist);
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
            <div className="row row-cols-1 row-cols-md-1 sticky-top">
              <div className="d-none d-md-block col">
                <Heading headingText="Tempo" />
                <p className="fs-7">
                  Make the perfect playlist, tailored to your tastes and mood.
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
                  topArtists={topArtists}
                  topTracks={topTracks}
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
          <div className="col-12 col-md-9 rounded-1">
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
          <Playlist playlist={playlist} />
        </>
      )}
    </main>
  );
}

Tempo.url = import.meta.url;
