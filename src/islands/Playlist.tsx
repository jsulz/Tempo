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
  return (
    <main role="main" className="h-100">
      <div className="row mt-5 h-100 align-items-center text-center">
        <div className="col">
          <img src={playlist.images[0].url} alt={playlist.name} />
          <h1>
            <a target="_blank" href={playlist.external_urls.spotify}>
              {playlist.name}
            </a>
          </h1>
          <p>From {playlist.owner.display_name}</p>
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Track</th>
                <th>Album</th>
                <th>Duration</th>
              </tr>
              <tbody>
                {playlist.tracks.items.map((item: any) => {
                  return (
                    <tr key={item.uri}>
                      <td>
                        <img
                          src={getSmallestImage(item.track.album.images).url}
                        />
                        <a href={item.track.external_urls.spotify}>
                          {item.track.name}
                        </a>
                        {item.track.artists.length > 1 ? (
                          item.track.artists.map((artist: any) => {
                            return (
                              <a href={artist.external_urls.spotify}>
                                {artist.name}
                              </a>
                            );
                          })
                        ) : (
                          <a href={item.track.artists[0].external_urls.spotify}>
                            {item.track.artists[0].name}
                          </a>
                        )}
                      </td>
                      <td>
                        <a href={item.track.album.external_urls.spotify}>
                          {item.track.album.name}
                        </a>
                      </td>
                      <td></td>
                    </tr>
                  );
                })}
              </tbody>
            </thead>
          </table>
          <button className="btn btn-primary" onClick={resetPlaylist}>
            Create another awesome playlist
          </button>
        </div>
      </div>
    </main>
  );
}
