export default function Controls() {
  return (
    <>
      <div className="col mb-3">
        <a
          className="btn btn-primary"
          data-bs-toggle="collapse"
          href="#multiCollapseExample1"
          role="button"
          aria-expanded="false"
          aria-controls="multiCollapseExample1"
        >
          Toggle first element
        </a>
        <div className="collapse multi-collapse" id="multiCollapseExample1">
          <div>
            <label htmlFor="customRange1" className="form-label">
              Example range
            </label>
            <input type="range" className="form-range" id="customRange1" />
          </div>
          <div>
            <label htmlFor="customRange1" className="form-label">
              Example range
            </label>
            <input type="range" className="form-range" id="customRange1" />
          </div>
          <div>
            <label htmlFor="customRange1" className="form-label">
              Example range
            </label>
            <input type="range" className="form-range" id="customRange1" />
          </div>
          <div>
            <label htmlFor="customRange1" className="form-label">
              Example range
            </label>
            <input type="range" className="form-range" id="customRange1" />
          </div>
          <div>
            <label htmlFor="customRange1" className="form-label">
              Example range
            </label>
            <input type="range" className="form-range" id="customRange1" />
          </div>
        </div>
      </div>
      <div className="col mb-3">
        <button
          className="btn btn-primary"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#multiCollapseExample2"
          aria-expanded="false"
          aria-controls="multiCollapseExample2"
        >
          Toggle second element
        </button>
        <div className="collapse multi-collapse" id="multiCollapseExample2">
          <div>
            <label htmlFor="customRange1" className="form-label">
              Example range
            </label>
            <input type="range" className="form-range" id="customRange1" />
          </div>
          <div>
            <label htmlFor="customRange1" className="form-label">
              Example range
            </label>
            <input type="range" className="form-range" id="customRange1" />
          </div>
          <div>
            <label htmlFor="customRange1" className="form-label">
              Example range
            </label>
            <input type="range" className="form-range" id="customRange1" />
          </div>
          <div>
            <label htmlFor="customRange1" className="form-label">
              Example range
            </label>
            <input type="range" className="form-range" id="customRange1" />
          </div>
          <div>
            <label htmlFor="customRange1" className="form-label">
              Example range
            </label>
            <input type="range" className="form-range" id="customRange1" />
          </div>
        </div>
      </div>
    </>
  );
}
