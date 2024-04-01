// Initial scaffolding from https://github.com/spotify/spotify-web-playback-sdk-example/blob/main/src/WebPlayback.jsx

import React, { useState, useEffect } from "react";
import { Tokens, TrackObj } from "../../utils/types.ts";

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
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);

  console.log(current_track);
  const track_image = current_track.album.images.filter(
    (image) => image.height === 64
  );
  const playerName = "Tempo";
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: playerName,
        getOAuthToken: (cb) => {
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
            console.log(data);
            console.log(`Playing on device ${device_id}`);
          });
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

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
            <b>
              {" "}
              Instance not active. Transfer your playback using your Spotify app{" "}
            </b>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="row">
          <div className="main-wrapper">
            <img
              src={track_image[0].url}
              className="now-playing__cover"
              alt=""
            />

            <div className="now-playing__side">
              <div className="now-playing__name">{current_track.name}</div>
              <div className="now-playing__artist">
                {current_track.artists[0].name}
              </div>
              <button
                className="btn-spotify"
                onClick={() => {
                  player.togglePlay();
                }}
              >
                {is_paused ? "PLAY" : "PAUSE"}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}
