/* A component that takes in a finished playlist and displays it to the user
The component will also take in a variety of state variables (playlist settings, recommendations, etc.) and will provide the user with an option to reset these settings and restart the process of generating a new playlist. 
If the user chooses to do this, the component will call the appropriate functions to reset the state variables.
          setPlaylistSettings={setPlaylistSettings}
          defaultPlaylistSettings={playlistDefaultSettings}
          playlist={playlist}
          setPlaylist={setPlaylist}
          setRecommendations={setRecommendations}
          defaultRecommendationSettings={defaultSettings} */
import { RecommendationSettings, PlaylistSettings } from "../../utils/types.ts";

export default function Playlist({ playlist }: { playlist: any }) {
  const resetPlaylist = () => {
    window.location.reload();
  };
  const getSmallestImage = (images: any) => {
    return images.reduce((smallest: any, image: any) => {
      if (image.height < smallest.height) return image;
      return smallest;
    });
  };

  // loop over all of the tracks in the playlist
  // add up the duration of each track
  // convert the total duration to hours, minutes, and seconds
  let initialVal = 0;
  const totalDuration = playlist.tracks.items.reduce(
    (acc: number, item: any) => {
      return acc + item.track.duration_ms;
    },
    initialVal
  );
  const hours = Math.floor(totalDuration / 3600000);
  const minutes = Math.floor((totalDuration % 3600000) / 1000 / 60);

  // convert the duration of a track from milliseconds to minute:second format
  const trackDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds}`;
  };

  console.log(playlist);

  return (
    <main role="main" className="h-100">
      <div className="row mt-10 h-100">
        <div className="col">
          <div className="row row-cols-2">
            <div className="col-3">
              <img
                className="img-fluid"
                src={playlist.images[0].url}
                alt={playlist.name}
              />
            </div>
            <div className="col-9">
              <div className="row">
                <div>{playlist.public ? "Private" : "Public"} playlist</div>
              </div>
              <div className="row">
                <h1 className="display-1">
                  <a target="_blank" href={playlist.external_urls.spotify}>
                    {playlist.name}
                  </a>
                </h1>
              </div>
              <p>
                {playlist.owner.display_name} &#8226;{" "}
                {playlist.tracks.items.length} Songs &#8226; {hours} Hours{" "}
                {minutes} Minutes
              </p>
            </div>
          </div>
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Track</th>
                <th>Album</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {playlist.tracks.items.map((item: any) => {
                return (
                  <tr key={item.uri}>
                    <td>
                      <div className="row row-cols-2">
                        <div className="col-12 col-lg-2">
                          <img
                            src={getSmallestImage(item.track.album.images).url}
                          />
                        </div>
                        <div className="col-10">
                          <div className="row">
                            <a
                              className="fw-semibold fs-7"
                              href={item.track.external_urls.spotify}
                            >
                              {item.track.name}
                            </a>
                          </div>
                          <div className="row">
                            <div className="column">
                              {item.track.artists.length > 1 ? (
                                item.track.artists.map(
                                  (artist: any, index: number) => {
                                    return (
                                      <>
                                        {index > 0 && ", "}
                                        <a
                                          key={artist.id}
                                          className="fw-light fs-7"
                                          href={artist.external_urls.spotify}
                                        >
                                          {artist.name}
                                        </a>
                                      </>
                                    );
                                  }
                                )
                              ) : (
                                <a
                                  className="fw-light fs-7"
                                  href={
                                    item.track.artists[0].external_urls.spotify
                                  }
                                >
                                  {item.track.artists[0].name}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a
                        className="fw-light fs-7"
                        href={item.track.album.external_urls.spotify}
                      >
                        {item.track.album.name}
                      </a>
                    </td>
                    <td>
                      <span className="fw-light fs-7">
                        {trackDuration(item.track.duration_ms)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button className="btn btn-primary" onClick={resetPlaylist}>
            Create another awesome playlist
          </button>
        </div>
      </div>
    </main>
  );
}
