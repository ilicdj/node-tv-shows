const { isUtf8 } = require("buffer");
const fs = require("fs");
const { createServer } = require("http");
const https = require("https");
const url = require("url");

const data = fs.readFileSync("./dev-data/data.json", "utf-8");
const movie_data = JSON.parse(data);

// Reading Template HTML files

const tempOverview = fs.readFileSync(
  "./templates/template-overview.html",
  "utf-8"
);
const tempCard = fs.readFileSync("./templates/template-card.html", "utf-8");
const tempProduct = fs.readFileSync(
  "./templates/template-read-more.html",
  "utf-8"
);

// Replace Template Function
const replaceTemplate = function (temp, tvshow) {
  let output = temp.replace(/{%TV_SHOW_NAME%}/g, tvshow.showName);
  output = output.replace(/{%AUTHORS%}/g, tvshow.authors);
  output = output.replace(/{%SEASONS%}/g, tvshow.seasons);
  output = output.replace(/{%MAIN_CHARACTERS%}/g, tvshow.mainCharacters);
  output = output.replace(/{%GENRE%}/g, tvshow.genre);
  output = output.replace(/{%IMAGE%}/g, tvshow.image);
  output = output.replace(/{%DESCRIPTION%}/g, tvshow.description);
  output = output.replace(/{%LOCATION%}/g, tvshow.location);
  output = output.replace(/{%ID%}/g, tvshow.id);

  if (!tvshow.adult) output = output.replace(/{%NOT_ADULT%}/g, "not-adult");
  return output;
};

const server = createServer((req, res) => {
  // const pathName = req.url;
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = movie_data
      .map((show) => replaceTemplate(tempCard, show))
      .join("");
    const output = tempOverview.replace("{%TV_SHOW_CARDS%}", cardsHtml);
    res.end(output);
  } else if (pathname === "/tvshow") {
    res.writeHead(200, { "Content-type": "text/html" });
    const show = movie_data[query.id];
    const output = replaceTemplate(tempProduct, show);
    res.end(output);
  } else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("<h1>Error 404. Page not found.</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening on requests on 8000");
});
