import { ArtistObj, RecommendationSettings } from "../../utils/types.ts";

export default function Artists({
  artists,
  recommendationSettings,
  setRecommendationSettings,
}: {
  artists: ArtistObj[];
  recommendationSettings: RecommendationSettings;
  setRecommendationSettings: React.Dispatch<
    React.SetStateAction<RecommendationSettings>
  >;
}) {
  const handleAddingArtist = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    artist: ArtistObj
  ): void => {
    e.preventDefault();
    if (recommendationSettings.seed_artists.includes(artist.id!)) {
      const index = recommendationSettings.seed_tracks.indexOf(artist.id!);
      recommendationSettings.seed_artists.splice(index, 1);
      recommendationSettings.seed_count -= 1;
    } else {
      recommendationSettings.seed_artists.push(artist.id!);
      recommendationSettings.seed_count += 1;
    }
    setRecommendationSettings({
      ...recommendationSettings,
      seed_artists: recommendationSettings.seed_artists,
      seed_count: recommendationSettings.seed_count,
    });
  };

  const artistCards = artists.map((artist) => {
    let recIcon = null;
    const add = <i className="bi bi-plus-circle"></i>;
    const remove = <i className="bi bi-dash-circle"></i>;
    let selected = "";
    let disabled = false;
    if (recommendationSettings.seed_artists.includes(artist.id!)) {
      recIcon = remove;
      selected = "btn-selected";
    } else {
      recIcon = add;
      if (recommendationSettings.seed_count >= 5) {
        disabled = true;
      }
    }
    return (
      <div className="col tile rounded-2 p-2" key={artist.id}>
        <div className="row">
          <a href={artist.external_urls!.spotify}>
            <img className="img-fluid" src={artist.images[1].url} />
          </a>
        </div>
        <div className="row mb-2">
          <a className="fw-light fs-7" href={artist.external_urls!.spotify}>
            {artist.name}
          </a>
        </div>
        <div className="row">
          <div
            className="btn-group"
            role="group"
            aria-label="Track button group"
          >
            <button
              className={`btn btn-primary ${selected}`}
              onClick={(e) => handleAddingArtist(e, artist)}
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
      {artistCards.map((card) => card)}
    </div>
  );
}
