import useAsset from "ultra/hooks/use-asset.js";
export default function Footer() {
  return (
    <footer className="container-fluid footer mt-auto d-flex flex-wrap justify-content-between align-items-center py-3 p-2 flex-column">
      <div className="container">
        <div className="row">
          <div className="col-4 d-flex align-items-center">
            <span className="mb-3 mb-md-0 text-body-primary">
              <a className="navbar-brand" href="https://www.jsulz.com">
                Tempo by jsulz, for Spotify
              </a>
            </span>
          </div>

          <ul className="nav col-8 justify-content-end list-unstyled d-flex">
            <li className="ms-3">
              <a
                className="text-body-primary"
                href="https://www.linkedin.com/in/jaredsulzdorf"
              >
                <i className="bi-linkedin"></i>
              </a>
            </li>
            <li className="ms-3">
              <a className="text-body-primary" href="https://github.com/jsulz">
                <i className="bi-github"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <script src={useAsset("/bootstrap.bundle.min.js")} />
    </footer>
  );
}
