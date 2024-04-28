import { parseModule } from "https://deno.land/x/deno_graph@0.41.0/mod.ts";
import {
  ArtistObj,
  TrackObj,
  RecommendationSettings,
  PlaylistSettings,
} from "../../utils/types.ts";
export default function RecommendationSettingsView({
  recommendationSettings,
  setRecommendations,
  topArtists,
  topTracks,
  playlistSettings,
  setPlaylistSettings,
}: {
  recommendationSettings: RecommendationSettings;
  setRecommendations: React.Dispatch<
    React.SetStateAction<RecommendationSettings>
  >;
  topArtists: any;
  topTracks: any;
  playlistSettings: PlaylistSettings;
  setPlaylistSettings: React.Dispatch<React.SetStateAction<PlaylistSettings>>;
}) {
  const getRecommendations = async () => {
    const paramSettings: any = {};
    let description = "";
    for (const setting in recommendationSettings) {
      if (
        recommendationSettings[setting] !== null &&
        setting !== "seed_count"
      ) {
        paramSettings[setting] = recommendationSettings[setting];
        // if the setting is seed_artists or seed_tracks, we need to get the names of the artists/tracks
        // use the id to get the object name from topArtists or topTracks
        if (setting === "seed_artists" || setting === "seed_tracks") {
          if (recommendationSettings[setting].length > 0) {
            description += `${setting.slice(5)}: `;
            const names = [];
            for (const id of recommendationSettings[setting]) {
              const obj = getObj(
                id,
                setting === "seed_artists"
                  ? topArtists.artists
                  : topTracks.tracks
              );
              names.push(obj!.name);
            }
            description += `${names.join(", ")} -- `;
          }
        } else if (setting !== "limit") {
          description += `${setting}: ${recommendationSettings[setting]} -- `;
        }
      }
    }
    // If the decription is longer than 300 characters, truncate it with an elipis
    if (description.length > 300) {
      description = description.slice(0, 297) + "...";
    }
    // set the description
    setPlaylistSettings({
      ...playlistSettings,
      description,
    });
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
                          {obj!.name}
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
