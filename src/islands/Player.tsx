// Initial scaffolding from https://github.com/spotify/spotify-web-playback-sdk-example/blob/main/src/WebPlayback.jsx

import React, { useState, useEffect } from "react";
import { Tokens, TrackObj } from "../../utils/types.ts";
import { load } from "https://deno.land/std@0.222.1/dotenv/mod.ts";
import useEnv from "ultra/hooks/use-env.js";

// Add types for Spotify SDK to the window object
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: any;
    Spotify: any;
  }
}

/**
 * Props for the Player component
 */
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
 * - player: The Spotify Player SDK instance
 * - setPlayer: Callback to update the Spotify Player SDK instance
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

  const inactive_state = (
    <div className="row pt-2">
      <div className="main-wrapper">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    </div>
  );

  if (!is_active) {
    return inactive_state;
  } else {
    return (
      <>
        <div className="row player player rounded-2 pt-2 mb-2">
          <div className="row">
            <div className="col-3">
              <img src={track_image[0].url} alt="" />
            </div>
            <div className="col-8">
              <div className="fw-semibold fs-7">{current_track.name}</div>
              <div className="fw-light fs-7">
                {current_track.artists[0].name}
              </div>
            </div>
          </div>
          <div className="row mb-2 align-items-center">
            <div className="col-3">
              <button
                className="btn-primary btn btn-lg"
                onClick={() => {
                  player.togglePlay();
                }}
              >
                {is_paused ? play : pause}
              </button>
            </div>{" "}
            <div className="col-9">
              <img
                src="../../public/spotify-icons-logos/spotify-icons-logos/icons/01_RGB/Spotify_Icon_RGB_Green.png"
                height="38"
              ></img>{" "}
              <a href={`https://open.spotify.com/track/${current_track.id}`}>
                Play on Spotify
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }
}
