import {
  TopArtists,
  SpotifyUser,
  Tokens,
  TopTracks,
  ArtistObj,
  TrackObj,
  AlbumObj,
  Recommendations,
  Seeds,
} from "./types.ts";
const spotifySchema = "https://api.spotify.com/v1";
const refreshSchema = "https://accounts.spotify.com/api/token";
import { load } from "std/dotenv/mod.ts";

await load({ export: true });

/**
 * Retrieves the Spotify user information using the provided access token.
 * @param token - The access token for authenticating the request.
 * @returns A promise that resolves to the SpotifyUser object containing the user information.
 */
export async function getSpotifyUser(token: string): Promise<SpotifyUser> {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const resp = await fetch(`${spotifySchema}/me`, { headers });
  return resp.json();
}

/**
 * Retrieves the user's top artists from Spotify API.
 * @param token - The access token for authentication.
 * @returns A promise that resolves to an object containing the user's top artists.
 */
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
      id: artist.id,
      name: artist.name,
      images: artist.images,
      genres: artist.genres,
      popularity: artist.popularity,
      external_urls: artist.external_urls,
      uri: artist.uri,
    });
  });
  console.log(data.items[0]);
  return resp;
}

/**
 * Retrieves the user's top tracks from Spotify API.
 * @param token - The access token for authentication.
 * @returns A promise that resolves to an object containing the user's top tracks.
 */
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
      artists: track.album.artists,
      external_urls: track.album.external_urls,
    };
    resp.tracks.push({
      id: track.id,
      name: track.name,
      album: album,
      artists: track.artists,
      duration: track.duration,
      popularity: track.popularity,
      external_urls: track.external_urls,
      uri: track.uri,
    });
  });
  console.log(data.items[data.items.length - 1]);
  return resp;
}

/**
 * Retrieves recommendations from Spotify based on the provided seeds.
 * @param token - The access token for authenticating the request.
 * @param seeds - The seeds used to generate the recommendations.
 * @returns A Promise that resolves to an object containing the recommended tracks.
 */
export async function getRecommendations(
  token: string,
  seeds: Seeds
): Promise<Recommendations> {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const params = new URLSearchParams(seeds);
  const data = await (
    await fetch(`${spotifySchema}/recommendations?${params}`, { headers })
  ).json();

  const resp: Recommendations = { tracks: [] };
  data.tracks.forEach((recommendation: TrackObj) => {
    const album: AlbumObj = {
      name: recommendation.album.name,
      images: recommendation.album.images,
      release_date: recommendation.album.release_date,
      artists: recommendation.album.artists,
      external_urls: recommendation.album.external_urls,
    };
    resp.tracks.push({
      id: recommendation.id,
      name: recommendation.name,
      album: album,
      artists: recommendation.artists,
      duration: recommendation.duration,
      popularity: recommendation.popularity,
      external_urls: recommendation.external_urls,
      uri: recommendation.uri,
    });
  });

  return resp;
}

/**
 * Plays a track on Spotify.
 * @param token - The access token for authentication.
 * @param track_uri - The URI of the track to be played.
 * @returns A promise that resolves to a string representing the response from the Spotify API.
 */
export async function playTrack(
  token: string,
  track_uri: string
): Promise<string> {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const options = {
    method: "PUT",
    headers: headers,
    body: JSON.stringify({ uris: [track_uri], position_ms: 0 }),
  };
  const response = await fetch(`${spotifySchema}/me/player/play`, options);
  console.log(response);
  return response.text();
}

/**
 * Refreshes the access tokens for Spotify API.
 * @param tokens - The current access tokens.
 * @returns A promise that resolves to the updated access tokens.
 */
export async function refreshAccessTokens(tokens: Tokens): Promise<Tokens> {
  const url = refreshSchema;

  console.log(tokens.refresh_token);

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: tokens.refresh_token,
      client_id: Deno.env.get("SPOTIFY_CLIENT_ID")!,
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
