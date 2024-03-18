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
  genres: Array<string>;
  name: string;
  popularity: number;
}

export interface TopArtists {
  total: number;
  artists: Array<ArtistObj>;
}
