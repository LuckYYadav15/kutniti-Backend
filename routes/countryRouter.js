const countryController = require("../controllers/countryController");

const router = require("express").Router();
const cron = require("node-cron");

cron.schedule("5 6 * * *", () => {
  countryController.storeAllCountryArticles();
});

router.post("/addCountry", countryController.addCountry);
router.get("/allcountryArticles", countryController.storeAllCountryArticles);
router.post("/deleteCountry", countryController.deleteCountry);
router.post("/getaCountryArticle", countryController.getaCountryArticle);
router.get("/getallCountryArticles", countryController.getallCountryArticles)

module.exports = router;
