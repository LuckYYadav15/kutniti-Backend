const db = require("../models");

// create main Model
const CountryCount = db.countries;
const Article = db.articles;
const RSSLink = db.rssLinks;
const addCountry = async (req, res) => {
  try {
    const { country, type, flagLogo, Articles } = req.body;

    // Create a CountryCount record
    const countryCount = await CountryCount.create({
      country: country,
      type: type,
      flagLogo: flagLogo,
      Articles: Articles,
    });

    res.status(201).json(countryCount);
  } catch (error) {
    console.error("Error creating CountryCount:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const countryArticles = async (req, res) => {
  try {
    const { country, type } = req.body;

    // Find the country_id for the given country and type
    const rssLink = await RSSLink.findOne({
      where: {
        country: country,
        type: type,
      },
    });

    if (!rssLink) {
      return res
        .status(404)
        .json({ error: "RSSLink not found for the provided country and type" });
    }

    const country_id = rssLink.country_id;

    // Fetch the total number of articles for the given country
    const totalArticles = await Article.count({
      where: {
        country_id: country_id,
      },
    });

    // Update or create a CountryCount record for the given country and type
    const [countryCount, created] = await CountryCount.findOrCreate({
      where: {
        countryName: country,
        type: type,
      },
      defaults: {
        Articles: totalArticles,
      },
    });

    // If the record was not created, update the Articles count
    if (!created) {
      await countryCount.update({
        Articles: totalArticles,
      });
    }

    console.log("CountryCount updated successfully");
    res.status(200).json({ message: "CountryCount updated successfully" });
  } catch (error) {
    console.error("Error updating CountryCount:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { countryArticles, addCountry };
