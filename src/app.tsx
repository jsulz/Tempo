import useAsset from "ultra/hooks/use-asset.js";
import Nav from "./components/Nav.tsx";
import Footer from "./components/Footer.tsx";
import { Tokens } from "../utils/types.ts";

import island from "ultra/hooks/use-island.js";
import Tempo from "./islands/Tempo.tsx";

import LogIn from "./components/LogIn.tsx";

const TempoIsland = island(Tempo);

export default function App({
  isSignedIn,
  tokens,
}: {
  isSignedIn: boolean;
  tokens: Tokens | null | undefined;
}) {
  return (
    <html className="h-100" lang="en" itemType="http://schema.org/WebPage">
      <head>
        <meta charSet="utf-8" />
        <title>Tempo</title>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, shrink-to-fit=no"
        />
        <meta
          name="description"
          content="Getting the tempo of your Spotify playlists right."
        />
        <meta name="author" content="Jared Sulzdorf" />
        <meta property="og:title" content="Tempo" />
        <meta
          property="og:description"
          content="Getting the tempo of your Spotify playlists right."
        />
        <meta property="og:url" content="https://tempo.jsulz.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Tempo" />
        <link href={useAsset("/favicon.ico")} rel="icon" type="image/x-icon" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preload" as="style" href={useAsset("/bootstrap.min.css")} />
        <link rel="stylesheet" href={useAsset("/bootstrap.min.css")} />
        <link rel="preload" as="style" href={useAsset("/style.css")} />
        <link rel="stylesheet" href={useAsset("/style.css")} />
      </head>
      <body>
        <div className="container d-flex h-100 flex-column">
          <Nav />
          {isSignedIn ? <TempoIsland tokens={tokens} /> : <LogIn />}
          <Footer />
        </div>
      </body>
    </html>
  );
}
