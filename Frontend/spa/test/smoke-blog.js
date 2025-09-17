const http = require("http");

const host = process.env.API_HOST || "http://localhost:5000";
const url = `${host}/api/BlogPosts`;

console.log("GET", url);

http
  .get(url, (res) => {
    console.log("status", res.statusCode);
    let raw = "";
    res.on("data", (c) => (raw += c));
    res.on("end", () => {
      try {
        const json = JSON.parse(raw);
        console.log("ok, got JSON, keys:", Object.keys(json));
      } catch (e) {
        console.log("response:", raw.slice(0, 200));
      }
    });
  })
  .on("error", (e) => {
    console.error("request failed", e.message);
    process.exit(2);
  });
