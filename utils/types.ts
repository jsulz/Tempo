export interface ImageObject {
  url: string;
  height: number;
  width: number;
  size?: string;
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<ImageObject>;
}

export interface User {
  id: string;
  display_name: string;
  email: string;
  images?: Array<ImageObject>;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
  expiration: number | undefined;
}

export interface ExternalURLs {
  spotify: string;
}

export interface ArtistObj {
  id: string;
  genres: Array<string>;
  name: string;
  images: Array<ImageObject>;
  popularity: number;
  external_urls?: ExternalURLs;
  uri?: string;
}

export interface TopArtists {
  artists: Array<ArtistObj>;
}

export interface AlbumObj {
  name: string;
  images: Array<ImageObject>;
  release_date: string;
  artists: Array<ArtistObj>;
  external_urls?: ExternalURLs;
}

export interface TrackObj {
  album: AlbumObj;
  artists: Array<ArtistObj>;
  duration: number;
  popularity: number;
  id: string;
  name: string;
  external_urls?: ExternalURLs;
  uri?: string;
}

export interface TopTracks {
  tracks: Array<TrackObj>;
}

export interface Recommendations {
  trackrecs: Array<TrackObj>;
}

export interface Seeds {
  [key: string]: number | string | null | undefined;
  limit?: number;
  seed_artists?: string;
  seed_genres?: string;
  seed_tracks?: string;
  acousticness?: number | null;
  danceability?: number | null;
  energy?: number | null;
  instrumentalness?: number | null;
  liveness?: number | null;
  loudness?: number | null;
  popularity?: number | null;
  speechiness?: number | null;
  tempo?: number | null;
  valence?: number | null;
}

export interface RecommendationSettings {
  [key: string]: number | null | Array<string>;
  limit: number;
  seed_count: number;
  seed_artists: Array<string>;
  seed_genres: Array<string>;
  seed_tracks: Array<string>;
  acousticness: number | null;
  danceability: number | null;
  energy: number | null;
  instrumentalness: number | null;
  liveness: number | null;
  loudness: number | null;
  popularity: number | null;
  speechiness: number | null;
  tempo: number | null;
  valence: number | null;
}

export interface PlaylistSettings {
  name: string;
  public: boolean;
  tracks: Array<TrackObj>;
}

export interface SpotifySeeds {
  uri: string;
  name: string;
}

export interface Playlist {
  id: string;
  name: string;
  public: string;
}
