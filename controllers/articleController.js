const db = require("../models");

// create main Model
const Article = db.articles;
const RSSLink = db.rssLinks;
const Parser = require("rss-parser");

// main work

// 1. create link
const addArticle = async (req, res) => {
  // console.log("add article Link");

  try {
    // Extract data from the request body
    const {
      title,
      link,
      pubDate,
      author,
      content,
      contentSnippet,
      summary,
      isoDate,
      country_id,
    } = req.body;

    // Create a new record using the model's create method
    const newArticle = await Article.create({
      title,
      link,
      pubDate,
      author,
      content,
      contentSnippet,
      summary,
      isoDate,
      country_id,
    });

    // console.log("New article record created:", newArticle.get());

    res.status(201).send(newArticle);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getAllArticles = async (req, res) => {
  try {
    // console.log("All articles from database");

    const articles = await Article.findAll({});
    res.status(200).send(articles);
  } catch (err) {
    console.error("Error retrieving links:", err);
    res.status(500).send("Internal Server Error");
  }
};

const fetchDataAndStoreInArticle = async (req, res) => {
  try {
    // console.log("Fetching articles from RSS links");

    // Fetch links from RSSLink with the specified country and type
    const rssLinks = await RSSLink.findAll({
      where: {
        country: req.body.country,
        type: req.body.type,
      },
      attributes: ["link"],
    });

    const links = rssLinks.map((rssLink) => rssLink.link);
    // console.log(links);

    // Create an instance of the RSS Parser
    const parser = new Parser();

    // Array to store the parsed articles
    let articles = [];

    // Parse each RSS link and collect the articles
    await Promise.all(
      links.map(async (link) => {
        try {
          const feed = await parser.parseURL(link);
          const newArticles = feed.items.map((item) => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            author: item.author,
            content: item.content,
            contentSnippet: item.contentSnippet,
            summary: item.summary,
            isoDate: item.isoDate,
            country_id: req.body.country_id, // Add the correct country_id based on your use case
          }));
          articles = [...articles, ...newArticles];
        } catch (error) {
          console.error(`Error parsing RSS link ${link}:`, error);
        }
      })
    );

    // Store the data in the Article model using the bulkCreate method
    const createdArticles = await Article.bulkCreate(articles);

    // console.log(
    //   "Articles created:",
    //   createdArticles.map((article) => article.get())
    // );

    res.status(200).send(createdArticles);
  } catch (error) {
    console.error("Error fetching and storing data:", error);
    res.status(500).send("Internal Server Error");
  }
};


module.exports = {
  addArticle,
  fetchDataAndStoreInArticle,
  getAllArticles,
};
