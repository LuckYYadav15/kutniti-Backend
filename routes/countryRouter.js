const countryController = require("../controllers/countryController");

const router = require("express").Router();
const cron = require("node-cron");

cron.schedule("10 0 * * *", () => {
  countryController.allcountryArticles();
});

router.post("/addCountry", countryController.addCountry);
router.get("/allcountryArticles", countryController.allcountryArticles);
router.post("/deleteCountry", countryController.deleteCountry);

module.exports = router;