const http = require('http');
const fs = require("fs");
const path = require("path");

const fetch = global.fetch || require('node-fetch');

const portNumber = 8080;

const applicationId = process.env.APPLICATION_ID;
const applicationSecret = process.env.APPLICATION_SECRET;
const authString = Buffer.from(applicationId + ":" + applicationSecret).toString("base64");

const url = require("url");
const httpServer = http.createServer(async (req, res) => {
    if (req.url.startsWith("/moon")) {
    try {
      // parse query params
      const query = url.parse(req.url, true).query;
      const lat = parseFloat(query.lat) || 40.7128;
      const lon = parseFloat(query.lon) || -73.9352;

      // today’s date in YYYY-MM-DD
      const today = new Date().toISOString().split("T")[0];

      const response = await fetch("https://api.astronomyapi.com/api/v2/studio/moon-phase", {
        method: "POST",
        headers: {
          "Authorization": "Basic " + authString,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          format: "png",
          style: {
            moonStyle: "sketch",
            backgroundStyle: "stars",
            backgroundColor: "red",
            headingColor: "white",
            textColor: "white"
          },
          observer: {
            latitude: lat,
            longitude: lon,
            date: today
          },
          view: { type: "portrait-simple" }
        })
      });

      const data = await response.json();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
      return;

    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error fetching AstronomyAPI data");
      return;
    }
  }

  // Serve static files from public/
  let filePath = path.join(__dirname, "public", req.url === "/" ? "index.html" : req.url);
  let ext = path.extname(filePath).toLowerCase();
  let contentType = "text/html";

  switch (ext) {
    case ".js":
      contentType = "application/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
    case ".jpeg":
      contentType = "image/jpeg";
      break;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
    } 
    else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

    httpServer.listen(portNumber, () => {
    console.log(`Server running at http://localhost:${portNumber}`);
    });


