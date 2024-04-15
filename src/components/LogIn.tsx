import useAsset from "ultra/hooks/use-asset.js";

export default function LogIn() {
  return (
    <main role="main" className="mt-auto">
      <div className="row align-items-center justify-content-center text-center mt-10">
        <div className="col-10 col-md-6 island shadow">
          <p>
            <h2>Welcome to Tempo!</h2>
            <p>
              Tempo is a little application to take control over creating your
              playlists. Like many applications,{" "}
              <a href="https://open.spotify.com/">Spotify</a> exposes more
              granular control over various parts of their services through an
              application programming interface (API).
            </p>{" "}
            <p>
              The APIs for getting recommendations based on a combination of
              artists, tracks, genres, and <code>track attributes</code> (e.g.,{" "}
              <code>accousticness</code> or <code>energy</code>) are
              particularly powerful.
            </p>{" "}
            <p>
              Tempo uses these APIs to help you create playlists so you can
              dance to your own beat.
            </p>
            <div className="row justify-content-center">
              <div className="col-6">
                <a className="btn btn-primary" href="/log-in">
                  <img
                    src={useAsset("/Spotify_Icon_RGB_Green.png")}
                    height="40"
                  />
                  {"  "}
                  Log in through Spotify
                </a>
              </div>
            </div>
          </p>
        </div>
      </div>
    </main>
  );
}
