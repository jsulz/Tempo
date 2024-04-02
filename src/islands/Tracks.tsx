import { TrackObj } from "../../utils/types.ts"; // Add import statement for TrackObj type

export default function Tracks({
  tracks,
  playing,
  currentlyPlaying,
  handleTrackPlaying,
}: {
  tracks: TrackObj[];
  playing: boolean;
  currentlyPlaying: TrackObj; // Fix the type declaration
  handleTrackPlaying: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    track: TrackObj
  ) => void;
}) {
  const trackCards = tracks.map((track) => {
    let icon = null;
    const play = <i className="bi bi-play-circle"></i>;
    const pause = <i className="bi bi-pause-circle"></i>;
    if (track.uri == currentlyPlaying.uri) {
      icon = playing ? pause : play;
    } else {
      icon = play;
    }
    return (
      <div className="col" key={track.id}>
        <img className="img-fluid" src={track.album.images[1].url} />
        <p>
          <a href={track.external_urls!.spotify}>{track.name}</a> from{" "}
          <a href={track.album.external_urls!.spotify}>{track.album.name}</a>
        </p>
        <p>
          By:{" "}
          {track.artists.map((artist) => {
            return (
              <a
                href={artist.external_urls!.spotify}
                key={`${artist.name}-artist`}
              >
                {artist.name}
              </a>
            );
          })}
        </p>
        <button
          className="btn btn-primary"
          onClick={(e) => handleTrackPlaying(e, track)}
        >
          {icon}
        </button>
      </div>
    );
  });

  return (
    <div className="row row-cols-2 row-cols-sm-4 row-cols-lg-5">
      {trackCards.map((card) => card)}
    </div>
  );
}
