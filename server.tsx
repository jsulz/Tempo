/// <reference lib="deno.unstable" />

import { serve } from "https://deno.land/std@0.176.0/http/server.ts";
import { createServer } from "ultra/server.ts";
import { load } from "std/dotenv/mod.ts";
import {
  createSpotifyOAuthConfig,
  getSessionId,
  handleCallback,
  signIn,
  signOut,
} from "https://deno.land/x/deno_kv_oauth/mod.ts";
import { getSpotifyUser, getUsersTopArtist } from "./utils/spotifyclient.ts";
import { User, Tokens } from "./utils/types.ts";
import { setUser, getUserBySession } from "./utils/db.ts";
import App from "./src/app.tsx";
import { getTokensByUser } from "./utils/db.ts";
import { TokenResponseError } from "https://deno.land/x/oauth2_client@v1.0.2/mod.ts";

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
  /**
   * Render the request
   */

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
  return await signOut(context.req.raw);
});

server.get("/api/artists", async (context) => {
  const sessionId = await getSessionId(context.req.raw);
  const isSignedIn = sessionId != null;

  const user = isSignedIn ? await getUserBySession(sessionId) : undefined;
  const tokens =
    isSignedIn && user ? await getTokensByUser(user.id) : undefined;

  const artists =
    isSignedIn && tokens
      ? await getUsersTopArtist(tokens.access_token)
      : undefined;
  console.log(artists);
});

Deno.serve(server.fetch);
