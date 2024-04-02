import { useState } from "react";
import { TrackObj } from "../../utils/types.ts";
import Heading from "../components/Heading.tsx";

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

  const handleTrackClick = (e, track) => {
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
    spotifyData.forEach((spotifyCollection) => {
      for (const property in spotifyCollection) {
        const heading = (
          <Heading
            headingText={property.toUpperCase()}
            key={property.toUpperCase()}
          />
        );
        html.push(heading);
        if (property == "tracks") {
          const final = (
            <div
              className="row row-cols-2 row-cols-sm-4 row-cols-lg-5"
              key={`${property.toUpperCase()}-items`}
            >
              {spotifyCollection[property].map((item) => {
                let icon = null;
                const play = <i className="bi bi-play-circle"></i>;
                const pause = <i className="bi bi-pause-circle"></i>;
                if (item.uri == currently_playing.uri) {
                  icon = playing ? pause : play;
                } else {
                  icon = play;
                }

                return (
                  <div className="col" key={item.id}>
                    <img className="img-fluid" src={item.album.images[1].url} />
                    <p>
                      <a href={item.external_urls.spotify}>{item.name}</a> from{" "}
                      <a href={item.album.external_urls.spotify}>
                        {item.album.name}
                      </a>
                    </p>
                    <p>
                      By:{" "}
                      {item.artists.map((artist) => {
                        return (
                          <>
                            <a href={artist.external_urls.spotify}>
                              {artist.name}
                            </a>
                            &nbsp;
                          </>
                        );
                      })}
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={(e) => handleTrackClick(e, item)}
                    >
                      {icon}
                    </button>
                  </div>
                );
              })}
            </div>
          );
          html.push(final);
        } else {
          const column_els = spotifyCollection[property].map((item) => {
            return (
              <div className="col" key={item.id}>
                <img className="img-fluid" src={item.images[1].url} />
                <p>
                  <a href={item.external_urls.spotify}>{item.name}</a>
                </p>
                <p>{item.genres.map((genre) => genre).join(", ")}</p>
              </div>
            );
          });
          const final = (
            <div
              className="row row-cols-2 row-cols-sm-4 row-cols-lg-5"
              key={`${property.toUpperCase()}-items`}
            >
              {column_els.map((item) => item)}
            </div>
          );
          html.push(final);
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
