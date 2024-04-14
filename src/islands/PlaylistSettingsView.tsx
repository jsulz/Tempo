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

  // lock icon JSX
  const lock = <i className="bi bi-lock-fill"></i>;
  const unlock = <i className="bi bi-unlock-fill"></i>;
  let icon = null;
  if (playlistSettings.public) {
    icon = unlock;
  } else {
    icon = lock;
  }

  return (
    <div className="mb-3">
      <h3>Playlist Settings</h3>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          id="playlist-name"
          placeholder="Name"
          onChange={updatePlaylistName}
        />
      </div>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          id="private-playlist"
          onChange={updatePlaylistPrivacy}
        />
        <label className="form-check-label" htmlFor="private-playlist">
          Privacy
        </label>{" "}
        (Currently: {icon})
      </div>
      {playlistSettings.tracks.length > 0 && (
        <>
          <strong>Tracks</strong>
          <ul>
            {playlistSettings.tracks.map((track) => {
              return (
                <li key={track.id}>
                  <a target="_blank" href={track.external_urls?.spotify}>
                    {track.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </>
      )}
      <button
        className="btn btn-primary"
        disabled={!submittable}
        onClick={(e) => createPlaylist(e)}
      >
        Create Playlist
      </button>
    </div>
  );
}
