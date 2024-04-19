import { ArtistObj, TrackObj } from "../../utils/types.ts";
import { RecommendationSettings } from "../../utils/types.ts";
export default function RecommendationSettingsView({
  recommendationSettings,
  setRecommendations,
  topArtists,
  topTracks,
}: {
  recommendationSettings: RecommendationSettings;
  setRecommendations: React.Dispatch<
    React.SetStateAction<RecommendationSettings>
  >;
  topArtists: any;
  topTracks: any;
}) {
  const getRecommendations = async () => {
    const paramSettings: any = {};
    for (const setting in recommendationSettings) {
      if (
        recommendationSettings[setting] !== null &&
        setting !== "seed_count"
      ) {
        paramSettings[setting] = recommendationSettings[setting];
      }
    }
    const params = new URLSearchParams(paramSettings);
    const getRecommendations = await (
      await fetch(`api/recommendations?${params}`)
    ).json();
    setRecommendations(getRecommendations);
  };

  const toCapitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getObj = (id: string, arr: Array<ArtistObj | TrackObj>) => {
    return arr.find((obj) => obj.id === id);
  };

  interface Seeds {
    [key: string]: JSX.Element[];
    seed_tracks: JSX.Element[];
    seed_artists: JSX.Element[];
  }

  const settings: {
    [key: string]: Array<JSX.Element> | Seeds;
    atts: Array<JSX.Element>;
    seeds: Seeds;
  } = {
    atts: [],
    seeds: {
      seed_tracks: [],
      seed_artists: [],
    },
  };
  for (const setting in recommendationSettings) {
    if (
      recommendationSettings[setting] !== null &&
      setting !== "seed_count" &&
      setting !== "limit"
    ) {
      if (typeof recommendationSettings[setting] == "number") {
        settings.atts.push(
          <tr key={setting}>
            <td>{toCapitalize(setting)}</td>
            <td>{recommendationSettings[setting]}</td>
          </tr>
        );
      } else {
        settings.seeds[setting].push(
          <div key={setting}>
            <strong>{toCapitalize(setting.slice(5))}</strong>
            {Array.isArray(recommendationSettings[setting]) && (
              <ul>
                {recommendationSettings[setting]!.map((ids: any) => {
                  const obj = getObj(
                    ids,
                    setting === "seed_artists"
                      ? topArtists.artists
                      : topTracks.tracks
                  );
                  return (
                    <li key={ids}>
                      {
                        <a target="_blank" href={obj?.external_urls?.spotify}>
                          {obj.name}
                        </a>
                      }
                    </li>
                  );
                })}
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
    <div className="row mb-3">
      <h4>Recommendation Settings</h4>
      {recommendationSettings.seed_artists.length +
        recommendationSettings.seed_tracks.length ===
      0 ? (
        <div>
          <p className="fs-7">
            Select at least one song or artist (but no more than 5) to get
            recommendations for a playlist.
          </p>
          <p className="fs-7">
            You can also track attributes (below tracks/artists). Read more
            about those at{" "}
            <a
              target="_blank"
              href="https://developer.spotify.com/documentation/web-api/reference/get-audio-features"
            >
              Spotify's documentation.
            </a>
          </p>
        </div>
      ) : (
        <>
          {recommendationSettings.seed_artists.length > 0 &&
            settings.seeds.seed_artists.map((setting) => setting)}

          {recommendationSettings.seed_tracks.length > 0 &&
            settings.seeds.seed_tracks.map((setting) => setting)}
        </>
      )}
      {settings.atts.length > 0 && (
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Setting</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {settings.atts.map((setting) => setting)}
          </tbody>
        </table>
      )}
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
