const db = require("../models");

// create main Model
const Article = db.articles;
const RSSLink = db.rssLinks;
const Parser = require("rss-parser");

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
    const rssLink = await RSSLink.findOne({
      where: {
        country: req.body.country,
        type: req.body.type,
      },
      attributes: ["country_id"],
    });

    if (!rssLink) {
      return res
        .status(404)
        .json({ error: "No RSSLink found with the given country and type" });
    }

    const country_id = rssLink.country_id;
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
            country_id: country_id, // Add the correct country_id based on your use case
          }));
          await Promise.all(
            newArticles.map(async (newArticle) => {
              const [article, created] = await Article.findOrCreate({
                where: { title: newArticle.title, link: newArticle.link },
                defaults: newArticle,
              });

              if (!created) {
                console.log(`Article already exists.`);
              }
            })
          );
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

const getAllCountryData = async (req, res) => {
  try {
    const rssLinks = await RSSLink.findAll({
      attributes: ["country", "type", "link", "country_id"],
    });

    const countryLinkData = rssLinks.map((rssLink) => ({
      country: rssLink.country,
      link: rssLink.link,
      country_id: rssLink.country_id,
      type: rssLink.type,
    }));
    console.log("countryLinkData.country");
    return countryLinkData;
  } catch (error) {
    console.error("Error fetching countries and links:", error);
    throw error;
  }
};

const fetchDataDailyArticle = async (req, res) => {
  try {
    // Fetch countries, links, and country_ids from RSSLink table
    const countryLinkData = await getAllCountryData();

    // Create an instance of the RSS Parser
    const parser = new Parser();

    // Array to store the parsed articles
    let articles = [];

    // Fetch and store articles for each country and link
    await Promise.all(
      countryLinkData.map(async ({ link, country_id }) => {
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
            country_id: country_id,
          }));

          await Promise.all(
            newArticles.map(async (newArticle) => {
              const existingArticle = await Article.findOne({
                where: { link: newArticle.link },
              });

              if (!existingArticle) {
                const [article, created] = await Article.findOrCreate({
                  where: { link: newArticle.link },
                  defaults: newArticle,
                });

                if (!created) {
                  console.log(`Article already exists.`);
                }
              }
            })
          );

          articles = [...articles, ...newArticles];
          res.status(200).send(createdArticles);
        } catch (error) {
          console.error(`Error parsing RSS link ${link}:`, error);
        }
      })
    );

    // Store the data in the Article model using the bulkCreate method
    // const createdArticles = await Article.bulkCreate(articles);
    console.log("All articles created and stored");
    res.status(200).send(createdArticles);
  } catch (error) {
    console.error("Error fetching and storing data:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getCountryId = async (req, res) => {
  const { country, type } = req.body;

  try {
    // Fetch the RSSLink record with the specified country and type
    const rssLink = await RSSLink.findOne({
      where: {
        country: country,
        type: type,
      },
      attributes: ["country_id"],
    });

    if (!rssLink) {
      return res
        .status(404)
        .json({ error: "No RSSLink found with the given country and type" });
    }

    const country_id = rssLink.country_id;
    console.log(country_id);
    return res.status(200).json({ country_id });
  } catch (error) {
    console.error("Error while fetching country_id:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteAllarticles = async (req, res) => {
  try {
    await RSSLink.destroy({
      where: {}, // Empty object means no specific conditions, so it will delete all entries
    });

    res.status(200).send("All links are deleted !");
  } catch (error) {
    console.error("Error deleting links:", error);
    res.status(500).send("An error occurred while deleting links.");
  }
};

module.exports = {
  addArticle,
  fetchDataAndStoreInArticle,
  getAllArticles,
  getCountryId,
  fetchDataDailyArticle,
  deleteAllarticles,
};
