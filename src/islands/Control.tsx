import { useState } from "react";

export default function Control({
  onChange,
  attribute,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>, attribute: string) => void;
  attribute: string;
}) {
  const toCapitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const [val, setVal] = useState<number | null>(null);

  const updateVal = (
    e: React.ChangeEvent<HTMLInputElement>,
    attribute: string
  ) => {
    setVal(parseInt(e.target.value) / 100);
    onChange(e, attribute);
  };
  return (
    <div>
      <div className="row row-cols-2">
        <div className="col-5">
          <label htmlFor={attribute} className="fs-7 fw-bold form-label">
            {toCapitalize(attribute)}
          </label>
          {val !== null && (
            <code className="d-inline d-md-none fs-7">: {val}</code>
          )}
        </div>
        <div className="col-7">
          <input
            type="range"
            className="form-range"
            id={attribute}
            onChange={(e) => updateVal(e, attribute)}
          />
        </div>
      </div>
    </div>
  );
}
