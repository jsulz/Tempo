import { ArtistObj } from "../../utils/types.ts";

export default function Artists({ artists }: { artists: ArtistObj[] }) {
  const artistCards = artists.map((artist) => {
    return (
      <div className="col" key={artist.id}>
        <img className="img-fluid" src={artist.images[1].url} />
        <p>
          <a href={artist.external_urls!.spotify}>{artist.name}</a>
        </p>
        <p>{artist.genres.map((genre) => genre).join(", ")}</p>
      </div>
    );
  });
  return (
    <div className="row row-cols-2 row-cols-sm-4 row-cols-lg-5">
      {artistCards.map((card) => card)}
    </div>
  );
}
