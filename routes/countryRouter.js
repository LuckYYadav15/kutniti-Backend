const countryController = require("../controllers/countryController");

const router = require("express").Router();

cron.schedule("10 0 * * *", () => {
  countryController.allcountryArticles();
});

router.post("/addCountry", countryController.addCountry);
router.post("/countryArticles", countryController.allcountryArticles);

module.exports = router;
