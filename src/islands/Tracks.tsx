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
    let selected = "";
    let disabled = false;
    if (recommendationSettings.seed_tracks.includes(track.id!)) {
      recIcon = remove;
      selected = "btn-selected";
    } else {
      recIcon = add;
      if (recommendationSettings.seed_count >= 5) {
        disabled = true;
      }
    }
    return (
      <div className="col tile rounded-2 p-2" key={track.id}>
        <div className="row">
          <a href={track.album.external_urls!.spotify}>
            <img className="img-fluid" src={track.album.images[1].url} />
          </a>
        </div>
        <div className="row mb-2">
          <a href={track.external_urls!.spotify} className="fw-semibold fs-7">
            {track.name}
          </a>
          <br />
          {track.artists.map((artist) => {
            return (
              <a
                href={artist.external_urls!.spotify}
                key={`${artist.name}-artist`}
                className="fw-light fs-7"
              >
                {artist.name}
              </a>
            );
          })}
        </div>
        <div className="row">
          <div
            className="btn-group"
            role="group"
            aria-label="Track button group"
          >
            <button
              className="btn btn-primary"
              onClick={(e) => handleTrackPlaying(e, track)}
            >
              {icon}
            </button>
            <button
              className={`btn btn-primary ${selected}`}
              onClick={(e) => handleAddingTrack(e, track)}
              disabled={disabled}
            >
              {recIcon}
            </button>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="row row-cols-2 row-cols-sm-4 row-cols-lg-5 mb-5">
      {trackCards.map((card) => card)}
    </div>
  );
}
