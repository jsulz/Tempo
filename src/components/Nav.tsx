import useAsset from "ultra/hooks/use-asset.js";

export default function Nav() {
  return (
    <header>
      <nav className="navbar navbar-expand-md fixed-top">
        <div className="container">
          <a href="https://open.spotify.com/">
            <img src={useAsset("/Spotify_Logo_RGB_Green.png")} height="70" />
          </a>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="https://www.jsulz.com/contact">
                Contact Tempo <i className="bi bi-box-arrow-up-right"></i>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
