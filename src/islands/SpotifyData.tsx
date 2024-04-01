import { TrackObj } from "../../utils/types.ts";

/**
 * Renders Spotify data from the provided data object prop.
 * Iterates through each top level property in the data object, rendering a heading.
 * For 'tracks', renders each track as a card with image, name, album, artist info.
 * For other properties, renders items in a grid with image and name.
 */
export default function SpotifyData({
  data,
  currently_playing,
}: {
  data: any;
  currently_playing: TrackObj;
}) {
  const html: JSX.Element[] = [];
  if (data) {
    console.log(data);
    data.forEach((element) => {
      for (const property in element) {
        const heading = (
          <div className="row" key={property.toUpperCase()}>
            <h2>{property.toUpperCase()}</h2>
          </div>
        );
        html.push(heading);
        if (property == "tracks") {
          const final = (
            <div
              className="row row-cols-2 row-cols-sm-4 row-cols-lg-5"
              key={`${property.toUpperCase()}-items`}
            >
              {element[property].map((item) => {
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
                  </div>
                );
              })}
            </div>
          );
          html.push(final);
        } else {
          const column_els = element[property].map((item) => {
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
      {data && (
        <>
          {html.map((item: JSX.Element) => {
            return item;
          })}
        </>
      )}
    </>
  );
}
