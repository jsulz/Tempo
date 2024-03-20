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
          const final = (
            <div
              className="row row-cols-1 row-cols-sm-3"
              key={`${property.toUpperCase()}-items`}
            >
              {element[property].map((item) => {
                return (
                  <div className="col" key={item.id}>
                    <img className="img-fluid" src={item.album.images[1].url} />
                    <p>
                      {item.name} from {item.album.name}
                    </p>
                    <p>By: {item.artists.map((artist) => artist).join(", ")}</p>
                    <p>{item.album.name}</p>
                  </div>
                );
              })}
            </div>
          );
          html.push(final);
        } else {
          const column_els = element[property].map((item) => {
            return (
              <div className="col" key={item.id}>
                <img className="img-fluid" src={item.images[1].url} />
                <p>{item.name}</p>
                <p>{item.genres.map((genre) => genre).join(", ")}</p>
              </div>
            );
          });
          const final = (
            <div
              className="row row-cols-1 row-cols-sm-3"
              key={`${property.toUpperCase()}-items`}
            >
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
