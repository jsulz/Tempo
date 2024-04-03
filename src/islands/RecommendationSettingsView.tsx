import { getRecommendations } from "../../utils/spotifyclient.ts";
import { RecommendationSettings } from "../../utils/types.ts";
export default function RecommendationSettingsView({
  recommendationSettings,
  setRecommendations,
}: {
  recommendationSettings: RecommendationSettings;
  setRecommendations: React.Dispatch<
    React.SetStateAction<RecommendationSettings>
  >;
}) {
  const getRecommendations = async () => {
    const paramSettings = {};
    for (const setting in recommendationSettings) {
      if (
        recommendationSettings[setting] !== null &&
        setting !== "seed_count"
      ) {
        paramSettings[setting] = recommendationSettings[setting];
      }
    }
    const params = new URLSearchParams(paramSettings);
    console.log(params);
    const getRecommendations = await (
      await fetch(`api/recommendations?${params}`)
    ).json();
    setRecommendations(getRecommendations);
  };

  const settings = [];
  for (const setting in recommendationSettings) {
    if (recommendationSettings[setting] !== null) {
      if (typeof recommendationSettings[setting] == "number") {
        settings.push(
          <div>
            <strong>{setting}</strong>
            <p>{recommendationSettings[setting]}</p>
          </div>
        );
      } else {
        settings.push(
          <div>
            <strong>{setting}</strong>
            {Array.isArray(recommendationSettings[setting]) && (
              <ul>
                {recommendationSettings[setting]!.map((item) => (
                  <li>{item}</li>
                ))}
              </ul>
            )}
          </div>
        );
      }
    }
  }
  let submittable = false;
  if (recommendationSettings.seed_count > 0) {
    submittable = true;
  }
  return (
    <div>
      <h2>Recommendation Settings</h2>
      {settings.map((setting) => setting)}
      <button
        className="btn btn-primary"
        disabled={!submittable}
        onClick={getRecommendations}
      >
        Get Recommendations
      </button>
    </div>
  );
}
