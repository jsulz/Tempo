import Counter from "./Counter.tsx";
import island from "ultra/hooks/use-island.js";
import { Tokens } from "../utils/types.ts";
import { getUsersTopArtist } from "../utils/spotifyclient.ts";
const CounterIsland = island(Counter);

export default function App({
  isSignedIn,
  tokens,
}: {
  isSignedIn: boolean;
  tokens: Tokens | null | undefined;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Tempo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <main>
          <p>Provider: Spotify</p>
          <p>Signed in: {String(isSignedIn)}</p>
          <p>
            <a href="/log-in">Sign in</a>
          </p>
          <p>
            <a href="/log-out">Sign out</a>
          </p>
          {isSignedIn && (
            <CounterIsland
              start={10}
              tokens={tokens}
              hydrationStrategy="visible"
            />
          )}
        </main>
      </body>
    </html>
  );
}
