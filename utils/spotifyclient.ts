import {
  TopArtists,
  SpotifyUser,
  Tokens,
  TopTracks,
  ArtistObj,
  TrackObj,
  AlbumObj,
} from "./types.ts";
const spotifySchema = "https://api.spotify.com/v1";
const refreshSchema = "https://accounts.spotify.com/api/token";
import { load } from "std/dotenv/mod.ts";

const env = await load();
// get new access token
export async function getSpotifyUser(token: string): Promise<SpotifyUser> {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const resp = await fetch(`${spotifySchema}/me`, { headers });
  return resp.json();
}

// Get users top artists
export async function getUsersTopArtist(token: string): Promise<TopArtists> {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const data = await (
    await fetch(`${spotifySchema}/me/top/artists`, { headers })
  ).json();
  const resp: TopArtists = { artists: [] };
  data.items.forEach((artist: ArtistObj) => {
    resp.artists.push({
      name: artist.name,
      images: artist.images,
      genres: artist.genres,
      popularity: artist.popularity,
    });
  });
  return resp;
}

// Get users top tracks
export async function getUsersTopTracks(token: string): Promise<TopTracks> {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const data = await (
    await fetch(`${spotifySchema}/me/top/tracks`, { headers })
  ).json();
  const resp: TopTracks = { tracks: [] };
  data.items.forEach((track: TrackObj) => {
    const album: AlbumObj = {
      name: track.album.name,
      images: track.album.images,
      release_date: track.album.release_date,
    };
    resp.tracks.push({
      album: album,
      artists: track.artists,
      duration: track.duration,
      popularity: track.popularity,
    });
  });

  return resp;
}

export async function refreshAccessTokens(tokens: Tokens): Promise<Tokens> {
  const url = refreshSchema;

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: tokens.refresh_token,
      client_id: env["SPOTIFY_CLIENT_ID"],
    }),
  };
  const body = await fetch(url, payload);
  const response = await body.json();

  // Set up the tokens that we will store for future API calls
  const currentTime = new Date().getTime() / 1000;
  const expiration = response.expires_in
    ? currentTime + response.expires_in
    : undefined;

  const user_tokens: Tokens = {
    access_token: response.access_token,
    refresh_token: response.refresh_token,
    expiration: expiration,
  };

  console.log("New access tokens: ");
  console.log(user_tokens);

  return user_tokens;
}
