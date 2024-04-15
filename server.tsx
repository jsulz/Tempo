/// <reference lib="deno.unstable" />

import { createServer, createRouter, Context } from "ultra/server.ts";
import { load } from "std/dotenv/mod.ts";
import {
  createSpotifyOAuthConfig,
  getSessionId,
  handleCallback,
  signIn,
  signOut,
} from "https://deno.land/x/deno_kv_oauth/mod.ts";
import {
  getSpotifyUser,
  getUsersTopArtist,
  getUsersTopTracks,
  getRecommendations,
  playTrack,
} from "./utils/spotifyclient.ts";
import { User, Tokens, Seeds } from "./utils/types.ts";
import { setUser, getUserBySession, deleteSession } from "./utils/db.ts";
import App from "./src/app.tsx";
import { getTokensByUser } from "./utils/db.ts";
import { createPlaylist } from "./utils/spotifyclient.ts";
import { addTracksToPlaylist } from "./utils/spotifyclient.ts";
import { getPlaylist } from "./utils/spotifyclient.ts";

// Oauth setup
await load({ export: true });
const spotifyOauthClient = createSpotifyOAuthConfig({
  redirectUri: Deno.env.get("SPOTIFY_CALLBACK"),
  scope: [
    "user-top-read",
    "user-read-private",
    "user-read-email",
    "user-read-recently-played",
    "streaming",
    "user-modify-playback-state",
    "playlist-modify-public",
    "playlist-modify-private",
  ],
});

const server = await createServer({
  importMapPath: import.meta.resolve("./importMap.json"),
});

function ServerApp({
  isSignedIn,
  tokens,
}: {
  isSignedIn: boolean;
  tokens: Tokens | null | undefined;
}) {
  return <App {...{ isSignedIn, tokens }} />;
}

server.get("/", async (context) => {
  const sessionId = await getSessionId(context.req.raw);
  const isSignedIn = sessionId != null;

  const user = isSignedIn ? await getUserBySession(sessionId) : undefined;
  const tokens =
    isSignedIn && user ? await getTokensByUser(user.id) : undefined;

  const result = await server.render(<ServerApp {...{ isSignedIn, tokens }} />);

  return context.body(result, 200, {
    "content-type": "text/html; charset=utf-8",
  });
});

server.get("/log-in", async (context) => {
  return await signIn(context.req.raw, spotifyOauthClient);
});

server.get("/callback", async (context) => {
  const { response, tokens, sessionId } = await handleCallback(
    context.req.raw,
    spotifyOauthClient
  );
  // Get spotify user information and map it to the application user
  const spotifyUser = await getSpotifyUser(tokens.accessToken);
  const user: User = {
    id: spotifyUser.id,
    display_name: spotifyUser.display_name,
    email: spotifyUser.email,
    images: spotifyUser.images,
  };

  // Set up the tokens that we will store for future API calls
  const currentTime = new Date().getTime() / 1000;
  const expiration = tokens.expiresIn
    ? currentTime + tokens.expiresIn
    : undefined;

  // Figure out how to squelch this better
  if (!tokens.refreshToken) {
    tokens.refreshToken = "124";
    console.error("error in refresh token");
  }

  const user_tokens: Tokens = {
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    expiration: expiration,
  };
  // Set the information in the Deno KV
  await setUser(user, sessionId, user_tokens);

  return response;
});

server.get("/log-out", async (context) => {
  const sessionId = await getSessionId(context.req.raw);
  await deleteSession(sessionId);
  return await signOut(context.req.raw);
});

/* API routes */

const api = createRouter();

api.get("/artists", async (context) => {
  const tokens = await tokenHelper(context);
  const access_token = tokens ? tokens.access_token : undefined;

  if (!access_token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const artists = access_token
    ? await getUsersTopArtist(access_token)
    : undefined;
  return context.json(artists);
});

api.get("/tracks", async (context) => {
  const tokens = await tokenHelper(context);
  const access_token = tokens ? tokens.access_token : undefined;

  if (!access_token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const tracks = access_token
    ? await getUsersTopTracks(access_token)
    : undefined;
  return context.json(tracks);
});

api.get("/recommendations", async (context) => {
  const tokens = await tokenHelper(context);
  const access_token = tokens ? tokens.access_token : undefined;

  if (!access_token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const seedQuery = context.req.query();
  const seeds: Seeds = {};
  for (const key in seedQuery) {
    seeds[key] = seedQuery[key];
  }

  const recommendations = access_token
    ? await getRecommendations(access_token, seeds)
    : undefined;
  return context.json(recommendations);
});

api.get("/play", async (context) => {
  const tokens = await tokenHelper(context);
  const access_token = tokens ? tokens.access_token : undefined;

  if (!access_token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { track_uri } = context.req.query();

  const status = access_token
    ? await playTrack(access_token, track_uri)
    : undefined;

  return context.json(status);
});

api.post("/playlist", async (context) => {
  const tokens = await tokenHelper(context);
  const access_token = tokens ? tokens.access_token : undefined;
  const sessionId = await getSessionId(context.req.raw);
  const user = sessionId ? await getUserBySession(sessionId) : undefined;

  if (!access_token) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await context.req.json();
  // create a playlist
  const playlist = await createPlaylist(
    access_token,
    body.name,
    body.public,
    user.id
  );
  // add tracks to playlist through spotifyclient
  const tracks = await addTracksToPlaylist(
    access_token,
    playlist.id,
    body.tracks
  );
  // Get the final playlist from Spotify
  const finalPlaylist = await getPlaylist(access_token, playlist.id);
  return context.json(finalPlaylist);
});

server.route("/api", api);

const tokenHelper = async (context: Context) => {
  const sessionId = await getSessionId(context.req.raw);
  const isSignedIn = sessionId != null;

  const user = isSignedIn ? await getUserBySession(sessionId) : undefined;
  const tokens =
    isSignedIn && user ? await getTokensByUser(user.id) : undefined;

  return tokens;
};

Deno.serve(server.fetch);
