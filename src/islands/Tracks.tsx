import { TrackObj, RecommendationSettings } from "../../utils/types.ts"; // Add import statement for RecommendationSettings type

export default function Tracks({
  tracks,
  playing,
  currentlyPlaying,
  handleTrackPlaying,
  recommendationSettings,
  setRecommendationSettings,
}: {
  tracks: TrackObj[];
  playing: boolean;
  currentlyPlaying: TrackObj; // Fix the type declaration
  handleTrackPlaying: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    track: TrackObj
  ) => void;
  recommendationSettings: RecommendationSettings;
  setRecommendationSettings: React.Dispatch<
    React.SetStateAction<RecommendationSettings>
  >;
}) {
  const handleAddingTrack = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    track: TrackObj
  ): void => {
    e.preventDefault();
    if (recommendationSettings.seed_tracks.includes(track.id!)) {
      const index = recommendationSettings.seed_tracks.indexOf(track.id!);
      recommendationSettings.seed_tracks.splice(index, 1);
      recommendationSettings.seed_count -= 1;
    } else {
      recommendationSettings.seed_tracks.push(track.id!);
      recommendationSettings.seed_count += 1;
    }
    setRecommendationSettings({
      ...recommendationSettings,
      seed_tracks: recommendationSettings.seed_tracks,
      seed_count: recommendationSettings.seed_count,
    });
  };

  const trackCards = tracks.map((track) => {
    let icon = null;
    const play = <i className="bi bi-play-circle"></i>;
    const pause = <i className="bi bi-pause-circle"></i>;
    if (track.uri == currentlyPlaying.uri) {
      icon = playing ? pause : play;
    } else {
      icon = play;
    }

    let recIcon = null;
    const add = <i className="bi bi-plus-circle"></i>;
    const remove = <i className="bi bi-dash-circle"></i>;
    let disabled = false;
    if (recommendationSettings.seed_tracks.includes(track.id!)) {
      recIcon = remove;
    } else {
      recIcon = add;
      if (recommendationSettings.seed_count >= 5) {
        disabled = true;
      }
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
        <button
          className="btn btn-primary"
          onClick={(e) => handleAddingTrack(e, track)}
          disabled={disabled}
        >
          {recIcon}
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
