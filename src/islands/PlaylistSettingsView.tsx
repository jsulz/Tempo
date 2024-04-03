import { PlaylistSettings } from "../../utils/types.ts";

export default function PlaylistSettingsView({
  playlistSettings,
  setPlaylistSettings,
}: {
  playlistSettings: PlaylistSettings;
  setPlaylistSettings: React.Dispatch<React.SetStateAction<PlaylistSettings>>;
}) {
  const updatePlaylistName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaylistSettings({
      ...playlistSettings,
      name: e.target.value,
    });
  };
  const updatePlaylistPrivacy = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaylistSettings({
      ...playlistSettings,
      public: !playlistSettings.public,
    });
  };
  const createPlaylist = async () => {};
  let submittable = false;
  if (playlistSettings.name.length > 0 && playlistSettings.tracks.length > 0) {
    submittable = true;
  }

  console.log(playlistSettings);
  return (
    <div>
      <h3>Playlist Settings</h3>
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Playlist Name
        </label>
        <input
          type="text"
          className="form-control"
          id="playlist-name"
          placeholder="Playlist Name"
          onChange={updatePlaylistName}
        />
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          id="private-playlist"
          onChange={updatePlaylistPrivacy}
        />
        <label className="form-check-label" htmlFor="private-playlist">
          Private Playlist
        </label>
      </div>
      {playlistSettings.tracks.length > 0 && (
        <ul>
          {playlistSettings.tracks.map((track) => {
            return <li key={track.id}>{track.name}</li>;
          })}
        </ul>
      )}
      <button
        className="btn btn-primary"
        disabled={!submittable}
        onClick={createPlaylist}
      >
        GCreate Playlist
      </button>
    </div>
  );
}
