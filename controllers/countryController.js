const AWS = require("aws-sdk");
const db = require("../models");

// create main Model
const CountryCount = db.countries;
const Article = db.articles;
const RSSLink = db.rssLinks;

const s3 = new AWS.S3();

const addCountry = async (req, res) => {
  try {
    const { countryName, type, flagLogo, Articles } = req.body;

    // Create a CountryCount record
    const countryCount = await CountryCount.create({
      countryName: countryName,
      type: type,
      flagLogo: flagLogo,
      Articles: Articles,
    });
    console.log(countryCount.countryName);
    console.log(typeof countryCount.countryName);
    res.status(201).json(countryCount);
  } catch (error) {
    console.error("Error creating CountryCount:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllCountryData = async (req, res) => {
  try {
    const rssLinks = await RSSLink.findAll({
      attributes: ["country", "type", "country_id"],
    });

    const countryLinkData = rssLinks.map((rssLink) => ({
      country: rssLink.country,
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

const storeAllCountryArticles = async (req, res) => {
  try {
    // Fetch the total number of articles for the given country
    const countryLinkData = await getAllCountryData();

    // Loop through each country data and update/create CountryCount records
    for (const countryData of countryLinkData) {
      const { country, type } = countryData;
      console.log(country);

      // Fetch the total number of articles for the current country
      const totalArticles = await Article.count({
        where: {
          country_id: countryData.country_id,
        },
      });

      console.log(`Total articles for ${country}: ${totalArticles}`);

      // Find a CountryCount record for the current country and type
      const existingCountryCount = await CountryCount.findOne({
        where: {
          countryName: country,
          type: type,
        },
      });

      if (existingCountryCount) {
        // Update the existing CountryCount record
        await existingCountryCount.update({
          Articles: totalArticles,
        });

        console.log(`CountryCount updated for ${country}`);
      } else {
        // Create a new CountryCount record if it doesn't exist
        await CountryCount.create({
          countryName: country,
          type: type,
          Articles: totalArticles,
        });

        console.log(`CountryCount created for ${country}`);
      }
    }

    res.status(200).json({ message: "CountryCounts updated successfully" });
  } catch (error) {
    console.error("Error updating CountryCount:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get number of articles for a country
const getaCountryArticle = async (req, res) => {
  try {
    const { countryName } = req.body;

    // Fetch the flagLogo, Articles, and type for the given countryName
    const countryData = await CountryCount.findAll({
      where: {
        countryName: countryName,
      },
      attributes: ["countryName", "flagLogo", "Articles", "type"],
    });

    if (!countryData || countryData.length === 0) {
      return res.status(404).json({ error: "Country data not found" });
    }

    res.status(200).json(countryData);
  } catch (error) {
    console.error("Error fetching country data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCountry = async (req, res) => {
  try {
    await CountryCount.destroy({
      where: { countryName: req.body.country, type: req.body.type }, // Empty object means no specific conditions, so it will delete all entries
    });

    res.status(200).send("All countries are deleted !");
  } catch (error) {
    console.error("Error deleting countries:", error);
    res.status(500).send("An error occurred while deleting countries.");
  }
};

module.exports = {
  storeAllCountryArticles,
  addCountry,
  getaCountryArticle,
  deleteCountry,
};
