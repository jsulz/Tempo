export default function Control({
  onChange,
  attribute,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>, attribute: string) => void;
  attribute: string;
}) {
  return (
    <div>
      <label htmlFor={attribute} className="form-label">
        {attribute}
      </label>
      <input
        type="range"
        className="form-range"
        id={attribute}
        onChange={(e) => onChange(e, attribute)}
      />
    </div>
  );
}
