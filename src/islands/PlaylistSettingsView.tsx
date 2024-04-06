import { PlaylistSettings } from "../../utils/types.ts";

export default function PlaylistSettingsView({
  playlistSettings,
  setPlaylistSettings,
  setPlaylist,
}: {
  playlistSettings: PlaylistSettings;
  setPlaylistSettings: React.Dispatch<React.SetStateAction<PlaylistSettings>>;
  setPlaylist: React.Dispatch<any>;
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
  const createPlaylist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const trackIds = playlistSettings.tracks.map((track) => track.uri);
    const body = {
      name: playlistSettings.name,
      public: playlistSettings.public,
      tracks: trackIds,
    };
    const createPlaylist = await (
      await fetch("/api/playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
    ).json();
    setPlaylist(createPlaylist);
  };

  let submittable = false;
  if (playlistSettings.name.length > 0 && playlistSettings.tracks.length > 0) {
    submittable = true;
  }

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
        onClick={(e) => createPlaylist(e)}
      >
        GCreate Playlist
      </button>
    </div>
  );
}
