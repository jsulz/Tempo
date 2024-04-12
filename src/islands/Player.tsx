// Initial scaffolding from https://github.com/spotify/spotify-web-playback-sdk-example/blob/main/src/WebPlayback.jsx

import React, { useState, useEffect } from "react";
import { Tokens, TrackObj } from "../../utils/types.ts";
import { load } from "https://deno.land/std@0.222.1/dotenv/mod.ts";
import useEnv from "ultra/hooks/use-env.js";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: any;
    Spotify: any;
  }
}

let SPSDK = window.onSpotifyWebPlaybackSDKReady;
let SP = window.Spotify;

interface PlayerProps {
  tokens: Tokens;
  current_track: TrackObj;
  setTrack: React.Dispatch<React.SetStateAction<TrackObj>>;
  player: any;
  setPlayer: React.Dispatch<React.SetStateAction<any>>;
}

/**
 * Renders the Spotify player UI and handles playback state.
 * Uses the Spotify Player SDK to initialize and control playback.
 *
 * Props:
 * - tokens: OAuth tokens for authorizing with Spotify
 * - current_track: The currently playing track object
 * - setTrack: Callback to update the currently playing track
 */
export default function Player({
  tokens,
  current_track,
  setTrack,
  player,
  setPlayer,
}: PlayerProps) {
  // State to track playback and player
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);

  // Icons for play and pause buttons
  const play = <i className="bi bi-play-circle"></i>;
  const pause = <i className="bi bi-pause-circle"></i>;

  // Get the track image from the current track object
  const track_image = current_track.album.images.filter(
    (image) => image.height === 64
  );

  // Player name
  const playerName = "Tempo";

  // Get the environment variable to see if we want the player to load
  const environment: string | undefined = useEnv("ULTRA_PUBLIC_ENVIRONMENT");

  // On page load, create a new spotify player instance
  // connect it and set up event listeners
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window!.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: playerName,
        getOAuthToken: (cb: any) => {
          cb(tokens.access_token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Ready with Device ID", device_id);
        // If in developmeent environment, then don't execute this block, otherwise go ahead
        if (environment !== "production") {
          const options = {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ device_ids: [device_id] }),
          };
          fetch("https://api.spotify.com/v1/me/player", options)
            .then((response) => response.text())
            .then((data) => {
              console.log(`Playing on device ${device_id}`);
            });
        }
      });

      player.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID has gone offline", device_id);
        }
      );

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }
        setTrack(state.track_window.current_track);
        setPaused(state.paused);

        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });
      });

      player.connect();
    };
  }, []);

  if (!is_active) {
    return (
      <>
        <div className="row">
          <div className="main-wrapper">
            <div className="spinner-border text-success" role="status"></div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="row player">
          <div className="row mb-2">
            <div className="col-3">
              <img
                src={track_image[0].url}
                className="now-playing__cover"
                alt=""
              />
            </div>
            <div className="col-8">
              <div className="now-playing__name fw-semibold fs-7">
                {current_track.name}
              </div>
              <div className="now-playing__artist fw-light fs-7">
                {current_track.artists[0].name}
              </div>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-2">
              <button
                className="btn-primary btn"
                onClick={() => {
                  player.togglePlay();
                }}
              >
                {is_paused ? play : pause}
              </button>
            </div>{" "}
            <div className="col-10">
              <img
                src="../../public/spotify-icons-logos/spotify-icons-logos/icons/01_RGB/Spotify_Icon_RGB_Green.png"
                height="38"
              ></img>{" "}
              Play on Spotify
            </div>
          </div>
        </div>
      </>
    );
  }
}
