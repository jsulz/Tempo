import { RecommendationSettings } from "../../utils/types.ts";
import Control from "./Control.tsx";

export default function Controls({
  recommendationSettings,
  setRecommendationSettings,
}: {
  recommendationSettings: RecommendationSettings;
  setRecommendationSettings: React.Dispatch<
    React.SetStateAction<RecommendationSettings>
  >;
}) {
  const attributes = [
    "acousticness",
    "danceability",
    "energy",
    "instrumentalness",
    "liveness",
    "loudness",
    "popularity",
    "speechiness",
    "tempo",
    "valence",
  ];

  const updateAttribute = (
    e: React.ChangeEvent<HTMLInputElement>,
    attribute: string
  ) => {
    const value = parseInt(e.target.value) / 100;
    setRecommendationSettings({
      ...recommendationSettings,
      [attribute]: value,
    });
  };

  return (
    <div className="row row-cols-1 row-cols-md-2">
      <div className="col mb-3 p-0 pe-md-4">
        {attributes.slice(0, 5).map((attribute) => (
          <Control
            key={attribute}
            attribute={attribute}
            onChange={updateAttribute}
          />
        ))}
      </div>
      <div className="col mb-3 p-0">
        {attributes.slice(5, 10).map((attribute) => (
          <Control
            key={attribute}
            attribute={attribute}
            onChange={updateAttribute}
          />
        ))}
      </div>
    </div>
  );
}
