import { useState } from "react";
import { TrackObj } from "../../utils/types.ts";
import Heading from "../components/Heading.tsx";
import Tracks from "./Tracks.tsx";
import Artists from "./Artists.tsx";

/**
 * Renders Spotify data from the provided data object prop.
 * Iterates through each top level property in the data object, rendering a heading.
 * For 'tracks', renders each track as a card with image, name, album, artist info.
 * For other properties, renders items in a grid with image and name.
 */
export default function SpotifyData({
  spotifyData,
  currently_playing,
  playTrack,
}: {
  spotifyData: any;
  currently_playing: TrackObj;
  playTrack: (track: TrackObj) => void;
}) {
  const [playing, setPlaying] = useState(false);

  const handleTrackClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    track: TrackObj
  ): void => {
    e.preventDefault();
    if (playing && currently_playing.uri == track.uri) {
      setPlaying(false);
    } else {
      setPlaying(true);
    }
    playTrack(track);
  };

  const html: JSX.Element[] = [];
  if (spotifyData) {
    spotifyData.forEach((spotifyCollection: any) => {
      for (const property in spotifyCollection) {
        const heading = (
          <Heading
            headingText={property.toUpperCase()}
            key={property.toUpperCase()}
          />
        );
        html.push(heading);
        if (property == "tracks") {
          const tracks = (
            <Tracks
              tracks={spotifyCollection[property]}
              playing={playing}
              currentlyPlaying={currently_playing}
              handleTrackPlaying={handleTrackClick}
              key={`${property.toUpperCase()}-items`}
            />
          );
          html.push(tracks);
        } else {
          const artists = (
            <Artists
              artists={spotifyCollection[property]}
              key={`${property.toUpperCase()}-items`}
            />
          );
          html.push(artists);
        }
      }
    });
  }
  return (
    <>
      {spotifyData && (
        <>
          {html.map((item: JSX.Element) => {
            return item;
          })}
        </>
      )}
    </>
  );
}
