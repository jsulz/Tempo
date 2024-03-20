export interface ImageObject {
  url: string;
  height: number;
  width: number;
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

export interface ArtistObj {
  id: string;
  genres: Array<string>;
  name: string;
  images: Array<ImageObject>;
  popularity: number;
}

export interface TopArtists {
  artists: Array<ArtistObj>;
}

export interface AlbumObj {
  name: string;
  images: Array<ImageObject>;
  release_date: string;
}

export interface TrackObj {
  album: AlbumObj;
  artists: Array<string>;
  duration: number;
  popularity: number;
  id: string;
  name: string;
}

export interface TopTracks {
  tracks: Array<TrackObj>;
}

export interface Recommendations {
  tracks: Array<TrackObj>;
}

export interface Seeds {
  seed_songs: string;
  seed_artists: string;
}
