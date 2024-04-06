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

export default function Playlist({
  setPlaylistSettings,
  defaultPlaylistSettings,
  playlist,
  setPlaylist,
  setRecommendationSettings,
  defaultRecommendationSettings,
  setCurrentTrack,
  curentTrack,
}: {
  setPlaylistSettings: React.Dispatch<React.SetStateAction<PlaylistSettings>>;
  defaultPlaylistSettings: PlaylistSettings;
  playlist: any;
  setPlaylist: React.Dispatch<any>;
  setRecommendationSettings: React.Dispatch<RecommendationSettings>;
  defaultRecommendationSettings: RecommendationSettings;
  setCurrentTrack: React.Dispatch<any>;
  curentTrack: any;
}) {
  const resetPlaylist = () => {
    window.location.reload();
  };
  return (
    <main role="main" className="h-100">
      <div className="row mt-5 h-100 align-items-center text-center">
        <div className="col">
          <p>
            <a href={playlist.external_urls.spotify}>{playlist.name}</a>
          </p>
          <button className="btn btn-primary" onClick={resetPlaylist}>
            Reset
          </button>
        </div>
      </div>
    </main>
  );
}
