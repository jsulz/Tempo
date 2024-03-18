import { TopArtists, SpotifyUser, Tokens } from "./types.ts";
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
  const resp = await fetch(`${spotifySchema}/me/top/artists`, { headers });
  return resp.json();
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
