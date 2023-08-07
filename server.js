const express = require("express");
const cors = require("cors");

const app = express();

// middleware

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// routers
const rssLinkrouter = require("./routes/rssLinkRouter.js");
const articlerouter = require("./routes/articleRouter.js");
const countryrouter = require("./routes/countryRouter.js");

app.use("/api", rssLinkrouter);
app.use("/api/article", articlerouter);
app.use("/api/country", countryrouter);

//port

const PORT = process.env.PORT || 8000;

//server

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

app.get("/", (req, res) =>
  res.json(`Kutniti backend is running on port ${PORT}`)
);
