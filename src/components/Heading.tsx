export default function Heading({ headingText }: { headingText: string }) {
  return (
    <div className="row">
      <h2>{headingText}</h2>
    </div>
  );
}
