import { useState } from "react";
import {
  RecommendationSettings,
  TrackObj,
  PlaylistSettings,
} from "../../utils/types.ts";
import Heading from "../components/Heading.tsx";
import Tracks from "./Tracks.tsx";
import Artists from "./Artists.tsx";
import TrackRecs from "./TrackRecs.tsx";
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
  recommendationSettings,
  setRecommendationSettings,
  playlistSettings,
  setPlaylistSettings,
}: {
  spotifyData: any;
  currently_playing: TrackObj;
  playTrack: (track: TrackObj) => void;
  recommendationSettings?: RecommendationSettings;
  setRecommendationSettings?: React.Dispatch<
    React.SetStateAction<RecommendationSettings>
  >;
  playlistSettings?: PlaylistSettings;
  setPlaylistSettings?: React.Dispatch<React.SetStateAction<PlaylistSettings>>;
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

  const toCapitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const html: JSX.Element[] = [];
  if (spotifyData) {
    spotifyData.forEach((spotifyCollection: any) => {
      for (const property in spotifyCollection) {
        const heading = (
          <Heading
            headingText={toCapitalize(property)}
            key={property.toUpperCase()}
          />
        );
        html.push(heading);
        if (
          property == "tracks" &&
          recommendationSettings &&
          setRecommendationSettings
        ) {
          const tracks = (
            <Tracks
              tracks={spotifyCollection[property]}
              playing={playing}
              currentlyPlaying={currently_playing}
              handleTrackPlaying={handleTrackClick}
              key={`${property.toUpperCase()}-items`}
              recommendationSettings={recommendationSettings}
              setRecommendationSettings={setRecommendationSettings}
            />
          );
          html.push(tracks);
        } else if (
          property == "artists" &&
          setRecommendationSettings &&
          recommendationSettings
        ) {
          const artists = (
            <Artists
              artists={spotifyCollection[property]}
              key={`${property.toUpperCase()}-items`}
              recommendationSettings={recommendationSettings}
              setRecommendationSettings={setRecommendationSettings}
            />
          );
          html.push(artists);
        } else if (
          property == "trackrecs" &&
          playlistSettings &&
          setPlaylistSettings
        ) {
          const recs = (
            <TrackRecs
              tracks={spotifyCollection[property]}
              playing={playing}
              currentlyPlaying={currently_playing}
              handleTrackPlaying={handleTrackClick}
              key={`${property.toUpperCase()}-items`}
              playlistSettings={playlistSettings}
              setPlaylistSettings={setPlaylistSettings}
            />
          );
          html.push(recs);
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
