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
    if (recommendationSettings.seed_artists.includes(artist.uri!)) {
      const index = recommendationSettings.seed_tracks.indexOf(artist.uri!);
      recommendationSettings.seed_artists.splice(index, 1);
    } else {
      recommendationSettings.seed_artists.push(artist.uri!);
    }
    setRecommendationSettings({
      ...recommendationSettings,
      seed_artists: recommendationSettings.seed_artists,
    });
  };

  const artistCards = artists.map((artist) => {
    let recIcon = null;
    const add = <i className="bi bi-plus-circle"></i>;
    const remove = <i className="bi bi-dash-circle"></i>;
    if (recommendationSettings.seed_artists.includes(artist.uri!)) {
      recIcon = remove;
    } else {
      recIcon = add;
    }
    return (
      <div className="col" key={artist.id}>
        <img className="img-fluid" src={artist.images[1].url} />
        <p>
          <a href={artist.external_urls!.spotify}>{artist.name}</a>
        </p>
        <p>{artist.genres.map((genre) => genre).join(", ")}</p>
        <button
          className="btn btn-primary"
          onClick={(e) => handleAddingArtist(e, artist)}
        >
          {recIcon}
        </button>
      </div>
    );
  });
  return (
    <div className="row row-cols-2 row-cols-sm-4 row-cols-lg-5">
      {artistCards.map((card) => card)}
    </div>
  );
}
