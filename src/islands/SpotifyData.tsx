export default function SpotifyData({ data }) {
  const html = [];
  if (data) {
    console.log(data);
    data.forEach((element) => {
      for (const property in element) {
        const heading = (
          <div className="row" key={property.toUpperCase()}>
            <h2>{property.toUpperCase()}</h2>
          </div>
        );
        html.push(heading);
        if (property == "tracks") {
          const column_els = element[property].map((item) => {
            return (
              <div className="col" key={item.id}>
                <p>{item.id}</p>
              </div>
            );
          });
          const final = (
            <div className="row row-cols-1 row-cols-sm-3">
              {column_els.map((item) => item)}
            </div>
          );
          html.push(final);
        } else {
          const column_els = element[property].map((item) => {
            return (
              <div className="col" key={item.id}>
                <p>{item.id}</p>
              </div>
            );
          });
          const final = (
            <div className="row row-cols-1 row-cols-sm-3">
              {column_els.map((item) => item)}
            </div>
          );
          html.push(final);
        }
      }
    });
  }
  return (
    <>
      {data && (
        <>
          {html.map((item) => {
            return item;
          })}
        </>
      )}
    </>
  );
}
