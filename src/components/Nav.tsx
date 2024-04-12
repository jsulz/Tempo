export default function Nav() {
  return (
    <header>
      <nav className="navbar navbar-expand-md fixed-top">
        <div className="container">
          <img
            src="public/spotify-icons-logos/spotify-icons-logos/logos/01_RGB/Spotify_Logo_RGB_Green.png"
            height="70"
          />
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="https://www.jsulz.com/contact">
                  Contact <i className="bi bi-box-arrow-up-right"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
